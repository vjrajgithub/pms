# Super Admin RBAC Management Guide

## Overview

The Super Admin RBAC Management system allows Super Admins to:
- Create and manage roles
- Create and manage permissions
- Assign permissions to roles
- Assign roles to users
- View permission matrix and statistics

## Backend API Endpoints

All endpoints are protected and require Super Admin authentication.

### Base URL
```
/api/admin/rbac
```

### Role Management

#### Get All Roles
```http
GET /api/admin/rbac/roles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "super_admin",
      "display_name": "Super Admin",
      "description": "Full system access",
      "permissions": []
    }
  ]
}
```

#### Get Single Role
```http
GET /api/admin/rbac/roles/{id}
```

#### Create Role
```http
POST /api/admin/rbac/roles
```

**Request Body:**
```json
{
  "name": "custom_role",
  "display_name": "Custom Role",
  "description": "Custom role description"
}
```

#### Update Role
```http
PUT /api/admin/rbac/roles/{id}
```

**Request Body:**
```json
{
  "display_name": "Updated Display Name",
  "description": "Updated description"
}
```

#### Delete Role
```http
DELETE /api/admin/rbac/roles/{id}
```

### Permission Management

#### Get All Permissions
```http
GET /api/admin/rbac/permissions
```

**Response:**
```json
{
  "success": true,
  "permissions": [
    {
      "id": 1,
      "name": "users.create",
      "display_name": "Create Users",
      "description": "Permission to create new users"
    }
  ],
  "grouped": {
    "users": ["users.create", "users.view", ...],
    "projects": ["projects.create", "projects.view", ...]
  }
}
```

#### Get Permission by Category
```http
GET /api/admin/rbac/permissions/category/{category}
```

**Example:**
```http
GET /api/admin/rbac/permissions/category/users
```

#### Create Permission
```http
POST /api/admin/rbac/permissions
```

**Request Body:**
```json
{
  "name": "custom.action",
  "display_name": "Custom Action",
  "description": "Description of the permission"
}
```

#### Update Permission
```http
PUT /api/admin/rbac/permissions/{id}
```

#### Delete Permission
```http
DELETE /api/admin/rbac/permissions/{id}
```

#### Bulk Create Permissions
```http
POST /api/admin/rbac/permissions/bulk-create
```

**Request Body:**
```json
{
  "permissions": [
    {
      "name": "custom.action1",
      "display_name": "Custom Action 1",
      "description": "Description"
    },
    {
      "name": "custom.action2",
      "display_name": "Custom Action 2",
      "description": "Description"
    }
  ]
}
```

### Role-Permission Assignment

#### Get Role Permissions
```http
GET /api/admin/rbac/roles/{id}/permissions
```

**Response:**
```json
{
  "success": true,
  "role": { ... },
  "permissions": [ ... ],
  "permissionIds": [1, 2, 3]
}
```

#### Assign Permissions to Role
```http
POST /api/admin/rbac/roles/{id}/permissions
```

**Request Body:**
```json
{
  "permissions": [1, 2, 3, 4, 5]
}
```

#### Remove Permissions from Role
```http
DELETE /api/admin/rbac/roles/{id}/permissions
```

**Request Body:**
```json
{
  "permissions": [1, 2]
}
```

### User Role Assignment

#### Get Role Users
```http
GET /api/admin/rbac/roles/{id}/users
```

**Response:**
```json
{
  "success": true,
  "role": { ... },
  "users": {
    "data": [ ... ],
    "total": 10,
    "per_page": 15
  }
}
```

#### Assign Role to User
```http
POST /api/admin/rbac/roles/{roleId}/assign-user
```

**Request Body:**
```json
{
  "user_id": 5
}
```

### Statistics & Matrix

#### Get Permission Matrix
```http
GET /api/admin/rbac/permission-matrix
```

**Response:**
```json
{
  "success": true,
  "matrix": {
    "super_admin": {
      "id": 1,
      "display_name": "Super Admin",
      "permissions": [1, 2, 3, ...],
      "permission_count": 31
    },
    "admin": {
      "id": 2,
      "display_name": "Admin",
      "permissions": [1, 2, 3, ...],
      "permission_count": 26
    }
  },
  "permissions": [ ... ],
  "total_permissions": 31
}
```

#### Get Statistics
```http
GET /api/admin/rbac/statistics
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total_roles": 5,
    "total_permissions": 31,
    "roles_with_users": 5,
    "roles_by_user_count": [
      { "name": "Super Admin", "user_count": 1 },
      { "name": "Admin", "user_count": 2 }
    ],
    "permissions_by_category": {
      "users": 5,
      "teams": 5,
      "projects": 5,
      "tasks": 6
    }
  }
}
```

#### Get Permission Statistics
```http
GET /api/admin/rbac/permission-statistics
```

## Frontend Components

### RBACManagement Page

**Location:** `src/pages/RBACManagement.js`

**Features:**
- View all roles with their details
- Create new roles
- Edit existing roles
- Delete roles
- Assign permissions to roles
- View all permissions
- View permission matrix
- View statistics

**Usage:**
```javascript
import RBACManagement from '../pages/RBACManagement';

// Add to routes
<Route path="/admin/rbac" element={<RBACManagement />} />
```

### useRBACManagement Hook

**Location:** `src/hooks/useRBACManagement.js`

**Methods:**
```javascript
const {
  loading,
  error,
  roles,
  permissions,
  matrix,
  statistics,
  fetchRoles,
  fetchPermissions,
  fetchPermissionMatrix,
  fetchStatistics,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  removePermissionsFromRole,
  getRolePermissions,
  getRoleUsers,
  assignRoleToUser,
  createPermission,
  updatePermission,
  deletePermission,
} = useRBACManagement();
```

**Example Usage:**
```javascript
import useRBACManagement from '../hooks/useRBACManagement';

function MyComponent() {
  const { roles, fetchRoles, createRole } = useRBACManagement();

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    await createRole({
      name: 'new_role',
      display_name: 'New Role',
      description: 'Role description'
    });
  };

  return (
    <div>
      {roles.map(role => (
        <div key={role.id}>{role.display_name}</div>
      ))}
      <button onClick={handleCreateRole}>Create Role</button>
    </div>
  );
}
```

## Workflow Examples

### 1. Create a New Role with Permissions

```javascript
// Step 1: Create the role
const newRole = await createRole({
  name: 'content_manager',
  display_name: 'Content Manager',
  description: 'Manages content and projects'
});

// Step 2: Get available permissions
const permData = await fetchPermissions();

// Step 3: Filter permissions you want to assign
const selectedPermissions = permData.permissions
  .filter(p => p.name.startsWith('projects.') || p.name.startsWith('tasks.'))
  .map(p => p.id);

// Step 4: Assign permissions to role
await assignPermissionsToRole(newRole.id, selectedPermissions);
```

### 2. Assign Role to User

```javascript
// Step 1: Get the role
const role = roles.find(r => r.name === 'content_manager');

// Step 2: Assign to user
await assignRoleToUser(role.id, userId);
```

### 3. Modify Role Permissions

```javascript
// Step 1: Get current permissions
const roleData = await getRolePermissions(roleId);
const currentPermissions = roleData.permissionIds;

// Step 2: Add new permissions
const newPermissions = [...currentPermissions, newPermissionId];

// Step 3: Update
await assignPermissionsToRole(roleId, newPermissions);
```

## Permission Categories

### Users (5 permissions)
- `users.create` - Create new users
- `users.view` - View users
- `users.update` - Update user details
- `users.delete` - Delete users
- `users.manage_roles` - Manage user roles

### Teams (5 permissions)
- `teams.create` - Create teams
- `teams.view` - View teams
- `teams.update` - Update teams
- `teams.delete` - Delete teams
- `teams.manage_members` - Manage team members

### Projects (5 permissions)
- `projects.create` - Create projects
- `projects.view` - View projects
- `projects.update` - Update projects
- `projects.delete` - Delete projects
- `projects.manage_team` - Manage project teams

### Tasks (6 permissions)
- `tasks.create` - Create tasks
- `tasks.view` - View tasks
- `tasks.update` - Update tasks
- `tasks.delete` - Delete tasks
- `tasks.change_status` - Change task status
- `tasks.assign` - Assign tasks

### Comments (3 permissions)
- `comments.create` - Create comments
- `comments.update` - Update comments
- `comments.delete` - Delete comments

### Files (2 permissions)
- `files.upload` - Upload files
- `files.delete` - Delete files

### System (3 permissions)
- `roles.manage` - Manage roles
- `permissions.manage` - Manage permissions
- `settings.manage` - Manage system settings

### Other (2 permissions)
- `notifications.view` - View notifications
- `reports.view` - View reports

## Security Considerations

1. **Super Admin Only**: All RBAC management endpoints require Super Admin authentication
2. **Role Protection**: Cannot delete roles that are assigned to users
3. **Permission Protection**: Cannot delete permissions that are assigned to roles
4. **Audit Trail**: All changes should be logged (implement audit logging)
5. **Validation**: All inputs are validated on both frontend and backend

## Best Practices

1. **Principle of Least Privilege**: Assign only necessary permissions to roles
2. **Role Naming**: Use descriptive, lowercase names with underscores (e.g., `content_manager`)
3. **Permission Naming**: Use dot notation with category prefix (e.g., `projects.create`)
4. **Documentation**: Document custom roles and their purposes
5. **Regular Audits**: Periodically review role-permission assignments
6. **Testing**: Test permission changes before deploying to production

## Troubleshooting

### Cannot Delete Role
**Error:** "Cannot delete role that is assigned to users"
**Solution:** Reassign all users to different roles before deleting

### Cannot Delete Permission
**Error:** "Cannot delete permission that is assigned to roles"
**Solution:** Remove permission from all roles before deleting

### Permission Not Working
**Solution:** 
1. Verify permission name matches exactly (case-sensitive)
2. Check that permission is assigned to the role
3. Verify user has the role assigned
4. Clear browser cache and refresh

### Access Denied
**Solution:**
1. Verify user is Super Admin
2. Check authentication token is valid
3. Verify endpoint URL is correct

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 403 | Forbidden (not Super Admin) |
| 404 | Not found |
| 422 | Validation error |
| 500 | Server error |

## Summary

The Super Admin RBAC Management system provides:
- ✅ Complete role management
- ✅ Complete permission management
- ✅ Flexible role-permission assignment
- ✅ User role assignment
- ✅ Statistics and reporting
- ✅ Super Admin protection
- ✅ Comprehensive API endpoints
- ✅ React frontend interface
