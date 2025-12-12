# Frontend RBAC Quick Reference

## Quick Start

### 1. Import Utilities
```javascript
import { useRBAC } from '../hooks/useRBAC';
import { CanAccess, IsSuperAdmin, IsManager } from '../components/ProtectedComponent';
import { ProtectedRoute, AdminRoute } from '../components/ProtectedRoute';
```

### 2. Check Permissions in Component
```javascript
function MyComponent() {
  const { hasPermission, isSuperAdmin } = useRBAC();
  
  if (isSuperAdmin()) return <AdminPanel />;
  if (hasPermission('projects.create')) return <CreateButton />;
  return <ViewOnly />;
}
```

### 3. Conditionally Render UI
```javascript
<CanAccess permission="projects.create">
  <CreateProjectButton />
</CanAccess>

<IsSuperAdmin>
  <AdminSettings />
</IsSuperAdmin>
```

### 4. Protect Routes
```javascript
<Route
  path="/admin"
  element={<AdminRoute><AdminPanel /></AdminRoute>}
/>
```

## Common Patterns

### Check Single Permission
```javascript
const { hasPermission } = useRBAC();
if (hasPermission('projects.create')) { }
```

### Check Multiple Permissions (Any)
```javascript
const { hasAnyPermission } = useRBAC();
if (hasAnyPermission(['projects.create', 'projects.update'])) { }
```

### Check Multiple Permissions (All)
```javascript
const { hasAllPermissions } = useRBAC();
if (hasAllPermissions(['projects.create', 'projects.view'])) { }
```

### Check Role
```javascript
const { hasRole, isSuperAdmin, isManager } = useRBAC();
if (hasRole('manager')) { }
if (isSuperAdmin()) { }
if (isManager()) { }
```

### Check Resource Access
```javascript
const { canAccessProject, canAccessTask } = useRBAC();
if (canAccessProject(project)) { }
if (canAccessTask(task)) { }
```

### Get User Info
```javascript
const { user, getUserRoleDisplay, getRoleColor } = useRBAC();
console.log(user.first_name);
console.log(getUserRoleDisplay()); // 'Manager'
console.log(getRoleColor()); // '#4ECDC4'
```

## Component Examples

### Conditional Button
```javascript
<CanAccess permission="projects.delete">
  <button>Delete</button>
</CanAccess>
```

### Conditional Section
```javascript
<CanAccess permission="projects.manage_team">
  <TeamManagementSection />
</CanAccess>
```

### Role-Based Section
```javascript
<IsManager>
  <ManagerDashboard />
</IsManager>
```

### With Fallback
```javascript
<CanAccess 
  permission="projects.delete"
  fallback={<span>No permission</span>}
>
  <DeleteButton />
</CanAccess>
```

## Route Examples

### Permission-Based Route
```javascript
<Route
  path="/projects/create"
  element={
    <ProtectedRoute permission="projects.create">
      <CreateProject />
    </ProtectedRoute>
  }
/>
```

### Role-Based Route
```javascript
<Route
  path="/admin"
  element={<AdminRoute><AdminPanel /></AdminRoute>}
/>

<Route
  path="/manager"
  element={<ManagerRoute><ManagerPanel /></ManagerRoute>}
/>
```

### Custom Roles Route
```javascript
<Route
  path="/leadership"
  element={
    <RoleProtectedRoute role={['manager', 'team_lead']}>
      <LeadershipPanel />
    </RoleProtectedRoute>
  }
/>
```

## Permissions List

### Users
- `users.create`
- `users.view`
- `users.update`
- `users.delete`
- `users.manage_roles`

### Teams
- `teams.create`
- `teams.view`
- `teams.update`
- `teams.delete`
- `teams.manage_members`

### Projects
- `projects.create`
- `projects.view`
- `projects.update`
- `projects.delete`
- `projects.manage_team`

### Tasks
- `tasks.create`
- `tasks.view`
- `tasks.update`
- `tasks.delete`
- `tasks.change_status`
- `tasks.assign`

### Comments & Files
- `comments.create`
- `comments.update`
- `comments.delete`
- `files.upload`
- `files.delete`

### Other
- `notifications.view`
- `reports.view`
- `roles.manage`
- `permissions.manage`
- `settings.manage`

## Roles

| Role | Level | Can Do |
|------|-------|--------|
| Super Admin | 5 | Everything |
| Admin | 4 | Manage org (except Super Admin) |
| Manager | 3 | Manage own items |
| Team Lead | 2 | Manage assigned projects |
| Team Member | 1 | Manage assigned tasks |

## Hooks Cheat Sheet

```javascript
// Main hook
const rbac = useRBAC();

// Role checks
rbac.hasRole('manager')
rbac.hasAnyRole(['manager', 'team_lead'])
rbac.isSuperAdmin()
rbac.isAdmin()
rbac.isManager()
rbac.isTeamLead()
rbac.isTeamMember()

// Permission checks
rbac.hasPermission('projects.create')
rbac.hasAnyPermission(['projects.create', 'projects.update'])
rbac.hasAllPermissions(['projects.create', 'projects.view'])

// Resource access
rbac.canAccessProject(project)
rbac.canAccessTask(task)
rbac.canAccessTeam(team)

// Display
rbac.getUserRoleDisplay()
rbac.getRoleColor()
rbac.getRoleBadgeVariant()

// User info
rbac.user
rbac.getRoleLevel()
```

## Component Cheat Sheet

```javascript
// Permission-based
<CanAccess permission="..." />
<CanAccess permission={[...]} />

// Role-based
<CanAccessRole role="..." />
<IsSuperAdmin />
<IsAdmin />
<IsManager />
<IsTeamLead />
<IsTeamMember />

// Resource-based
<CanAccessProject project={...} />
<CanAccessTask task={...} />
<CanAccessTeam team={...} />
```

## Route Cheat Sheet

```javascript
// Permission-based
<ProtectedRoute permission="..." />

// Role-based
<RoleProtectedRoute role="..." />
<SuperAdminRoute />
<AdminRoute />
<ManagerRoute />
```

## Common Mistakes

❌ **Wrong**: Using backend permission format
```javascript
hasPermission('projects/create')  // Wrong
```

✅ **Right**: Using dot notation
```javascript
hasPermission('projects.create')  // Correct
```

---

❌ **Wrong**: Forgetting to wrap with provider
```javascript
function App() {
  return <MyComponent />;  // No AuthProvider
}
```

✅ **Right**: Wrap with AuthProvider
```javascript
function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}
```

---

❌ **Wrong**: Not checking authentication
```javascript
const { user } = useRBAC();
console.log(user.id);  // Might be null
```

✅ **Right**: Check authentication first
```javascript
const { user, isAuthenticated } = useRBAC();
if (isAuthenticated && user) {
  console.log(user.id);
}
```

## Testing

```javascript
// Mock user with permissions
const mockUser = {
  id: 1,
  first_name: 'John',
  permissions: ['projects.create', 'projects.view'],
  role: { name: 'manager', display_name: 'Manager' }
};

// Test with useRBAC
const { hasPermission } = useRBAC();
expect(hasPermission('projects.create')).toBe(true);

// Test with components
render(
  <CanAccess permission="projects.create">
    <button>Create</button>
  </CanAccess>
);
expect(screen.getByText('Create')).toBeInTheDocument();
```

## Files Location

- **Utilities**: `src/utils/rbac.js`
- **Hooks**: `src/hooks/useRBAC.js`
- **Components**: `src/components/ProtectedComponent.js`
- **Routes**: `src/components/ProtectedRoute.js`
- **Guide**: `FRONTEND_RBAC_GUIDE.md`
- **Reference**: `FRONTEND_RBAC_QUICK_REFERENCE.md`
