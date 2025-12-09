# Project Management System - RBAC Architecture

## Overview
Complete Role-Based Access Control (RBAC) system with 5 user roles and granular permissions.

## User Roles & Hierarchy

### 1. Super Admin
- **Level**: 5 (Highest)
- **Scope**: Global system access
- **Responsibilities**:
  - Manage all users, roles, and permissions
  - Create/modify global configurations
  - Access all projects, tasks, teams
  - View system reports and analytics
  - Manage Super Admin users (only other Super Admins)

### 2. Admin
- **Level**: 4
- **Scope**: Organization-wide
- **Responsibilities**:
  - Create and manage users (except Super Admins)
  - Create and manage teams
  - Create and manage projects
  - Create and manage tasks
  - View organization reports
  - Cannot modify Super Admin settings

### 3. Manager
- **Level**: 3
- **Scope**: Own created items
- **Responsibilities**:
  - Create teams and projects
  - Manage only items they created
  - Manage users they created
  - Assign tasks to team members
  - View reports for their projects
  - Cannot access unrelated items

### 4. Team Lead
- **Level**: 2
- **Scope**: Assigned projects
- **Responsibilities**:
  - Manage tasks in assigned projects
  - Assign tasks to team members
  - Update task status and progress
  - Comment and upload files
  - Cannot create projects or teams
  - Cannot manage unrelated projects

### 5. Team Member
- **Level**: 1 (Lowest)
- **Scope**: Assigned tasks
- **Responsibilities**:
  - View assigned tasks
  - Update task status (if allowed)
  - Comment on tasks
  - Upload files to tasks
  - Cannot create or manage items

## Permissions Matrix

| Permission | Super Admin | Admin | Manager | Team Lead | Team Member |
|-----------|:-----------:|:-----:|:-------:|:---------:|:-----------:|
| **User Management** |
| users.create | ✓ | ✓ | ✓* | ✗ | ✗ |
| users.view | ✓ | ✓ | ✓* | ✓* | ✓* |
| users.update | ✓ | ✓ | ✓* | ✗ | ✗ |
| users.delete | ✓ | ✓ | ✓* | ✗ | ✗ |
| **Team Management** |
| teams.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| teams.view | ✓ | ✓ | ✓* | ✓* | ✓* |
| teams.update | ✓ | ✓ | ✓* | ✗ | ✗ |
| teams.delete | ✓ | ✓ | ✓* | ✗ | ✗ |
| teams.manage_members | ✓ | ✓ | ✓* | ✓* | ✗ |
| **Project Management** |
| projects.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| projects.view | ✓ | ✓ | ✓* | ✓* | ✓* |
| projects.update | ✓ | ✓ | ✓* | ✓* | ✗ |
| projects.delete | ✓ | ✓ | ✓* | ✓* | ✗ |
| projects.manage_team | ✓ | ✓ | ✓* | ✓* | ✗ |
| **Task Management** |
| tasks.create | ✓ | ✓ | ✓ | ✓ | ✗ |
| tasks.view | ✓ | ✓ | ✓* | ✓* | ✓* |
| tasks.update | ✓ | ✓ | ✓* | ✓* | ✓* |
| tasks.delete | ✓ | ✓ | ✓* | ✓* | ✗ |
| tasks.change_status | ✓ | ✓ | ✓* | ✓* | ✓* |
| tasks.assign | ✓ | ✓ | ✓* | ✓ | ✗ |
| **Comments & Files** |
| comments.create | ✓ | ✓ | ✓ | ✓ | ✓ |
| comments.update | ✓ | ✓ | ✓* | ✓* | ✓* |
| comments.delete | ✓ | ✓ | ✓* | ✓* | ✓* |
| files.upload | ✓ | ✓ | ✓ | ✓ | ✓ |
| files.delete | ✓ | ✓ | ✓* | ✓* | ✓* |
| **Notifications & Reports** |
| notifications.view | ✓ | ✓ | ✓ | ✓ | ✓ |
| reports.view | ✓ | ✓ | ✓* | ✓* | ✗ |
| **System Management** |
| roles.manage | ✓ | ✗ | ✗ | ✗ | ✗ |
| permissions.manage | ✓ | ✗ | ✗ | ✗ | ✗ |
| settings.manage | ✓ | ✗ | ✗ | ✗ | ✗ |

*Note: ✓* means conditional access (own items or assigned items)*

## Database Schema

### Tables
1. `roles` - Role definitions
2. `permissions` - Permission definitions
3. `role_permissions` - Role-permission mapping
4. `user_roles` - User-role mapping (supports multiple roles)
5. `resource_access` - Track who created/owns what (for Manager scope)

### Key Fields
- `created_by` - Track creator for Manager scope
- `team_lead_id` - Track team lead assignments
- `assigned_to` - Track task assignments

## Access Control Patterns

### 1. Global Access (Super Admin, Admin)
```php
if ($user->isSuperAdmin() || $user->isAdmin()) {
    return true;
}
```

### 2. Creator-Based Access (Manager)
```php
if ($user->isManager() && $resource->created_by === $user->id) {
    return true;
}
```

### 3. Assignment-Based Access (Team Lead, Team Member)
```php
if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
    return true;
}
if ($user->isTeamMember() && $task->assigned_to === $user->id) {
    return true;
}
```

### 4. Team-Based Access
```php
if ($user->isTeamMember() && $user->teams->contains($team->id)) {
    return true;
}
```

## Implementation Files

### Backend
- `app/Models/Role.php` - Role model
- `app/Models/Permission.php` - Permission model
- `app/Policies/ProjectPolicy.php` - Project authorization
- `app/Policies/TaskPolicy.php` - Task authorization
- `app/Policies/TeamPolicy.php` - Team authorization
- `app/Policies/UserPolicy.php` - User authorization
- `app/Http/Middleware/CheckPermission.php` - Permission middleware
- `database/seeders/RolePermissionSeeder.php` - Initial data

### Traits
- `app/Traits/HasRoles.php` - Role management methods
- `app/Traits/HasPermissions.php` - Permission checking methods

## Usage Examples

### Controller Level
```php
$this->authorize('view', $project);
$this->authorize('update', $project);
```

### Middleware Level
```php
Route::post('/projects', [ProjectController::class, 'store'])
    ->middleware('permission:projects.create');
```

### Helper Functions
```php
auth()->user()->can('projects.create')
auth()->user()->canAccessProject($projectId)
auth()->user()->isManager()
```

## Scalability Considerations

1. **Caching**: Permission checks are cached per user
2. **Lazy Loading**: Permissions loaded only when needed
3. **Query Optimization**: Use eager loading for relationships
4. **Audit Trail**: Log all permission-based actions
5. **Delegation**: Managers can delegate permissions to team leads
6. **Custom Permissions**: Support for custom role-permission combinations

## Security Best Practices

1. Always check permissions at controller level
2. Use policies for model-level authorization
3. Validate ownership before allowing modifications
4. Log all access attempts
5. Use middleware for route protection
6. Implement rate limiting for sensitive operations
7. Regular permission audits
8. Principle of least privilege
