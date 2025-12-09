<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;

class ReportController extends Controller
{
    public function projectReports(Request $request)
    {
        $user = Auth::user();
        $query = Project::with(['tasks', 'teams', 'manager']);

        // Apply role-based filtering
        if ($user->isTeamLead()) {
            $query->where('team_lead_id', $user->id);
        } elseif ($user->isTeamMember()) {
            $query->whereHas('teams.members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        // Apply date filters
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $projects = $query->get()->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status,
                'total_tasks' => $project->tasks->count(),
                'completed_tasks' => $project->tasks->where('status', 'completed')->count(),
                'pending_tasks' => $project->tasks->where('status', 'pending')->count(),
                'in_progress_tasks' => $project->tasks->where('status', 'in_progress')->count(),
                'overdue_tasks' => $project->tasks->where('deadline', '<', now())->where('status', '!=', 'completed')->count(),
                'completion_rate' => $project->tasks->count() > 0 ? 
                    round(($project->tasks->where('status', 'completed')->count() / $project->tasks->count()) * 100, 2) : 0,
                'team_count' => $project->teams->count(),
                'created_at' => $project->created_at,
                'deadline' => $project->deadline
            ];
        });

        return response()->json($projects);
    }

    public function teamReports(Request $request)
    {
        $user = Auth::user();
        $query = Team::with(['members.user', 'tasks', 'project']);

        // Apply role-based filtering
        if ($user->isTeamLead()) {
            $query->where('team_lead_id', $user->id);
        } elseif ($user->isTeamMember()) {
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $teams = $query->get()->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->name,
                'project_name' => $team->project->name,
                'member_count' => $team->members->count(),
                'active_members' => $team->members->where('status', 'active')->count(),
                'total_tasks' => $team->tasks->count(),
                'completed_tasks' => $team->tasks->where('status', 'completed')->count(),
                'completion_rate' => $team->tasks->count() > 0 ? 
                    round(($team->tasks->where('status', 'completed')->count() / $team->tasks->count()) * 100, 2) : 0,
                'created_at' => $team->created_at
            ];
        });

        return response()->json($teams);
    }

    public function taskReports(Request $request)
    {
        $user = Auth::user();
        $query = Task::with(['assignedUser', 'creator', 'project', 'team']);

        // Apply role-based filtering
        if ($user->isTeamLead()) {
            $query->where('created_by', $user->id)
                  ->orWhere('assigned_to', $user->id);
        } elseif ($user->isTeamMember()) {
            $query->where('assigned_to', $user->id);
        }

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $tasks = $query->get()->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'status' => $task->status,
                'priority' => $task->priority,
                'progress' => $task->progress,
                'assigned_to' => $task->assignedUser->full_name ?? 'Unassigned',
                'created_by' => $task->creator->full_name,
                'project_name' => $task->project->name,
                'team_name' => $task->team->name ?? 'No Team',
                'deadline' => $task->deadline,
                'is_overdue' => $task->deadline && $task->deadline < now() && $task->status !== 'completed',
                'created_at' => $task->created_at,
                'completed_at' => $task->completed_at
            ];
        });

        return response()->json($tasks);
    }

    public function userReports(Request $request)
    {
        if (!Auth::user()->isManager()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with(['assignedTasks', 'createdTasks', 'role'])
                    ->get()
                    ->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->full_name,
                            'email' => $user->email,
                            'role' => $user->role->display_name,
                            'total_assigned_tasks' => $user->assignedTasks->count(),
                            'completed_tasks' => $user->assignedTasks->where('status', 'completed')->count(),
                            'pending_tasks' => $user->assignedTasks->where('status', 'pending')->count(),
                            'in_progress_tasks' => $user->assignedTasks->where('status', 'in_progress')->count(),
                            'overdue_tasks' => $user->assignedTasks->where('deadline', '<', now())->where('status', '!=', 'completed')->count(),
                            'completion_rate' => $user->assignedTasks->count() > 0 ? 
                                round(($user->assignedTasks->where('status', 'completed')->count() / $user->assignedTasks->count()) * 100, 2) : 0,
                            'created_tasks' => $user->createdTasks->count(),
                            'last_login' => $user->last_login_at,
                            'status' => $user->status
                        ];
                    });

        return response()->json($users);
    }

    public function exportPDF(Request $request)
    {
        $reportType = $request->input('type', 'projects');
        $data = $this->getReportData($reportType, $request);

        $pdf = PDF::loadView('reports.pdf', [
            'type' => $reportType,
            'data' => $data,
            'generated_at' => now(),
            'generated_by' => Auth::user()->full_name
        ]);

        return $pdf->download($reportType . '_report_' . now()->format('Y-m-d') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $reportType = $request->input('type', 'projects');
        $data = $this->getReportData($reportType, $request);

        return Excel::download(
            new ReportExport($data, $reportType),
            $reportType . '_report_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    private function getReportData($type, $request)
    {
        switch ($type) {
            case 'projects':
                return $this->projectReports($request)->getData();
            case 'teams':
                return $this->teamReports($request)->getData();
            case 'tasks':
                return $this->taskReports($request)->getData();
            case 'users':
                return $this->userReports($request)->getData();
            default:
                return [];
        }
    }

    public function getDashboardCharts()
    {
        $user = Auth::user();
        
        // Base tasks query with role-based scoping
        $tasksQuery = DB::table('tasks');

        if ($user->isManager()) {
            // Manager: tasks they created/assigned or in projects they manage
            $tasksQuery->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assigned_to', $user->id)
                  ->orWhereIn('project_id', function ($sub) use ($user) {
                      $sub->select('id')
                          ->from('projects')
                          ->where('manager_id', $user->id);
                  });
            });
        } elseif ($user->isTeamLead()) {
            // Team Lead: tasks assigned to them or in projects they lead
            $tasksQuery->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereIn('project_id', function ($sub) use ($user) {
                      $sub->select('id')
                          ->from('projects')
                          ->where('team_lead_id', $user->id);
                  });
            });
        } elseif ($user->isTeamMember()) {
            // Team Member: only tasks assigned to them
            $tasksQuery->where('assigned_to', $user->id);
        }

        // Task completion over time (last 30 days)
        $taskCompletionData = (clone $tasksQuery)
            ->select(DB::raw('DATE(completed_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('completed_at', '>=', now()->subDays(30))
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Task status distribution
        $taskStatusData = (clone $tasksQuery)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Priority distribution
        $priorityData = (clone $tasksQuery)
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->get();

        // Team performance (join tasks via project_team pivot since tasks.team_id doesn't exist)
        $teamPerformanceData = DB::table('teams')
            ->leftJoin('project_team', 'teams.id', '=', 'project_team.team_id')
            ->leftJoin('tasks', 'project_team.project_id', '=', 'tasks.project_id')
            ->select(
                'teams.id',
                'teams.name',
                DB::raw('COUNT(tasks.id) as total_tasks'),
                DB::raw('SUM(CASE WHEN tasks.status = "completed" THEN 1 ELSE 0 END) as completed_tasks')
            )
            ->groupBy('teams.id', 'teams.name')
            ->get();

        return response()->json([
            'task_completion' => $taskCompletionData,
            'task_status' => $taskStatusData,
            'priority_distribution' => $priorityData,
            'team_performance' => $teamPerformanceData
        ]);
    }
}
