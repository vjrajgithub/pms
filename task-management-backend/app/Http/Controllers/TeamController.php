<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Team::with(['project', 'projects', 'teamLead', 'members'])->withCount(['members']);

        // Apply role-based filtering
        if ($user->isTeamMember()) {
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id)->where('status', 'active');
            });
        } elseif ($user->isTeamLead()) {
            $query->where('team_lead_id', $user->id);
        }

        // Apply filters
        if ($request->has('project_id')) {
            $projectId = $request->project_id;
            $query->where(function ($q) use ($projectId) {
                // Legacy one-to-many column
                $q->where('project_id', $projectId)
                  // New many-to-many pivot
                  ->orWhereHas('projects', function ($sub) use ($projectId) {
                      $sub->where('projects.id', $projectId);
                  });
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $teams = $query->paginate($request->get('per_page', 15));

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        // Check permission using new RBAC system
        if (!auth()->user()->hasPermission('teams.create')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'team_lead_id' => 'required|exists:users,id',
            'max_members' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team = Team::create([
            'name' => $request->name,
            'description' => $request->description,
            'project_id' => $request->project_id ?: null,
            'team_lead_id' => $request->team_lead_id,
            'max_members' => $request->max_members,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Team created successfully',
            'team' => $team->load(['project', 'teamLead', 'creator'])
        ], 201);
    }

    public function show($id)
    {
        $team = Team::with(['project', 'teamLead', 'rooms'])
                    ->with(['teamMembers.user', 'tasks.assignedUser'])
                    ->findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $team);

        // For detail view, expose membership records under 'members'
        $team->setRelation('members', $team->teamMembers);

        return response()->json($team);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        // Authorize using policy
        $this->authorize('update', $team);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'team_lead_id' => 'sometimes|required|exists:users,id',
            'max_members' => 'nullable|integer|min:1',
            'status' => 'sometimes|required|in:active,inactive,completed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team->update($request->only([
            'name', 'description', 'team_lead_id', 'max_members', 'status'
        ]));

        return response()->json([
            'message' => 'Team updated successfully',
            'team' => $team->load(['project', 'teamLead', 'creator'])
        ]);
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);

        // Authorize using policy
        $this->authorize('delete', $team);

        $team->delete();

        return response()->json(['message' => 'Team deleted successfully']);
    }

    public function addMember(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        // Authorize using policy
        $this->authorize('addMember', $team);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:member,lead'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if user is already a member
        $existingMember = TeamMember::where('team_id', $id)
                                   ->where('user_id', $request->user_id)
                                   ->first();

        if ($existingMember) {
            return response()->json(['message' => 'User is already a team member'], 409);
        }

        // Check team capacity
        if ($team->max_members && $team->members()->count() >= $team->max_members) {
            return response()->json(['message' => 'Team has reached maximum capacity'], 409);
        }

        $teamMember = TeamMember::create([
            'team_id' => $id,
            'user_id' => $request->user_id,
            'role' => $request->role,
            'joined_at' => now(),
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Member added successfully',
            'member' => $teamMember->load('user')
        ], 201);
    }

    public function removeMember($id, $userId)
    {
        $team = Team::findOrFail($id);

        // Authorize using policy
        $this->authorize('removeMember', $team);

        $teamMember = TeamMember::where('team_id', $id)
                               ->where('user_id', $userId)
                               ->firstOrFail();

        $teamMember->delete();

        return response()->json(['message' => 'Member removed successfully']);
    }

    public function getMembers($id)
    {
        $team = Team::findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $team);

        // Return members with attached user details via TeamMember relation
        $members = $team->teamMembers()->with('user')->get();

        return response()->json($members);
    }

    public function getStats($id)
    {
        $team = Team::with(['projects', 'teamMembers.user'])->findOrFail($id);

        $this->authorize('view', $team);

        $projectIds = $team->projects->pluck('id')->unique()->values()->all();
        if ($team->project_id && !in_array($team->project_id, $projectIds)) {
            $projectIds[] = $team->project_id;
        }

        if (empty($projectIds)) {
            return response()->json([
                'projects' => [],
                'members' => [],
                'summary' => [
                    'tasks' => [
                        'total' => 0,
                        'completed' => 0,
                        'pending' => 0,
                        'in_progress' => 0,
                        'review' => 0,
                        'cancelled' => 0,
                    ],
                    'progress_percentage' => 0,
                ],
            ]);
        }

        $projects = Project::whereIn('id', $projectIds)->get()->keyBy('id');
        $tasks = Task::whereIn('project_id', $projectIds)->get();

        $statusKeys = ['pending', 'in_progress', 'review', 'completed', 'cancelled'];

        $projectsStats = [];
        foreach ($projects as $projectId => $project) {
            $projectTasks = $tasks->where('project_id', $projectId);
            $total = $projectTasks->count();
            $counts = [];
            foreach ($statusKeys as $status) {
                $counts[$status] = $projectTasks->where('status', $status)->count();
            }
            $completed = $counts['completed'] ?? 0;

            $projectsStats[] = [
                'id' => $project->id,
                'name' => $project->name,
                'tasks' => array_merge([
                    'total' => $total,
                ], $counts),
                'progress_percentage' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            ];
        }

        $membersStats = [];
        foreach ($team->teamMembers as $member) {
            $user = $member->user;
            if (!$user) continue;

            $userTasks = $tasks->where('assigned_to', $user->id);
            $total = $userTasks->count();
            $counts = [];
            foreach ($statusKeys as $status) {
                $counts[$status] = $userTasks->where('status', $status)->count();
            }
            $completed = $counts['completed'] ?? 0;

            $membersStats[] = [
                'id' => $user->id,
                'full_name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                'email' => $user->email,
                'tasks' => array_merge([
                    'total' => $total,
                ], $counts),
                'progress_percentage' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            ];
        }

        $totalTasks = $tasks->count();
        $summaryCounts = [];
        foreach ($statusKeys as $status) {
            $summaryCounts[$status] = $tasks->where('status', $status)->count();
        }
        $summaryCompleted = $summaryCounts['completed'] ?? 0;

        // Recent tasks (latest 5)
        $recentTasks = Task::whereIn('project_id', $projectIds)
            ->with('assignedUser')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'assigned_user' => $task->assignedUser ? [
                        'id' => $task->assignedUser->id,
                        'full_name' => trim(($task->assignedUser->first_name ?? '') . ' ' . ($task->assignedUser->last_name ?? '')),
                    ] : null,
                ];
            })
            ->toArray();

        return response()->json([
            'projects' => array_values($projectsStats),
            'members' => array_values($membersStats),
            'summary' => [
                'tasks' => array_merge([
                    'total' => $totalTasks,
                ], $summaryCounts),
                'progress_percentage' => $totalTasks > 0 ? round(($summaryCompleted / $totalTasks) * 100, 2) : 0,
            ],
            'recent_tasks' => $recentTasks,
        ]);
    }
}
