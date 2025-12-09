<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    public function __construct()
    {
        // Protect all methods - Super Admin only
        $this->middleware(function ($request, $next) {
            if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
                return response()->json(['error' => 'Only Super Admin can manage permissions'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Get all permissions
     */
    public function index()
    {
        $permissions = Permission::all();
        
        // Group by category
        $grouped = $permissions->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
            'grouped' => $grouped->map(function ($group) {
                return $group->values();
            }),
            'total' => $permissions->count()
        ]);
    }

    /**
     * Create a new permission
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $permission = Permission::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Permission created successfully',
            'permission' => $permission
        ], 201);
    }

    /**
     * Get a specific permission
     */
    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json([
            'success' => true,
            'permission' => $permission
        ]);
    }

    /**
     * Update a permission
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:permissions,name,' . $id,
            'display_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $permission->update($request->only(['name', 'display_name', 'description']));

        return response()->json([
            'message' => 'Permission updated successfully',
            'permission' => $permission
        ]);
    }

    /**
     * Delete a permission
     */
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);

        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete permission that is assigned to roles',
                'assigned_roles' => $permission->roles()->count()
            ], 422);
        }

        $permission->delete();

        return response()->json(['message' => 'Permission deleted successfully']);
    }

    /**
     * Get permissions by category
     */
    public function getByCategory($category)
    {
        $permissions = Permission::where('name', 'like', $category . '.%')->get();

        return response()->json([
            'success' => true,
            'category' => $category,
            'permissions' => $permissions,
            'count' => $permissions->count()
        ]);
    }

    /**
     * Get permission statistics
     */
    public function getStatistics()
    {
        $stats = [
            'total_permissions' => Permission::count(),
            'permissions_by_category' => Permission::all()->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            })->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'permissions' => $group->pluck('name')
                ];
            }),
            'permissions_by_role' => DB::table('role_permissions')
                ->join('roles', 'role_permissions.role_id', '=', 'roles.id')
                ->groupBy('role_id')
                ->selectRaw('roles.display_name, COUNT(*) as permission_count')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'statistics' => $stats
        ]);
    }

    /**
     * Bulk create permissions
     */
    public function bulkCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*.name' => 'required|string|unique:permissions,name',
            'permissions.*.display_name' => 'required|string',
            'permissions.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $created = [];
        foreach ($request->permissions as $permissionData) {
            $permission = Permission::create($permissionData);
            $created[] = $permission;
        }

        return response()->json([
            'message' => count($created) . ' permissions created successfully',
            'permissions' => $created
        ], 201);
    }
}
