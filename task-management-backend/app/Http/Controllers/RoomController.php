<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Room::with(['team', 'creator']);

        // Apply role-based filtering
        if ($user->isTeamMember()) {
            $query->whereHas('team.members', function ($q) use ($user) {
                $q->where('user_id', $user->id)->where('status', 'active');
            });
        } elseif ($user->isTeamLead()) {
            $query->whereHas('team', function ($q) use ($user) {
                $q->where('team_lead_id', $user->id);
            });
        }

        // Apply filters
        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }

        if ($request->has('room_type')) {
            $query->where('room_type', $request->room_type);
        }

        $rooms = $query->active()->paginate($request->get('per_page', 15));

        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_id' => 'required|exists:teams,id',
            'room_type' => 'required|in:meeting,discussion,project,general'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $room = Room::create([
            'name' => $request->name,
            'description' => $request->description,
            'team_id' => $request->team_id,
            'room_type' => $request->room_type,
            'created_by' => Auth::id(),
            'is_active' => true
        ]);

        return response()->json([
            'message' => 'Room created successfully',
            'room' => $room->load(['team', 'creator'])
        ], 201);
    }

    public function show($id)
    {
        $room = Room::with(['team', 'creator', 'tasks'])->findOrFail($id);

        return response()->json($room);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'room_type' => 'sometimes|required|in:meeting,discussion,project,general',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $room->update($request->only([
            'name', 'description', 'room_type', 'is_active'
        ]));

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => $room->load(['team', 'creator'])
        ]);
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }

    public function joinRoom($id)
    {
        $room = Room::findOrFail($id);
        
        // Logic for joining room (could be implemented with WebSockets)
        return response()->json(['message' => 'Joined room successfully']);
    }

    public function leaveRoom($id)
    {
        $room = Room::findOrFail($id);
        
        // Logic for leaving room (could be implemented with WebSockets)
        return response()->json(['message' => 'Left room successfully']);
    }
}
