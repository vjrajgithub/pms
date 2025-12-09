<?php

namespace App\Http\Controllers;

use App\Models\TaskAttachment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TaskAttachmentController extends Controller
{
    public function index($taskId)
    {
        $task = Task::findOrFail($taskId);
        $attachments = TaskAttachment::with('uploader')
                                   ->where('task_id', $taskId)
                                   ->orderBy('created_at', 'desc')
                                   ->get();

        return response()->json($attachments);
    }

    public function store(Request $request, $taskId)
    {
        $validator = Validator::make($request->all(), [
            'files.*' => 'required|file|max:10240', // 10MB max per file
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::findOrFail($taskId);
        $attachments = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('task_attachments', $fileName, 'public');

                $attachment = TaskAttachment::create([
                    'task_id' => $taskId,
                    'uploaded_by' => Auth::id(),
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $filePath,
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getClientOriginalExtension(),
                    'mime_type' => $file->getMimeType()
                ]);

                $attachments[] = $attachment->load('uploader');
            }
        }

        return response()->json([
            'message' => 'Files uploaded successfully',
            'attachments' => $attachments
        ], 201);
    }

    public function destroy($id)
    {
        $attachment = TaskAttachment::findOrFail($id);

        // Check if user can delete (uploader or admin)
        if ($attachment->uploaded_by !== Auth::id() && !Auth::user()->isManager()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted successfully']);
    }

    public function download($id)
    {
        $attachment = TaskAttachment::findOrFail($id);

        if (!Storage::disk('public')->exists($attachment->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }
}
