<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Task::with(['project', 'assignedUser', 'creator']);

        // Role-based filtering
        if ($user->isTeamMember()) {
            $query->where('assigned_to', $user->id);
        } elseif ($user->isTeamLead()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhere('created_by', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('team_lead_id', $user->id);
                  });
            });
        }

        // Filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('overdue') && $request->overdue) {
            $query->where('deadline', '<', now())
                  ->whereNotIn('status', ['completed', 'cancelled']);
        }

        $tasks = $query->orderBy('priority', 'desc')
                      ->orderBy('deadline', 'asc')
                      ->paginate($request->get('per_page', 15));

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Check permission - managers, team leads, and admins can create tasks
        $canCreate = $user->isSuperAdmin() || 
                     $user->isAdmin() || 
                     $user->isManager() || 
                     $user->isTeamLead() ||
                     $user->hasPermission('tasks.create');
        
        if (!$canCreate) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'sometimes|in:pending,in_progress,review,completed,cancelled',
            'deadline' => 'nullable|date|after:now',
            'estimated_hours' => 'nullable|integer|min:1',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'recurrence_type' => 'sometimes|in:none,daily,weekly,monthly',
            'recurrence_settings' => 'nullable|array',
            'tags' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check project access
        if (!$user->canAccessProject($request->project_id)) {
            return response()->json(['error' => 'No access to this project'], 403);
        }

        // Validate assigned user has access to project
        // Relax rule: allow managers or users with manage/assign permissions to assign outside members
        if ($request->assigned_to) {
            $assignedUser = User::find($request->assigned_to);
            $mayAssignOutside = $user->isManager()
                || $user->hasPermission('projects', 'manage')
                || $user->hasPermission('teams', 'manage')
                || $user->hasPermission('tasks', 'assign');

            if (!$assignedUser->canAccessProject($request->project_id) && !$mayAssignOutside) {
                return response()->json(['error' => 'Assigned user has no access to this project'], 422);
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'status' => $request->status ?? 'pending',
            'deadline' => $request->deadline,
            'estimated_hours' => $request->estimated_hours,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
            'created_by' => $user->id,
            'parent_task_id' => $request->parent_task_id,
            'recurrence_type' => $request->recurrence_type ?? 'none',
            'recurrence_settings' => $request->recurrence_settings,
            'tags' => $request->tags
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['project', 'assignedUser', 'creator'])
        ], 201);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'assignedUser', 'creator', 'attachments', 'comments.user'])
            ->findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $task);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = auth()->user();

        // Authorize using policy
        $this->authorize('update', $task);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:pending,in_progress,review,completed,cancelled',
            'deadline' => 'sometimes|nullable|date',
            'estimated_hours' => 'sometimes|nullable|integer|min:1',
            'actual_hours' => 'sometimes|nullable|integer|min:0',
            'progress' => 'sometimes|numeric|min:0|max:100',
            'assigned_to' => 'sometimes|nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Team members can only update their own tasks' status and progress
        if ($user->isTeamMember() && $task->assigned_to === $user->id) {
            $allowedFields = ['status', 'progress', 'actual_hours'];
            $updateData = $request->only($allowedFields);
        } else {
            $updateData = $request->only([
                'title', 'description', 'priority', 'status', 'deadline',
                'estimated_hours', 'actual_hours', 'progress', 'assigned_to'
            ]);
        }

        // Auto-complete task if progress is 100%
        if (isset($updateData['progress']) && $updateData['progress'] >= 100) {
            $updateData['status'] = 'completed';
            $updateData['completed_at'] = now();
        }

        // Track old status for notification
        $oldStatus = $task->status;
        $newStatus = $updateData['status'] ?? $oldStatus;

        $task->update($updateData);

        // Send notification if status changed
        if ($oldStatus !== $newStatus) {
            $this->notifyStatusChange($task, $user, $oldStatus, $newStatus);
        }

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->load(['project', 'assignedUser', 'creator'])
        ]);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        // Authorize using policy
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = auth()->user();

        // Authorize using policy
        $this->authorize('changeStatus', $task);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,review,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldStatus = $task->status;
        $updateData = ['status' => $request->status];
        
        if ($request->status === 'completed') {
            $updateData['progress'] = 100;
            $updateData['completed_at'] = now();
        }

        $task->update($updateData);

        // Send notification for status change
        $this->notifyStatusChange($task, $user, $oldStatus, $request->status);

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task->load(['project', 'assignedUser'])
        ]);
    }

    public function updateProgress(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // Authorize using policy
        $this->authorize('changeStatus', $task);

        $validator = Validator::make($request->all(), [
            'progress' => 'required|numeric|min:0|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->updateProgress($request->progress);

        return response()->json([
            'message' => 'Task progress updated successfully',
            'task' => $task->load(['project', 'assignedUser'])
        ]);
    }

    public function getKanbanBoard(Request $request)
    {
        $user = auth()->user();
        $query = Task::with(['assignedUser', 'project']);

        // Apply role-based filtering
        if ($user->isTeamMember()) {
            $query->where('assigned_to', $user->id);
        } elseif ($user->isTeamLead()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereHas('project', function ($pq) use ($user) {
                      $pq->where('team_lead_id', $user->id);
                  });
            });
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $tasks = $query->get()->groupBy('status');

        $kanbanBoard = [
            'pending' => $tasks->get('pending', collect()),
            'in_progress' => $tasks->get('in_progress', collect()),
            'review' => $tasks->get('review', collect()),
            'completed' => $tasks->get('completed', collect())
        ];

        return response()->json($kanbanBoard);
    }

    public function moveTask(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = auth()->user();

        // Authorize using policy
        $this->authorize('changeStatus', $task);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,review,completed,cancelled',
            'position' => 'sometimes|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldStatus = $task->status;
        $updateData = ['status' => $request->status];
        
        if ($request->status === 'completed') {
            $updateData['progress'] = 100;
            $updateData['completed_at'] = now();
        }

        $task->update($updateData);

        // Send notification for status change (kanban board move)
        $this->notifyStatusChange($task, $user, $oldStatus, $request->status);

        return response()->json([
            'message' => 'Task moved successfully',
            'task' => $task
        ]);
    }

    /**
     * Notify team members about task status change
     */
    private function notifyStatusChange($task, $user, $oldStatus, $newStatus)
    {
        try {
            $project = $task->project;
            if (!$project) {
                return;
            }

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

            // Also include the task assignee if not already included
            if ($task->assigned_to && $task->assigned_to !== $user->id) {
                $assignee = User::find($task->assigned_to);
                if ($assignee && !$teamMembers->contains('id', $assignee->id)) {
                    $teamMembers->push($assignee);
                }
            }

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
                    'title' => 'Task Status Changed',
                    'message' => "{$userName} changed task \"{$task->title}\" status to {$statusLabel}",
                    'type' => 'task_status_change',
                    'priority' => $newStatus === 'completed' ? 'high' : 'medium',
                    'action_url' => "/tasks/{$task->id}",
                    'data' => [
                        'task_id' => $task->id,
                        'project_id' => $project->id,
                        'old_status' => $oldStatus,
                        'new_status' => $newStatus,
                        'changed_by' => $user->id
                    ]
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the status update
            \Log::error('Failed to send task status change notifications: ' . $e->getMessage());
        }
    }
}
