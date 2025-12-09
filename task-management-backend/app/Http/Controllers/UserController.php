<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = User::with('role');

        // Role-based filtering
        if ($user->role->name === 'super_admin') {
            // Super Admin can see all users (no filtering)
        } elseif ($user->role->name === 'admin') {
            // Admin can see all users except Super Admin
            $query->whereHas('role', function ($q) {
                $q->where('name', '!=', 'super_admin');
            });
        } elseif ($user->role->name === 'manager') {
            // Manager can see team leads and team members only
            $query->whereHas('role', function ($q) {
                $q->whereIn('name', ['team_lead', 'team_member']);
            });
        } elseif ($user->role->name === 'team_lead') {
            // Team lead can see team members only
            $query->whereHas('role', function ($q) {
                $q->where('name', 'team_member');
            });
        } elseif ($user->role->name === 'team_member') {
            // Team members can only see other team members in their teams
            $query->whereHas('teams', function ($q) use ($user) {
                $q->whereIn('teams.id', $user->teams->pluck('id'));
            })->whereHas('role', function ($q) {
                $q->where('name', 'team_member');
            });
        }

        // Apply additional filters (ignore empty values)
        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    public function store(Request $request)
    {
        // Check permission using new RBAC system
        if (!auth()->user()->hasPermission('users.create')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $storeRules = [
            'first_name' => 'bail|required|string|min:2|max:255',
            'last_name' => 'bail|required|string|min:2|max:255',
            'email' => 'bail|required|string|email|max:255|unique:users',
            'password' => 'bail|required|string|min:8',
            'phone' => 'nullable|regex:/^\\+?[0-9\\-\\s]{7,15}$/',
            'role_id' => 'bail|required|integer|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];

        $messages = [
            'first_name.required' => 'First name is required.',
            'first_name.min' => 'First name must be at least 2 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.min' => 'Last name must be at least 2 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already in use.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'phone.regex' => 'Please enter a valid phone number.',
            'role_id.required' => 'Role is required.',
            'role_id.exists' => 'Selected role does not exist.'
        ];

        $validator = Validator::make($request->all(), $storeRules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role_id' => $request->role_id,
            'status' => 'active'
        ];

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $userData['avatar'] = $avatarPath;
        }

        $user = User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('role')
        ], 201);
    }

    public function show($id)
    {
        $targetUser = User::with(['role', 'assignedTasks', 'createdTasks', 'teams'])->findOrFail($id);

        // Authorize using policy
        $this->authorize('view', $targetUser);

        return response()->json($targetUser);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Authorize using policy
        $this->authorize('update', $user);

        $rules = [
            'first_name' => 'sometimes|required|string|min:2|max:255',
            'last_name' => 'sometimes|required|string|min:2|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|regex:/^\\+?[0-9\\-\\s]{7,15}$/',
            'role_id' => 'sometimes|required|integer|exists:roles,id',
            'status' => 'sometimes|required|in:active,inactive,suspended',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];

        // Allow optional password update during edit
        if ($request->filled('password')) {
            $rules['password'] = 'sometimes|required|string|min:8';
        }

        // Custom messages (mirror store messages for consistency)
        $messages = [
            'first_name.required' => 'First name is required.',
            'first_name.min' => 'First name must be at least 2 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.min' => 'Last name must be at least 2 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already in use.',
            'password.min' => 'Password must be at least 8 characters.',
            'phone.regex' => 'Please enter a valid phone number.',
            'role_id.required' => 'Role is required.',
            'role_id.exists' => 'Selected role does not exist.',
            'status.in' => 'Invalid status selection.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['first_name', 'last_name', 'email', 'phone', 'role_id', 'status']);

        // If password provided, hash it
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        // Ignore empty role_id values
        if (array_key_exists('role_id', $updateData) && ($updateData['role_id'] === '' || $updateData['role_id'] === null)) {
            unset($updateData['role_id']);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $avatarPath;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('role')
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Authorize using policy
        $this->authorize('changeStatus', $user);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,suspended'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update(['status' => $request->status]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user->load('role')
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Authorize using policy
        $this->authorize('delete', $user);

        // Prevent deleting the last super admin
        if ($user->role->name === 'super_admin') {
            $superAdminCount = User::whereHas('role', function ($query) {
                $query->where('name', 'super_admin');
            })->count();

            if ($superAdminCount <= 1) {
                return response()->json(['message' => 'Cannot delete the last super admin'], 422);
            }
        }

        // Prevent deleting the last manager
        if ($user->isManager()) {
            $managerCount = User::whereHas('role', function ($query) {
                $query->where('name', 'manager');
            })->count();

            if ($managerCount <= 1) {
                return response()->json(['message' => 'Cannot delete the last manager'], 422);
            }
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // Helper methods for role-based permissions
    private function canCreateUser($currentUser, $targetRole)
    {
        if (!$targetRole) return false;

        switch ($currentUser->role->name) {
            case 'super_admin':
                // Super Admin can create any role
                return true;
            case 'admin':
                // Admin can create: Admin, Manager, Team Lead, Team Member (NOT Super Admin)
                return in_array($targetRole->name, ['admin', 'manager', 'team_lead', 'team_member']);
            case 'manager':
                // Manager can create: Team Lead, Team Member
                return in_array($targetRole->name, ['team_lead', 'team_member']);
            case 'team_lead':
                // Team Lead can create: Team Member
                return $targetRole->name === 'team_member';
            default:
                return false;
        }
    }

    private function canUpdateUser($currentUser, $targetUser, $newRole = null)
    {
        switch ($currentUser->role->name) {
            case 'super_admin':
                // Super Admin can update any user
                return true;
            case 'admin':
                // Admin can update: Admin, Manager, Team Lead, Team Member (NOT Super Admin)
                $allowedRoles = ['admin', 'manager', 'team_lead', 'team_member'];
                $canUpdateRole = in_array($targetUser->role->name, $allowedRoles);
                if ($newRole) {
                    $canUpdateRole = $canUpdateRole && in_array($newRole->name, $allowedRoles);
                }
                return $canUpdateRole;
            case 'manager':
                // Manager can update: Team Lead, Team Member
                $allowedRoles = ['team_lead', 'team_member'];
                $canUpdateRole = in_array($targetUser->role->name, $allowedRoles);
                if ($newRole) {
                    $canUpdateRole = $canUpdateRole && in_array($newRole->name, $allowedRoles);
                }
                return $canUpdateRole;
            case 'team_lead':
                // Team Lead can update: Team Member
                $canUpdateRole = $targetUser->role->name === 'team_member';
                if ($newRole) {
                    $canUpdateRole = $canUpdateRole && $newRole->name === 'team_member';
                }
                return $canUpdateRole;
            default:
                return false;
        }
    }

    private function canDeleteUser($currentUser, $targetUser)
    {
        switch ($currentUser->role->name) {
            case 'super_admin':
                // Super Admin can delete any user
                return true;
            case 'admin':
                // Admin can delete: Admin, Manager, Team Lead, Team Member (NOT Super Admin)
                return in_array($targetUser->role->name, ['admin', 'manager', 'team_lead', 'team_member']);
            case 'manager':
                // Manager can delete: Team Lead, Team Member
                return in_array($targetUser->role->name, ['team_lead', 'team_member']);
            case 'team_lead':
                // Team Lead can delete: Team Member
                return $targetUser->role->name === 'team_member';
            default:
                return false;
        }
    }
}
