# RBAC System - Usage Examples

## 1. Controller Level Authorization

### Using Policies

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * View a project
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);
        
        // Authorize using policy
        $this->authorize('view', $project);
        
        return response()->json($project);
    }

    /**
     * Update a project
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        // Authorize using policy
        $this->authorize('update', $project);
        
        $project->update($request->validated());
        
        return response()->json($project);
    }

    /**
     * Delete a project
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        
        // Authorize using policy
        $this->authorize('delete', $project);
        
        $project->delete();
        
        return response()->json(['message' => 'Project deleted']);
    }

    /**
     * Manage project team
     */
    public function manageTeam(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        // Authorize using policy
        $this->authorize('manageTeam', $project);
        
        // Update team members
        $project->teams()->sync($request->team_ids);
        
        return response()->json($project);
    }
}
```

### Using Permission Checks

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('users.create')) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Create user logic
        $user = User::create($request->validated());

        return response()->json($user, 201);
    }

    /**
     * Get all users
     */
    public function index()
    {
        // Check permission
        if (!auth()->user()->hasPermission('users.view')) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $users = User::all();

        return response()->json($users);
    }
}
```

## 2. Route Level Authorization

### Using Middleware

```php
<?php

// routes/api.php

Route::middleware('auth:api')->group(function () {
    // Permission-based routes
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.create');
    
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view');
    
    Route::put('/users/{id}', [UserController::class, 'update'])
        ->middleware('permission:users.update');
    
    Route::delete('/users/{id}', [UserController::class, 'destroy'])
        ->middleware('permission:users.delete');

    // Role-based routes
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
        ->middleware('role:super_admin,admin');
    
    Route::get('/manager/dashboard', [ManagerController::class, 'dashboard'])
        ->middleware('role:super_admin,admin,manager');

    // Project routes with authorization
    Route::resource('projects', ProjectController::class)
        ->middleware('permission:projects.view');
});
```

## 3. Trait Usage Examples

### Role Checking

```php
<?php

$user = auth()->user();

// Check specific role
if ($user->hasRole('manager')) {
    // User is a manager
}

// Check multiple roles
if ($user->hasAnyRole(['manager', 'team_lead'])) {
    // User is either manager or team lead
}

// Check all roles
if ($user->hasAllRoles(['manager', 'team_lead'])) {
    // User has both roles
}

// Get role level
$level = $user->getRoleLevel(); // Returns 1-5

// Check role level
if ($user->hasRoleLevel(3)) {
    // User has role level 3 or higher
}

// Specific role checks
if ($user->isSuperAdmin()) { }
if ($user->isAdmin()) { }
if ($user->isManager()) { }
if ($user->isTeamLead()) { }
if ($user->isTeamMember()) { }
```

### Permission Checking

```php
<?php

$user = auth()->user();

// Check single permission
if ($user->hasPermission('projects.create')) {
    // User can create projects
}

// Check multiple permissions (any)
if ($user->hasAnyPermission(['projects.create', 'projects.update'])) {
    // User can create or update projects
}

// Check multiple permissions (all)
if ($user->hasAllPermissions(['projects.create', 'projects.update'])) {
    // User can both create and update projects
}

// Get all permissions
$permissions = $user->getPermissions();

// Clear permission cache
$user->clearPermissionCache();
```

### Access Checking

```php
<?php

$user = auth()->user();

// Check project access
if ($user->canAccessProject($projectId)) {
    // User can access this project
}

// Check task access
if ($user->canAccessTask($taskId)) {
    // User can access this task
}

// Check team access
if ($user->canAccessTeam($teamId)) {
    // User can access this team
}

// Get accessible resources
$projects = $user->getAccessibleProjects();
$tasks = $user->getAccessibleTasks();
```

## 4. Policy Usage Examples

### In Controllers

```php
<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function show($id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('view', $task);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('update', $task);
        $task->update($request->validated());
        return response()->json($task);
    }

    public function changeStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('changeStatus', $task);
        $task->status = $request->status;
        $task->save();
        return response()->json($task);
    }

    public function assign(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('assign', $task);
        $task->assigned_to = $request->assigned_to;
        $task->save();
        return response()->json($task);
    }
}
```

### In Views/Blade Templates

```blade
@can('view', $project)
    <div>{{ $project->name }}</div>
@endcan

@can('update', $project)
    <button>Edit Project</button>
@endcan

@can('delete', $project)
    <button>Delete Project</button>
@endcan

@cannot('update', $project)
    <p>You cannot edit this project</p>
@endcannot
```

## 5. Role Assignment Examples

### Assigning Roles to Users

```php
<?php

use App\Models\User;

$user = User::find(1);

// Assign single role
$user->assignRole('manager');

// Assign multiple roles
$user->assignRole('manager');
$user->assignRole('team_lead');

// Sync roles (replace all)
$user->syncRoles(['manager', 'team_lead']);

// Remove role
$user->removeRole('team_lead');

// Check role
if ($user->hasRole('manager')) {
    // User is a manager
}
```

## 6. Permission Management Examples

### Managing Permissions

```php
<?php

use App\Models\Role;
use App\Models\Permission;

// Get role
$role = Role::where('name', 'manager')->first();

// Get permissions for role
$permissions = $role->permissions;

// Add permission to role
$permission = Permission::where('name', 'projects.create')->first();
$role->permissions()->attach($permission);

// Remove permission from role
$role->permissions()->detach($permission);

// Sync permissions
$role->permissions()->sync([1, 2, 3]);

// Check if role has permission
if ($role->permissions()->where('name', 'projects.create')->exists()) {
    // Role has permission
}
```

## 7. Resource Access Tracking

### Recording Resource Creation

```php
<?php

use App\Models\ResourceAccess;
use App\Models\Project;

// When creating a project
$project = Project::create([
    'name' => 'New Project',
    'manager_id' => auth()->id(),
]);

// Record access
ResourceAccess::recordAccess(
    'project',
    $project->id,
    auth()->id(),
    auth()->id(), // owner
    ['created_by' => auth()->id()]
);

// Check if user created resource
if (ResourceAccess::isCreatedBy('project', $project->id, auth()->id())) {
    // User created this project
}

// Check if user owns resource
if (ResourceAccess::isOwnedBy('project', $project->id, auth()->id())) {
    // User owns this project
}
```

## 8. Advanced Authorization Patterns

### Conditional Authorization

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $user = auth()->user();

        // Complex authorization logic
        $canUpdate = false;

        if ($user->isSuperAdmin() || $user->isAdmin()) {
            $canUpdate = true;
        } elseif ($user->isManager() && $project->manager_id === $user->id) {
            $canUpdate = true;
        } elseif ($user->isTeamLead() && $project->team_lead_id === $user->id) {
            $canUpdate = true;
        }

        if (!$canUpdate) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $project->update($request->validated());

        return response()->json($project);
    }
}
```

### Scope-Based Authorization

```php
<?php

// Get only accessible projects
$projects = auth()->user()->getAccessibleProjects();

// Get only accessible tasks
$tasks = auth()->user()->getAccessibleTasks();

// Filter query by user role
$query = Project::query();

if (auth()->user()->isManager()) {
    $query->where('manager_id', auth()->id());
} elseif (auth()->user()->isTeamLead()) {
    $query->where('team_lead_id', auth()->id());
} elseif (auth()->user()->isTeamMember()) {
    $query->whereHas('teams.members', function ($q) {
        $q->where('user_id', auth()->id())->where('status', 'active');
    });
}

$projects = $query->get();
```

## 9. Audit Trail

### Logging Authorization Checks

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $user = auth()->user();

        // Log authorization attempt
        Log::info('Authorization check', [
            'user_id' => $user->id,
            'user_role' => $user->role->name,
            'action' => 'update_project',
            'resource_id' => $project->id,
            'timestamp' => now(),
        ]);

        $this->authorize('update', $project);

        $project->update($request->validated());

        // Log successful authorization
        Log::info('Authorization granted', [
            'user_id' => $user->id,
            'action' => 'update_project',
            'resource_id' => $project->id,
        ]);

        return response()->json($project);
    }
}
```

## 10. Frontend Integration

### React Component Example

```javascript
import { useAuth } from './contexts/AuthContext';

function ProjectActions({ project }) {
    const { user } = useAuth();

    const canEdit = user?.isSuperAdmin || 
                    user?.isAdmin || 
                    (user?.isManager && project.manager_id === user.id) ||
                    (user?.isTeamLead && project.team_lead_id === user.id);

    const canDelete = user?.isSuperAdmin || 
                      user?.isAdmin || 
                      (user?.isManager && project.manager_id === user.id);

    return (
        <div>
            {canEdit && <button>Edit</button>}
            {canDelete && <button>Delete</button>}
        </div>
    );
}
```
