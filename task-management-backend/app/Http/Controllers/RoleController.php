<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function __construct()
    {
        // No global middleware - authorization checks in individual methods
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    public function store(Request $request)
    {
        // Only Super Admin can create roles
        if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
            return response()->json(['error' => 'Only Super Admin can create roles'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
            'permissions' => $request->permissions,
            'is_active' => true
        ]);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role
        ], 201);
    }

    public function show($id)
    {
        $role = Role::findOrFail($id);
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        // Only Super Admin can update roles
        if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
            return response()->json(['error' => 'Only Super Admin can update roles'], 403);
        }

        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $id,
            'display_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'sometimes|required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->update($request->only(['name', 'display_name', 'description', 'permissions']));

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role
        ]);
    }

    public function destroy($id)
    {
        // Only Super Admin can delete roles
        if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
            return response()->json(['error' => 'Only Super Admin can delete roles'], 403);
        }

        $role = Role::findOrFail($id);

        // Prevent deleting roles that are in use
        if ($role->users()->count() > 0) {
            return response()->json(['message' => 'Cannot delete role that is assigned to users'], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    /**
     * Get all available permissions
     */
    public function getPermissions()
    {
        $permissions = Permission::all();
        
        // Group permissions by category
        $grouped = $permissions->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
            'grouped' => $grouped->map(function ($group) {
                return $group->pluck('name');
            })
        ]);
    }

    /**
     * Assign permissions to a role
     */
    public function assignPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $permissionIds = [];
        $permissionNames = [];

        foreach ($request->permissions as $permission) {
            // Check if it's an ID or a name
            if (is_numeric($permission)) {
                $permissionIds[] = $permission;
            } else {
                // It's a permission name, get its ID
                $perm = Permission::where('name', $permission)->first();
                if ($perm) {
                    $permissionIds[] = $perm->id;
                    $permissionNames[] = $permission;
                }
            }
        }

        // Sync permissions in the pivot table
        $role->permissions()->sync($permissionIds);

        // Also update the permissions array in the role
        $allPermissions = Permission::whereIn('id', $permissionIds)->pluck('name')->toArray();
        $role->update(['permissions' => $allPermissions]);

        return response()->json([
            'message' => 'Permissions assigned successfully',
            'role' => $role->load('permissions')
        ]);
    }

    /**
     * Remove permissions from a role
     */
    public function removePermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->permissions()->detach($request->permissions);

        return response()->json([
            'message' => 'Permissions removed successfully',
            'role' => $role->load('permissions')
        ]);
    }

    /**
     * Get role with all its permissions
     */
    public function getRolePermissions($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        
        $permissions = $role->permissions;
        $permissionIds = is_array($permissions) 
            ? collect($permissions)->pluck('id')->toArray()
            : $permissions->pluck('id')->toArray();

        return response()->json([
            'success' => true,
            'role' => $role,
            'permissions' => $permissions,
            'permissionIds' => $permissionIds
        ]);
    }

    /**
     * Get users with a specific role
     */
    public function getRoleUsers($id)
    {
        $role = Role::findOrFail($id);
        $users = $role->users()->paginate(15);

        return response()->json([
            'success' => true,
            'role' => $role,
            'users' => $users
        ]);
    }

    /**
     * Assign role to user
     */
    public function assignRoleToUser(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($request->user_id);
        $user->update(['role_id' => $roleId]);

        return response()->json([
            'message' => 'Role assigned to user successfully',
            'user' => $user->load('role')
        ]);
    }

    /**
     * Get permission matrix for all roles
     */
    public function getPermissionMatrix()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        $matrix = [];
        foreach ($roles as $role) {
            $perms = $role->permissions;
            $rolePermissions = is_array($perms)
                ? collect($perms)->pluck('id')->toArray()
                : $perms->pluck('id')->toArray();
            
            $matrix[$role->name] = [
                'id' => $role->id,
                'display_name' => $role->display_name,
                'permissions' => $rolePermissions,
                'permission_count' => count($rolePermissions)
            ];
        }

        return response()->json([
            'success' => true,
            'matrix' => $matrix,
            'permissions' => $permissions,
            'total_permissions' => $permissions->count()
        ]);
    }

    /**
     * Get role statistics
     */
    public function getStatistics()
    {
        $stats = [
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
            'roles_with_users' => Role::has('users')->count(),
            'roles_by_user_count' => Role::withCount('users')->get()->map(function ($role) {
                return [
                    'name' => $role->display_name,
                    'user_count' => $role->users_count
                ];
            }),
            'permissions_by_category' => Permission::all()->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            })->map(function ($group) {
                return $group->count();
            })
        ];

        return response()->json([
            'success' => true,
            'statistics' => $stats
        ]);
    }
}
