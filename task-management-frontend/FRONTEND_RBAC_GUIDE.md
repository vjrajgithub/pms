# Frontend RBAC Implementation Guide

## Overview

The frontend RBAC system provides role-based access control for React components and routes. It includes utilities, hooks, and protected components for managing permissions and roles.

## Files Created

### 1. **Utils** (`src/utils/rbac.js`)
Core RBAC utility functions for checking roles and permissions.

#### Constants
```javascript
import { ROLES, PERMISSIONS, ROLE_LEVELS } from '../utils/rbac';

// Roles
ROLES.SUPER_ADMIN    // 'super_admin'
ROLES.ADMIN          // 'admin'
ROLES.MANAGER        // 'manager'
ROLES.TEAM_LEAD      // 'team_lead'
ROLES.TEAM_MEMBER    // 'team_member'

// Role Levels (1-5)
ROLE_LEVELS.super_admin  // 5
ROLE_LEVELS.admin        // 4
ROLE_LEVELS.manager      // 3
ROLE_LEVELS.team_lead    // 2
ROLE_LEVELS.team_member  // 1

// Permissions
PERMISSIONS.USERS_CREATE
PERMISSIONS.PROJECTS_UPDATE
PERMISSIONS.TASKS_ASSIGN
// ... and 28 more
```

#### Functions
```javascript
import {
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isAdmin,
  isManager,
  isTeamLead,
  isTeamMember,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessProject,
  canAccessTask,
  canAccessTeam,
  canPerformAction,
  getUserRoleDisplay,
  getRoleColor,
  getRoleBadgeVariant,
} from '../utils/rbac';

// Check role
hasRole(user, 'manager')
hasAnyRole(user, ['manager', 'team_lead'])
isSuperAdmin(user)
isAdmin(user)
isManager(user)
isTeamLead(user)
isTeamMember(user)

// Check permission
hasPermission(user, 'projects.create')
hasAnyPermission(user, ['projects.create', 'projects.update'])
hasAllPermissions(user, ['projects.create', 'projects.view'])

// Check access
canAccessProject(user, project)
canAccessTask(user, task)
canAccessTeam(user, team)
canPerformAction(user, 'create', 'projects')

// Display utilities
getUserRoleDisplay(user)        // 'Manager'
getRoleColor('manager')         // '#4ECDC4'
getRoleBadgeVariant('manager')  // 'info'
```

### 2. **Hooks** (`src/hooks/useRBAC.js`)
Custom React hooks for RBAC functionality.

#### Main Hook
```javascript
import { useRBAC } from '../hooks/useRBAC';

function MyComponent() {
  const {
    user,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isManager,
    canAccessProject,
    getUserRoleDisplay,
  } = useRBAC();

  if (isSuperAdmin()) {
    return <AdminPanel />;
  }

  if (hasPermission('projects.create')) {
    return <CreateProjectButton />;
  }

  return <ViewOnlyProjects />;
}
```

#### Specific Hooks
```javascript
import {
  useCanAccess,
  useHasRole,
  useHasAnyRole,
  useCanAccessProject,
  useCanAccessTask,
  useCanAccessTeam,
  useUserRoleDisplay,
  useRoleColor,
  useRoleBadgeVariant,
} from '../hooks/useRBAC';

// Check permission
const canCreate = useCanAccess('projects.create');

// Check role
const isManager = useHasRole('manager');
const isManagerOrLead = useHasAnyRole(['manager', 'team_lead']);

// Check resource access
const canAccess = useCanAccessProject(project);

// Display utilities
const roleDisplay = useUserRoleDisplay();
const roleColor = useRoleColor();
```

### 3. **Protected Components** (`src/components/ProtectedComponent.js`)
Components that conditionally render based on permissions/roles.

#### Permission-Based Components
```javascript
import { CanAccess } from '../components/ProtectedComponent';

// Single permission
<CanAccess permission="projects.create">
  <CreateProjectButton />
</CanAccess>

// Multiple permissions (any)
<CanAccess permission={['projects.create', 'projects.update']}>
  <EditProjectButton />
</CanAccess>

// Multiple permissions (all)
<CanAccess 
  permission={['projects.create', 'projects.view']} 
  requireAll={true}
>
  <ManageProjectsButton />
</CanAccess>

// With fallback
<CanAccess 
  permission="projects.delete"
  fallback={<p>You cannot delete projects</p>}
>
  <DeleteProjectButton />
</CanAccess>
```

#### Role-Based Components
```javascript
import {
  CanAccessRole,
  IsSuperAdmin,
  IsAdmin,
  IsManager,
  IsTeamLead,
  IsTeamMember,
} from '../components/ProtectedComponent';

// Generic role check
<CanAccessRole role="manager">
  <ManagerPanel />
</CanAccessRole>

// Multiple roles
<CanAccessRole role={['manager', 'team_lead']}>
  <LeadershipPanel />
</CanAccessRole>

// Specific role components
<IsSuperAdmin>
  <SystemSettings />
</IsSuperAdmin>

<IsAdmin>
  <AdminDashboard />
</IsAdmin>

<IsManager>
  <ManagerDashboard />
</IsManager>
```

#### Resource-Based Components
```javascript
import {
  CanAccessProject,
  CanAccessTask,
  CanAccessTeam,
} from '../components/ProtectedComponent';

// Project access
<CanAccessProject project={project}>
  <ProjectDetails />
</CanAccessProject>

// Task access
<CanAccessTask task={task}>
  <TaskDetails />
</CanAccessTask>

// Team access
<CanAccessTeam team={team}>
  <TeamMembers />
</CanAccessTeam>
```

### 4. **Protected Routes** (`src/components/ProtectedRoute.js`)
Components for protecting entire routes based on permissions/roles.

#### Permission-Based Routes
```javascript
import { ProtectedRoute } from '../components/ProtectedRoute';

<Routes>
  <Route
    path="/projects/create"
    element={
      <ProtectedRoute permission="projects.create">
        <CreateProject />
      </ProtectedRoute>
    }
  />
</Routes>
```

#### Role-Based Routes
```javascript
import { RoleProtectedRoute, AdminRoute, ManagerRoute } from '../components/ProtectedRoute';

<Routes>
  {/* Admin only */}
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    }
  />

  {/* Manager and above */}
  <Route
    path="/manager"
    element={
      <ManagerRoute>
        <ManagerPanel />
      </ManagerRoute>
    }
  />

  {/* Custom roles */}
  <Route
    path="/leadership"
    element={
      <RoleProtectedRoute role={['manager', 'team_lead']}>
        <LeadershipPanel />
      </RoleProtectedRoute>
    }
  />
</Routes>
```

## Usage Examples

### Example 1: Conditional Button Rendering
```javascript
import { useRBAC } from '../hooks/useRBAC';
import { CanAccess } from '../components/ProtectedComponent';

function ProjectActions({ project }) {
  const { hasPermission } = useRBAC();

  return (
    <div>
      <CanAccess permission="projects.view">
        <button>View</button>
      </CanAccess>

      <CanAccess permission="projects.update">
        <button>Edit</button>
      </CanAccess>

      <CanAccess permission="projects.delete">
        <button>Delete</button>
      </CanAccess>
    </div>
  );
}
```

### Example 2: Role-Based Dashboard
```javascript
import { useRBAC } from '../hooks/useRBAC';
import { IsSuperAdmin, IsAdmin, IsManager } from '../components/ProtectedComponent';

function Dashboard() {
  const { user, getUserRoleDisplay } = useRBAC();

  return (
    <div>
      <h1>Welcome, {user?.first_name}!</h1>
      <p>Role: {getUserRoleDisplay()}</p>

      <IsSuperAdmin>
        <SystemAdminPanel />
      </IsSuperAdmin>

      <IsAdmin>
        <AdminPanel />
      </IsAdmin>

      <IsManager>
        <ManagerPanel />
      </IsManager>
    </div>
  );
}
```

### Example 3: Protected Data Table
```javascript
import { useRBAC } from '../hooks/useRBAC';
import { CanAccess } from '../components/ProtectedComponent';

function ProjectsTable({ projects }) {
  const { canAccessProject } = useRBAC();

  return (
    <table>
      <tbody>
        {projects
          .filter(project => canAccessProject(project))
          .map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <CanAccess permission="projects.update">
                <td><button>Edit</button></td>
              </CanAccess>
              <CanAccess permission="projects.delete">
                <td><button>Delete</button></td>
              </CanAccess>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
```

### Example 4: Complex Permission Check
```javascript
import { useRBAC } from '../hooks/useRBAC';

function TaskActions({ task }) {
  const { 
    hasPermission, 
    canAccessTask,
    isManager,
    user 
  } = useRBAC();

  const canEdit = 
    canAccessTask(task) && 
    (hasPermission('tasks.update') || task.assigned_to === user.id);

  const canDelete = 
    hasPermission('tasks.delete') && 
    (isManager() || task.created_by === user.id);

  return (
    <div>
      {canEdit && <button>Edit Task</button>}
      {canDelete && <button>Delete Task</button>}
    </div>
  );
}
```

## Integration with Existing Components

### Update Existing Components
```javascript
// Before
function ProjectList() {
  return (
    <div>
      <button>Create Project</button>
      {/* ... */}
    </div>
  );
}

// After
import { CanAccess } from '../components/ProtectedComponent';

function ProjectList() {
  return (
    <div>
      <CanAccess permission="projects.create">
        <button>Create Project</button>
      </CanAccess>
      {/* ... */}
    </div>
  );
}
```

## Best Practices

1. **Use Hooks for Logic**
   - Use `useRBAC()` for complex permission logic
   - Use specific hooks for simple checks

2. **Use Components for UI**
   - Use `<CanAccess>` for conditional rendering
   - Use `<ProtectedRoute>` for route protection

3. **Combine Checks**
   ```javascript
   <CanAccess permission="projects.update">
     <CanAccessProject project={project}>
       <EditButton />
     </CanAccessProject>
   </CanAccess>
   ```

4. **Provide Fallbacks**
   ```javascript
   <CanAccess 
     permission="projects.delete"
     fallback={<DisabledButton />}
   >
     <DeleteButton />
   </CanAccess>
   ```

5. **Cache User Data**
   - User and permissions are stored in AuthContext
   - Avoid redundant API calls

## Permission Matrix

| Permission | Super Admin | Admin | Manager | Team Lead | Team Member |
|-----------|:-----------:|:-----:|:-------:|:---------:|:-----------:|
| users.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| projects.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| projects.update | ✓ | ✓ | ✓* | ✓* | ✗ |
| tasks.create | ✓ | ✓ | ✓ | ✓ | ✗ |
| tasks.update | ✓ | ✓ | ✓* | ✓* | ✓* |
| tasks.assign | ✓ | ✓ | ✓* | ✓ | ✗ |
| comments.create | ✓ | ✓ | ✓ | ✓ | ✓ |

*Limited to own resources or assigned items

## Troubleshooting

### Permissions Not Working
1. Ensure user data includes `permissions` array
2. Check that permissions match backend permission names
3. Verify user role is set correctly

### Routes Not Protected
1. Ensure route is wrapped with `<ProtectedRoute>`
2. Check that permission/role is correct
3. Verify user is authenticated

### Components Not Rendering
1. Check user permissions in browser DevTools
2. Verify permission names match backend
3. Test with `useRBAC()` hook directly

## Testing

```javascript
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { CanAccess } from '../components/ProtectedComponent';

test('renders content when user has permission', () => {
  const mockUser = {
    id: 1,
    permissions: ['projects.create'],
    role: { name: 'manager' }
  };

  render(
    <AuthProvider>
      <CanAccess permission="projects.create">
        <div>Create Project</div>
      </CanAccess>
    </AuthProvider>
  );

  expect(screen.getByText('Create Project')).toBeInTheDocument();
});
```

## Summary

The frontend RBAC system provides:
- ✅ Role-based access control
- ✅ Permission checking
- ✅ Resource-based access
- ✅ Protected components
- ✅ Protected routes
- ✅ Custom hooks
- ✅ Utility functions
- ✅ Full integration with backend RBAC
