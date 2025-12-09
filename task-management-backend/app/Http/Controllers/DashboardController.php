<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = auth()->user();
        
        // Base queries with role-based filtering
        $projectsQuery = Project::query();
        $tasksQuery = Task::query();
        $teamsQuery = Team::query();
        
        // Role-specific scoping
        if ($user->isManager()) {
            // Manager: only projects they manage, tasks in those projects or created/assigned to them,
            // and teams under their projects or created by them
            $projectsQuery->where('manager_id', $user->id);

            $tasksQuery->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assigned_to', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('manager_id', $user->id);
                  });
            });

            $teamsQuery->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('manager_id', $user->id);
                  });
            });
        } elseif ($user->isTeamLead()) {
            // Team Lead: projects they lead, tasks they are assigned or under those projects,
            // and teams they lead
            $projectsQuery->where('team_lead_id', $user->id);
            $tasksQuery->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('team_lead_id', $user->id);
                  });
            });
            $teamsQuery->where('team_lead_id', $user->id);
        } elseif ($user->isTeamMember()) {
            // Team Member: projects and teams where they are an active member,
            // and tasks assigned to them
            $projectsQuery->whereHas('teams.members', function ($q) use ($user) {
                // members is a belongsToMany(User::class, 'team_members')
                // So we must qualify columns to avoid ambiguity between users.status and team_members.status
                $q->where('users.id', $user->id)
                  ->where('team_members.status', 'active');
            });

            $tasksQuery->where('assigned_to', $user->id);

            $teamsQuery->whereHas('members', function ($q) use ($user) {
                $q->where('users.id', $user->id)
                  ->where('team_members.status', 'active');
            });
        }

        // Project stats
        $totalProjects = $projectsQuery->count();
        $activeProjects = (clone $projectsQuery)->where('status', 'active')->count();
        $completedProjects = (clone $projectsQuery)->where('status', 'completed')->count();

        // Task stats
        $totalTasks = $tasksQuery->count();
        $pendingTasks = (clone $tasksQuery)->where('status', 'pending')->count();
        $inProgressTasks = (clone $tasksQuery)->where('status', 'in_progress')->count();
        $completedTasks = (clone $tasksQuery)->where('status', 'completed')->count();
        $overdueTasks = (clone $tasksQuery)->where('deadline', '<', now())
            ->whereNotIn('status', ['completed', 'cancelled'])->count();

        // Team stats
        $totalTeams = $teamsQuery->count();
        $activeTeams = (clone $teamsQuery)->where('status', 'active')->count();

        // Upcoming deadlines (next 7 days)
        $upcomingDeadlines = (clone $tasksQuery)
            ->whereBetween('deadline', [now(), now()->addDays(7)])
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->with(['project', 'assignedUser'])
            ->orderBy('deadline')
            ->limit(5)
            ->get();

        // Recent tasks
        $recentTasks = (clone $tasksQuery)
            ->with(['project', 'assignedUser'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Priority distribution
        $priorityStats = (clone $tasksQuery)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();

        // Status distribution
        $statusStats = (clone $tasksQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Performance metrics
        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0;
        $overdueRate = $totalTasks > 0 ? round(($overdueTasks / $totalTasks) * 100, 2) : 0;

        return response()->json([
            'overview' => [
                'total_projects' => $totalProjects,
                'active_projects' => $activeProjects,
                'completed_projects' => $completedProjects,
                'total_tasks' => $totalTasks,
                'pending_tasks' => $pendingTasks,
                'in_progress_tasks' => $inProgressTasks,
                'completed_tasks' => $completedTasks,
                'overdue_tasks' => $overdueTasks,
                'total_teams' => $totalTeams,
                'active_teams' => $activeTeams,
            ],
            'metrics' => [
                'completion_rate' => $completionRate,
                'overdue_rate' => $overdueRate,
            ],
            'charts' => [
                'priority_distribution' => $priorityStats,
                'status_distribution' => $statusStats,
            ],
            'upcoming_deadlines' => $upcomingDeadlines,
            'recent_tasks' => $recentTasks,
        ]);
    }

    public function getRecentActivities(Request $request)
    {
        $user = auth()->user();
        $limit = $request->get('limit', 10);

        $query = ActivityLog::with('user')
            ->orderBy('created_at', 'desc');

        // Role-based filtering
        if ($user->isTeamLead()) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere(function ($subQ) use ($user) {
                      $subQ->where('subject_type', 'Task')
                           ->whereIn('subject_id', function ($taskQ) use ($user) {
                               $taskQ->select('id')
                                    ->from('tasks')
                                    ->whereHas('project', function ($projQ) use ($user) {
                                        $projQ->where('team_lead_id', $user->id);
                                    });
                           });
                  });
            });
        } elseif ($user->isTeamMember()) {
            $query->where('user_id', $user->id);
        }

        $activities = $query->limit($limit)->get();

        return response()->json($activities);
    }

    public function getTaskAnalytics(Request $request)
    {
        $user = auth()->user();
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        $tasksQuery = Task::query();

        // Apply role-based filtering
        if ($user->isTeamLead()) {
            $tasksQuery->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('team_lead_id', $user->id);
                  });
            });
        } elseif ($user->isTeamMember()) {
            $tasksQuery->where('assigned_to', $user->id);
        }

        // Task creation trend
        $taskCreationTrend = (clone $tasksQuery)
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Task completion trend
        $taskCompletionTrend = (clone $tasksQuery)
            ->where('completed_at', '>=', $startDate)
            ->whereNotNull('completed_at')
            ->select(DB::raw('DATE(completed_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Average completion time
        $avgCompletionTime = (clone $tasksQuery)
            ->whereNotNull('completed_at')
            ->where('completed_at', '>=', $startDate)
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours'))
            ->value('avg_hours');

        return response()->json([
            'task_creation_trend' => $taskCreationTrend,
            'task_completion_trend' => $taskCompletionTrend,
            'average_completion_time_hours' => round($avgCompletionTime ?? 0, 2),
        ]);
    }
}
