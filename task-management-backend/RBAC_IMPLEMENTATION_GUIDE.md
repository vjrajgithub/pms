# RBAC Implementation Guide

## Step-by-Step Setup

### 1. Run Migrations

```bash
# Create permissions, roles, and related tables
php artisan migrate
```

### 2. Run Seeders

```bash
# Seed initial roles and permissions
php artisan db:seed --class=RolePermissionSeeder
```

### 3. Register Policies

Update `app/Providers/AuthServiceProvider.php`:

```php
<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use App\Policies\TeamPolicy;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        Task::class => TaskPolicy::class,
        Team::class => TeamPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
```

### 4. Register Middleware

Update `app/Http/Kernel.php`:

```php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $routeMiddleware = [
        // ... existing middleware
        'permission' => \App\Http\Middleware\CheckPermission::class,
        'role' => \App\Http\Middleware\CheckRole::class,
    ];
}
```

### 5. Update Models

Ensure User model includes traits:

```php
use App\Traits\HasRoles;
use App\Traits\HasPermissions;

class User extends Authenticatable
{
    use HasRoles, HasPermissions;
}
```

### 6. Update Routes

```php
<?php

// routes/api.php

Route::middleware('auth:api')->group(function () {
    // Admin routes
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
    });

    // Project routes
    Route::resource('projects', ProjectController::class);

    // Task routes
    Route::resource('tasks', TaskController::class);

    // Team routes
    Route::resource('teams', TeamController::class);
});
```

## Database Schema

### Roles Table
```
id | name | display_name | description | permissions | is_active | created_at | updated_at
```

### Permissions Table
```
id | name | display_name | description | category | is_active | created_at | updated_at
```

### Role Permissions Table (Pivot)
```
id | role_id | permission_id | created_at | updated_at
```

### User Roles Table
```
id | user_id | role_id | assigned_at | assigned_by | created_at | updated_at
```

### Resource Access Table
```
id | resource_type | resource_id | created_by | owner_id | metadata | created_at | updated_at
```

## Role Hierarchy

```
Super Admin (Level 5)
    ↓
Admin (Level 4)
    ↓
Manager (Level 3)
    ↓
Team Lead (Level 2)
    ↓
Team Member (Level 1)
```

## Permission Categories

### Users (5 permissions)
- users.create
- users.view
- users.update
- users.delete
- users.manage_roles

### Teams (5 permissions)
- teams.create
- teams.view
- teams.update
- teams.delete
- teams.manage_members

### Projects (5 permissions)
- projects.create
- projects.view
- projects.update
- projects.delete
- projects.manage_team

### Tasks (6 permissions)
- tasks.create
- tasks.view
- tasks.update
- tasks.delete
- tasks.change_status
- tasks.assign

### Comments & Files (5 permissions)
- comments.create
- comments.update
- comments.delete
- files.upload
- files.delete

### Notifications & Reports (2 permissions)
- notifications.view
- reports.view

### System (3 permissions)
- roles.manage
- permissions.manage
- settings.manage

**Total: 31 permissions**

## Authorization Patterns

### Pattern 1: Global Access
Used by Super Admin and Admin
```php
if ($user->isSuperAdmin() || $user->isAdmin()) {
    return true;
}
```

### Pattern 2: Creator-Based Access
Used by Manager
```php
if ($user->isManager() && $resource->created_by === $user->id) {
    return true;
}
```

### Pattern 3: Assignment-Based Access
Used by Team Lead and Team Member
```php
if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
    return true;
}
if ($user->isTeamMember() && $task->assigned_to === $user->id) {
    return true;
}
```

### Pattern 4: Team-Based Access
Used by Team Member
```php
if ($user->isTeamMember() && $user->teams->contains($team->id)) {
    return true;
}
```

## Implementation Checklist

- [ ] Run migrations
- [ ] Run seeders
- [ ] Register policies in AuthServiceProvider
- [ ] Register middleware in Kernel
- [ ] Add traits to User model
- [ ] Update routes with middleware
- [ ] Update controllers with authorization
- [ ] Add created_by field to projects, teams, tasks tables
- [ ] Test authorization with different roles
- [ ] Implement audit logging
- [ ] Add frontend role/permission checks
- [ ] Document API endpoints with required permissions

## Testing Authorization

### Unit Tests

```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;

class ProjectPolicyTest extends TestCase
{
    public function test_super_admin_can_view_any_project()
    {
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('super_admin');
        
        $project = Project::factory()->create();
        
        $this->assertTrue($superAdmin->can('view', $project));
    }

    public function test_manager_can_view_own_project()
    {
        $manager = User::factory()->create();
        $manager->assignRole('manager');
        
        $project = Project::factory()->create(['manager_id' => $manager->id]);
        
        $this->assertTrue($manager->can('view', $project));
    }

    public function test_manager_cannot_view_others_project()
    {
        $manager1 = User::factory()->create();
        $manager1->assignRole('manager');
        
        $manager2 = User::factory()->create();
        $manager2->assignRole('manager');
        
        $project = Project::factory()->create(['manager_id' => $manager1->id]);
        
        $this->assertFalse($manager2->can('view', $project));
    }
}
```

### Feature Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;

class ProjectAuthorizationTest extends TestCase
{
    public function test_unauthorized_user_cannot_view_project()
    {
        $user = User::factory()->create();
        $user->assignRole('team_member');
        
        $project = Project::factory()->create();
        
        $this->actingAs($user)
            ->getJson("/api/projects/{$project->id}")
            ->assertStatus(403);
    }

    public function test_authorized_user_can_view_project()
    {
        $user = User::factory()->create();
        $user->assignRole('manager');
        
        $project = Project::factory()->create(['manager_id' => $user->id]);
        
        $this->actingAs($user)
            ->getJson("/api/projects/{$project->id}")
            ->assertStatus(200);
    }
}
```

## Caching Strategy

Permissions are cached per user for 1 hour:
```php
Cache::remember("user_permissions_{$user->id}", 3600, function () {
    // Fetch permissions
});
```

Clear cache when:
- User role changes
- Role permissions change
- User is deleted

```php
$user->clearPermissionCache();
```

## Security Best Practices

1. **Always authorize at controller level**
   ```php
   $this->authorize('view', $project);
   ```

2. **Use policies for model authorization**
   ```php
   public function view(User $user, Project $project) { }
   ```

3. **Validate ownership before modifications**
   ```php
   if ($resource->created_by !== auth()->id()) {
       return response()->json(['error' => 'Forbidden'], 403);
   }
   ```

4. **Log authorization failures**
   ```php
   Log::warning('Authorization failed', [
       'user_id' => auth()->id(),
       'action' => 'update_project',
       'resource_id' => $project->id,
   ]);
   ```

5. **Use middleware for route protection**
   ```php
   Route::post('/users', [UserController::class, 'store'])
       ->middleware('permission:users.create');
   ```

6. **Implement rate limiting**
   ```php
   Route::middleware('throttle:60,1')->group(function () {
       // Routes
   });
   ```

7. **Regular permission audits**
   - Review role permissions quarterly
   - Audit user role assignments
   - Remove unused permissions

## Troubleshooting

### Issue: Permission cache not clearing
**Solution**: Call `$user->clearPermissionCache()` after role/permission changes

### Issue: Policy not being called
**Solution**: Ensure policy is registered in AuthServiceProvider

### Issue: Middleware not working
**Solution**: Verify middleware is registered in Kernel and applied to routes

### Issue: Super Admin still denied access
**Solution**: Check if Super Admin check is first in authorization logic

## Performance Optimization

1. **Eager load relationships**
   ```php
   $users = User::with('roles.permissions')->get();
   ```

2. **Use permission caching**
   ```php
   $permissions = Cache::remember("user_permissions_{$user->id}", 3600, fn() => $user->getPermissions());
   ```

3. **Index database columns**
   ```php
   $table->index(['user_id', 'role_id']);
   ```

4. **Batch permission checks**
   ```php
   if ($user->hasAllPermissions(['projects.create', 'projects.view'])) { }
   ```

5. **Use query scopes**
   ```php
   $projects = Project::whereCreatedBy(auth()->id())->get();
   ```
