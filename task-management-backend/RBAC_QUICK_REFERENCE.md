# RBAC Quick Reference Guide

## Role Levels

| Role | Level | Scope | Can Create | Can Manage |
|------|-------|-------|-----------|-----------|
| Super Admin | 5 | Global | Everything | Everything |
| Admin | 4 | Organization | Users, Teams, Projects, Tasks | Everything except Super Admin |
| Manager | 3 | Own Items | Teams, Projects, Tasks | Own items only |
| Team Lead | 2 | Assigned Projects | Tasks | Assigned projects |
| Team Member | 1 | Assigned Tasks | Comments | Assigned tasks |

## Permission Matrix (Quick View)

### User Management
```
Super Admin: ✓ create, view, update, delete, manage_roles
Admin:       ✓ create, view, update, delete (except Super Admin)
Manager:     ✓ create, view, update, delete (own only)
Team Lead:   ✗
Team Member: ✗
```

### Team Management
```
Super Admin: ✓ create, view, update, delete, manage_members
Admin:       ✓ create, view, update, delete, manage_members
Manager:     ✓ create, view, update, delete, manage_members (own only)
Team Lead:   ✓ view, manage_members (own only)
Team Member: ✓ view (own only)
```

### Project Management
```
Super Admin: ✓ create, view, update, delete, manage_team
Admin:       ✓ create, view, update, delete, manage_team
Manager:     ✓ create, view, update, delete, manage_team (own only)
Team Lead:   ✓ view, update, manage_team (assigned only)
Team Member: ✓ view (assigned only)
```

### Task Management
```
Super Admin: ✓ create, view, update, delete, change_status, assign
Admin:       ✓ create, view, update, delete, change_status, assign
Manager:     ✓ create, view, update, delete, change_status, assign (own projects)
Team Lead:   ✓ create, view, update, change_status, assign (assigned projects)
Team Member: ✓ view, update, change_status (assigned only)
```

### Comments & Files
```
Super Admin: ✓ create, update, delete (all)
Admin:       ✓ create, update, delete (all)
Manager:     ✓ create, update, delete (own projects)
Team Lead:   ✓ create, update, delete (assigned projects)
Team Member: ✓ create, update, delete (own only)
```

## Common Code Patterns

### Check Role
```php
$user->hasRole('manager')
$user->isSuperAdmin()
$user->isTeamLead()
```

### Check Permission
```php
$user->hasPermission('projects.create')
$user->hasAnyPermission(['projects.create', 'projects.update'])
$user->hasAllPermissions(['projects.create', 'projects.view'])
```

### Check Access
```php
$user->canAccessProject($projectId)
$user->canAccessTask($taskId)
$user->canAccessTeam($teamId)
```

### Authorize in Controller
```php
$this->authorize('view', $project)
$this->authorize('update', $project)
$this->authorize('delete', $project)
```

### Middleware on Routes
```php
->middleware('permission:projects.create')
->middleware('role:manager,team_lead')
```

### Get Accessible Resources
```php
$user->getAccessibleProjects()
$user->getAccessibleTasks()
```

## Database Queries

### Get User Permissions
```php
$user->getPermissions()
```

### Get User Roles
```php
$user->roles()->get()
```

### Get Role Permissions
```php
$role->permissions()->get()
```

### Assign Role
```php
$user->assignRole('manager')
```

### Remove Role
```php
$user->removeRole('manager')
```

### Sync Roles
```php
$user->syncRoles(['manager', 'team_lead'])
```

## API Endpoint Protection

### Permission-Based
```php
Route::post('/projects', [ProjectController::class, 'store'])
    ->middleware('permission:projects.create');
```

### Role-Based
```php
Route::get('/admin/users', [UserController::class, 'index'])
    ->middleware('role:super_admin,admin');
```

### Multiple Conditions
```php
Route::put('/projects/{id}', [ProjectController::class, 'update'])
    ->middleware(['auth:api', 'permission:projects.update']);
```

## Authorization Decisions

### For Super Admin
- Always allow (bypass all checks)

### For Admin
- Allow all except Super Admin operations

### For Manager
- Allow only own created items
- Check: `$resource->created_by === $user->id`

### For Team Lead
- Allow assigned projects and their tasks
- Check: `$project->team_lead_id === $user->id`

### For Team Member
- Allow assigned tasks only
- Check: `$task->assigned_to === $user->id`

## Caching

### Permission Cache
- TTL: 1 hour
- Key: `user_permissions_{user_id}`
- Clear: `$user->clearPermissionCache()`

### When to Clear
- User role changes
- Role permissions change
- User deleted

## Testing Checklist

- [ ] Super Admin can access everything
- [ ] Admin cannot modify Super Admin
- [ ] Manager can only access own items
- [ ] Team Lead can only access assigned projects
- [ ] Team Member can only access assigned tasks
- [ ] Unauthorized users get 403 Forbidden
- [ ] Permission cache works correctly
- [ ] Policies are enforced at controller level
- [ ] Middleware blocks unauthorized requests
- [ ] Audit logs record authorization attempts

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied unexpectedly | Clear permission cache: `$user->clearPermissionCache()` |
| Policy not working | Register in AuthServiceProvider |
| Middleware not applied | Check Kernel.php registration |
| Super Admin still denied | Ensure Super Admin check is first in logic |
| Wrong role returned | Check role_id vs roles() relationship |
| Slow permission checks | Enable caching, use eager loading |

## File Locations

```
app/
├── Models/
│   ├── Permission.php
│   ├── ResourceAccess.php
│   └── User.php (updated)
├── Traits/
│   ├── HasRoles.php
│   └── HasPermissions.php
├── Policies/
│   ├── ProjectPolicy.php
│   ├── TaskPolicy.php
│   ├── TeamPolicy.php
│   └── UserPolicy.php
├── Http/
│   └── Middleware/
│       ├── CheckPermission.php
│       └── CheckRole.php
└── Providers/
    └── AuthServiceProvider.php (updated)

database/
├── migrations/
│   └── 2024_01_01_000032_create_permissions_table.php
└── seeders/
    └── RolePermissionSeeder.php
```

## Key Concepts

### Role Hierarchy
Roles have levels 1-5. Higher level = more permissions.

### Creator-Based Access
Managers can only access items they created.

### Assignment-Based Access
Team Leads/Members can only access assigned items.

### Permission Caching
Permissions cached for performance (1 hour).

### Multiple Roles
Users can have multiple roles (via user_roles table).

### Resource Tracking
ResourceAccess table tracks who created/owns what.

## Next Steps

1. Run migrations: `php artisan migrate`
2. Seed data: `php artisan db:seed --class=RolePermissionSeeder`
3. Register policies in AuthServiceProvider
4. Register middleware in Kernel
5. Update controllers with authorization
6. Test with different roles
7. Implement audit logging
8. Add frontend role checks
