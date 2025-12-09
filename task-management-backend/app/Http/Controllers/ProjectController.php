<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Project::with(['manager', 'teamLead', 'teams.members'])
            ->withCount([
                'teams',
                'tasks',
                'tasks as completed_tasks_count' => function ($q) {
                    $q->where('status', 'completed');
                },
            ]);

        // Role-based filtering
        if ($user->isTeamLead()) {
            $query->where('team_lead_id', $user->id);
        } elseif ($user->isTeamMember()) {
            // Filter projects where user is an active team member
            $query->whereHas('teams', function ($q) use ($user) {
                $q->whereHas('members', function ($subQ) use ($user) {
                    $subQ->where('users.id', $user->id)
                         ->where('team_members.status', 'active');
                });
            });
        } elseif ($user->isManager()) {
            // Managers see all projects they manage
            $query->where('manager_id', $user->id);
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $projects = $query->paginate($request->get('per_page', 15));

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        // Check permission using new RBAC system
        if (!auth()->user()->hasPermission('projects.create')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:planning,active,on_hold,completed,cancelled',
            'priority' => 'required|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'team_lead_id' => 'nullable|exists:users,id',
            'team_id' => 'nullable|exists:teams,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Determine effective team lead: either explicit team_lead_id or derived from selected team
        $effectiveTeamLeadId = $request->team_lead_id;

        if ($request->team_id) {
            $team = Team::find($request->team_id);
            if ($team && $team->team_lead_id) {
                $effectiveTeamLeadId = $team->team_lead_id;
            }
        }

        // Validate team lead role if we have one
        if ($effectiveTeamLeadId) {
            $teamLead = User::find($effectiveTeamLeadId);
            if (!$teamLead || !$teamLead->isTeamLead()) {
                return response()->json(['error' => 'Selected user is not a team lead'], 422);
            }
        }

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'budget' => $request->budget,
            'manager_id' => auth()->id(),
            'team_lead_id' => $effectiveTeamLeadId,
            'settings' => $request->settings ?? []
        ]);

        // If a team was selected, link it to this project (many-to-many) and keep legacy project_id
        if ($request->team_id && isset($team)) {
            $project->teams()->syncWithoutDetaching([$team->id]);
            $team->project_id = $project->id;
            $team->save();
        }

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project->load(['manager', 'teamLead'])
        ], 201);
    }

    public function show($id)
    {
        $project = Project::with(['manager', 'teamLead', 'teams.teamLead', 'teams.members', 'tasks'])
            ->findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $project);

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $user = auth()->user();

        // Authorize using policy
        $this->authorize('update', $project);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:planning,active,on_hold,completed,cancelled',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
            'budget' => 'sometimes|nullable|numeric|min:0',
            'progress' => 'sometimes|nullable|integer|min:0|max:100',
            'team_lead_id' => 'sometimes|nullable|exists:users,id',
            'team_id' => 'sometimes|nullable|exists:teams,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Determine effective team lead on update
        $data = $request->only([
            'name', 'description', 'status', 'priority', 
            'start_date', 'end_date', 'budget', 'progress', 'team_lead_id', 'settings'
        ]);

        $effectiveTeamLeadId = $data['team_lead_id'] ?? $project->team_lead_id;
        $selectedTeam = null;

        if ($request->has('team_id') && $request->team_id) {
            $selectedTeam = Team::find($request->team_id);
            if ($selectedTeam && $selectedTeam->team_lead_id) {
                $effectiveTeamLeadId = $selectedTeam->team_lead_id;
            }
        }

        if (array_key_exists('team_lead_id', $data)) {
            $data['team_lead_id'] = $effectiveTeamLeadId;
        }

        // Validate team lead role if we are changing or deriving it
        if ($effectiveTeamLeadId) {
            $teamLead = User::find($effectiveTeamLeadId);
            if (!$teamLead || !$teamLead->isTeamLead()) {
                return response()->json(['error' => 'Selected user is not a team lead'], 422);
            }
        }

        // Track old status for notification
        $oldStatus = $project->status;
        $newStatus = $data['status'] ?? $oldStatus;

        $project->update($data);

        // If a team was selected, link it to this project (many-to-many) and keep legacy project_id
        if ($selectedTeam) {
            $project->teams()->syncWithoutDetaching([$selectedTeam->id]);
            $selectedTeam->project_id = $project->id;
            $selectedTeam->save();
        }

        // Send notification if status changed
        if ($oldStatus !== $newStatus) {
            $this->notifyProjectStatusChange($project, $user, $oldStatus, $newStatus);
        }

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->load(['manager', 'teamLead'])
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Authorize using policy
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function assignTeamLead(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Authorize using policy
        $this->authorize('manageTeam', $project);

        $validator = Validator::make($request->all(), [
            'team_lead_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $teamLead = User::find($request->team_lead_id);
        if (!$teamLead->isTeamLead()) {
            return response()->json(['error' => 'Selected user is not a team lead'], 422);
        }

        $project->update(['team_lead_id' => $request->team_lead_id]);

        return response()->json([
            'message' => 'Team lead assigned successfully',
            'project' => $project->load(['manager', 'teamLead'])
        ]);
    }

    public function getStats($id)
    {
        $project = Project::findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $project);

        $stats = [
            'tasks' => [
                'total' => $project->tasks()->count(),
                'completed' => $project->tasks()->where('status', 'completed')->count(),
                'pending' => $project->tasks()->where('status', 'pending')->count(),
                'in_progress' => $project->tasks()->where('status', 'in_progress')->count(),
                'overdue' => $project->tasks()->where('deadline', '<', now())
                    ->whereNotIn('status', ['completed', 'cancelled'])->count(),
            ],
            'teams' => [
                'total' => $project->teams()->count(),
            ],
            'members' => [
                'total' => $project->team_members_count,
            ],
            'progress_percentage' => $project->progress,
            'budget_used' => 0, // Calculate based on actual implementation
            'days_remaining' => $project->end_date ? now()->diffInDays($project->end_date, false) : null
        ];

        return response()->json($stats);
    }

    /**
     * Notify team members about project status change
     */
    private function notifyProjectStatusChange($project, $user, $oldStatus, $newStatus)
    {
        try {
            // Get all team members from project teams
            $teamMembers = $project->teams()
                ->with('members')
                ->get()
                ->flatMap(function ($team) {
                    return $team->members;
                })
                ->unique('id')
                ->filter(function ($member) use ($user) {
                    // Exclude the user who made the change
                    return $member->id !== $user->id;
                });

            // Also include project manager and team lead
            if ($project->manager_id && $project->manager_id !== $user->id) {
                $manager = User::find($project->manager_id);
                if ($manager && !$teamMembers->contains('id', $manager->id)) {
                    $teamMembers->push($manager);
                }
            }

            if ($project->team_lead_id && $project->team_lead_id !== $user->id) {
                $teamLead = User::find($project->team_lead_id);
                if ($teamLead && !$teamMembers->contains('id', $teamLead->id)) {
                    $teamMembers->push($teamLead);
                }
            }

            // Create notifications
            $statusLabel = ucfirst(str_replace('_', ' ', $newStatus));
            $userName = $user->first_name . ' ' . $user->last_name;

            foreach ($teamMembers as $member) {
                Notification::create([
                    'user_id' => $member->id,
                    'title' => 'Project Status Changed',
                    'message' => "{$userName} changed project \"{$project->name}\" status to {$statusLabel}",
                    'type' => 'project_status_change',
                    'priority' => $newStatus === 'completed' ? 'high' : 'medium',
                    'action_url' => "/projects/{$project->id}",
                    'data' => [
                        'project_id' => $project->id,
                        'old_status' => $oldStatus,
                        'new_status' => $newStatus,
                        'changed_by' => $user->id
                    ]
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the status update
            \Log::error('Failed to send project status change notifications: ' . $e->getMessage());
        }
    }
}
