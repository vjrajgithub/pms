<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectComment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProjectCommentController extends Controller
{
    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);
        if (!auth()->user()->canAccessProject($projectId)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comments = ProjectComment::with(['user', 'replies.user'])
            ->where('project_id', $projectId)
            ->topLevel()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $projectId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'parent_id' => 'nullable|exists:project_comments,id',
            'attachments.*' => 'file|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::with(['teams.members'])->findOrFail($projectId);
        $currentUser = Auth::user();

        $comment = ProjectComment::create([
            'project_id' => $projectId,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'parent_id' => $request->parent_id,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('project_comment_attachments', 'public');
                $existing = $comment->attachment_paths ?? [];
                $existing[] = $path;
                $comment->attachment_paths = $existing;
            }
            $comment->save();
        }

        // Send notifications to all team members
        $this->sendCommentNotifications($project, $comment, $currentUser);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user')
        ], 201);
    }

    private function sendCommentNotifications(Project $project, ProjectComment $comment, $currentUser)
    {
        try {
            // Collect all unique team member IDs
            $recipientIds = collect();

            if ($project->teams) {
                foreach ($project->teams as $team) {
                    if ($team->members) {
                        foreach ($team->members as $member) {
                            // Don't notify the comment author
                            if ($member->id !== $currentUser->id) {
                                $recipientIds->push($member->id);
                            }
                        }
                    }
                }
            }

            // Remove duplicates
            $recipientIds = $recipientIds->unique()->values();

            // Create notifications for each recipient
            $commentPreview = substr($comment->comment, 0, 50) . (strlen($comment->comment) > 50 ? '...' : '');
            $commenterName = $currentUser->first_name . ' ' . $currentUser->last_name;

            foreach ($recipientIds as $userId) {
                Notification::create([
                    'user_id' => $userId,
                    'title' => 'New Comment on Project',
                    'message' => "{$commenterName} commented on project \"{$project->name}\": \"{$commentPreview}\"",
                    'type' => 'project_comment',
                    'priority' => 'medium',
                    'action_url' => "/projects/{$project->id}#comments",
                    'data' => [
                        'project_id' => $project->id,
                        'project_name' => $project->name,
                        'comment_id' => $comment->id,
                        'commenter_name' => $commenterName
                    ]
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the comment creation
            \Log::error('Failed to send comment notifications: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'sometimes|nullable|string',
            'attachments.*' => 'file|max:5120',
            'remove_attachment_paths' => 'sometimes|array',
            'remove_attachment_paths.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = ProjectComment::where('user_id', Auth::id())->findOrFail($id);

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
                $saved = $file->store('project_comment_attachments', 'public');
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
        $comment = ProjectComment::where('user_id', Auth::id())->findOrFail($id);

        if ($comment->created_at->lt(now()->subMinute())) {
            return response()->json(['error' => 'Deletion window expired'], 403);
        }

        $this->deleteRepliesRecursive($comment);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    private function deleteRepliesRecursive(ProjectComment $comment)
    {
        foreach ($comment->replies as $reply) {
            $this->deleteRepliesRecursive($reply);
            $reply->delete();
        }
    }
}
