<?php

namespace App\Http\Controllers;

use App\Models\TaskComment;
use App\Models\Task;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskCommentController extends Controller
{
    public function index($taskId)
    {
        $task = Task::findOrFail($taskId);
        
        $comments = TaskComment::with(['user', 'replies.user'])
                              ->where('task_id', $taskId)
                              ->topLevel()
                              ->orderBy('created_at', 'desc')
                              ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $taskId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'parent_id' => 'nullable|exists:task_comments,id',
            'attachments.*' => 'file|max:5120' // each up to 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::findOrFail($taskId);
        $currentUser = Auth::user();

        $comment = TaskComment::create([
            'task_id' => $taskId,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'parent_id' => $request->parent_id
        ]);

        // Optional: save attachments if provided
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('task_comment_attachments', 'public');
                // If you have a TaskAttachment model, you can create records here
                // or attach to a pivot. For now, we can push a simple path on the model if cast exists.
                // Assuming TaskComment has a json column 'attachment_paths'
                $existing = $comment->attachment_paths ?? [];
                $existing[] = $path;
                $comment->attachment_paths = $existing;
            }
            $comment->save();
        }

        // Send notifications to team members
        $this->notifyTeamMembers($task, $currentUser, $comment);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user')
        ], 201);
    }

    /**
     * Notify all team members about the new comment
     */
    private function notifyTeamMembers($task, $commentUser, $comment)
    {
        // Get all team members from the project's teams
        $project = $task->project;
        if (!$project) {
            return;
        }

        // Get all team members from teams associated with this project
        $teamMembers = $project->teams()
            ->with('members')
            ->get()
            ->flatMap(function ($team) {
                return $team->members;
            })
            ->unique('id')
            ->filter(function ($member) use ($commentUser) {
                // Exclude the comment author
                return $member->id !== $commentUser->id;
            });

        // Also include the task assignee if they're not already included
        if ($task->assigned_to && $task->assigned_to !== $commentUser->id) {
            $assignee = \App\Models\User::find($task->assigned_to);
            if ($assignee && !$teamMembers->contains('id', $assignee->id)) {
                $teamMembers->push($assignee);
            }
        }

        // Create notifications for each team member
        foreach ($teamMembers as $member) {
            Notification::create([
                'user_id' => $member->id,
                'title' => 'New Comment on Task',
                'message' => "{$commentUser->first_name} {$commentUser->last_name} commented on task: {$task->title}",
                'type' => 'task_comment',
                'priority' => 'medium',
                'action_url' => "/tasks/{$task->id}",
                'data' => [
                    'task_id' => $task->id,
                    'comment_id' => $comment->id,
                    'commented_by' => $commentUser->id,
                    'project_id' => $project->id
                ]
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'sometimes|nullable|string',
            'attachments.*' => 'file|max:5120',
            'remove_attachment_paths' => 'sometimes|array',
            'remove_attachment_paths.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = TaskComment::where('user_id', Auth::id())->findOrFail($id);

        $dataChanged = false;

        if ($request->has('comment')) {
            $comment->comment = $request->comment;
            $dataChanged = true;
        }

        $paths = $comment->attachment_paths ?? [];

        if ($request->filled('remove_attachment_paths')) {
            $toRemove = $request->input('remove_attachment_paths', []);
            if (is_array($toRemove) && !empty($toRemove)) {
                foreach ($toRemove as $p) {
                    if (in_array($p, $paths, true)) {
                        Storage::disk('public')->delete($p);
                    }
                }
                $paths = array_values(array_filter($paths, function ($p) use ($toRemove) {
                    return !in_array($p, $toRemove, true);
                }));
                $dataChanged = true;
            }
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $saved = $file->store('task_comment_attachments', 'public');
                $paths[] = $saved;
            }
            $dataChanged = true;
        }

        if ($dataChanged) {
            $comment->attachment_paths = $paths;
            $comment->save();
        }

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment->load('user')
        ]);
    }

    public function destroy($id)
    {
        $comment = TaskComment::where('user_id', Auth::id())->findOrFail($id);

        // Allow deletion only within 1 minute of creation
        if ($comment->created_at->lt(now()->subMinute())) {
            return response()->json(['error' => 'Deletion window expired'], 403);
        }

        // Recursively delete all nested replies
        $this->deleteRepliesRecursive($comment);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    private function deleteRepliesRecursive(TaskComment $comment)
    {
        foreach ($comment->replies as $reply) {
            $this->deleteRepliesRecursive($reply);
            $reply->delete();
        }
    }
}
