/**
 * RBAC Utility Functions for Frontend
 * Provides role and permission checking utilities
 */

// Role Hierarchy Levels
export const ROLE_LEVELS = {
  super_admin: 5,
  admin: 4,
  manager: 3,
  team_lead: 2,
  team_member: 1,
};

// Role Names
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  TEAM_LEAD: 'team_lead',
  TEAM_MEMBER: 'team_member',
};

// Permissions
export const PERMISSIONS = {
  // User Management
  USERS_CREATE: 'users.create',
  USERS_VIEW: 'users.view',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_ROLES: 'users.manage_roles',

  // Team Management
  TEAMS_CREATE: 'teams.create',
  TEAMS_VIEW: 'teams.view',
  TEAMS_UPDATE: 'teams.update',
  TEAMS_DELETE: 'teams.delete',
  TEAMS_MANAGE_MEMBERS: 'teams.manage_members',

  // Project Management
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_VIEW: 'projects.view',
  PROJECTS_UPDATE: 'projects.update',
  PROJECTS_DELETE: 'projects.delete',
  PROJECTS_MANAGE_TEAM: 'projects.manage_team',

  // Task Management
  TASKS_CREATE: 'tasks.create',
  TASKS_VIEW: 'tasks.view',
  TASKS_UPDATE: 'tasks.update',
  TASKS_DELETE: 'tasks.delete',
  TASKS_CHANGE_STATUS: 'tasks.change_status',
  TASKS_ASSIGN: 'tasks.assign',

  // Comments & Files
  COMMENTS_CREATE: 'comments.create',
  COMMENTS_UPDATE: 'comments.update',
  COMMENTS_DELETE: 'comments.delete',
  FILES_UPLOAD: 'files.upload',
  FILES_DELETE: 'files.delete',

  // Notifications & Reports
  NOTIFICATIONS_VIEW: 'notifications.view',
  REPORTS_VIEW: 'reports.view',

  // System
  ROLES_MANAGE: 'roles.manage',
  PERMISSIONS_MANAGE: 'permissions.manage',
  SETTINGS_MANAGE: 'settings.manage',
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role?.name === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !Array.isArray(roles)) return false;
  return roles.includes(user.role?.name);
};

/**
 * Check if user is Super Admin
 */
export const isSuperAdmin = (user) => {
  return hasRole(user, ROLES.SUPER_ADMIN);
};

/**
 * Check if user is Admin
 */
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Check if user is Manager
 */
export const isManager = (user) => {
  return hasRole(user, ROLES.MANAGER);
};

/**
 * Check if user is Team Lead
 */
export const isTeamLead = (user) => {
  return hasRole(user, ROLES.TEAM_LEAD);
};

/**
 * Check if user is Team Member
 */
export const isTeamMember = (user) => {
  return hasRole(user, ROLES.TEAM_MEMBER);
};

/**
 * Get role level (1-5)
 */
export const getRoleLevel = (user) => {
  if (!user || !user.role) return 0;
  return ROLE_LEVELS[user.role.name] || 0;
};

/**
 * Check if user has role level (higher or equal)
 */
export const hasRoleLevel = (user, level) => {
  return getRoleLevel(user) >= level;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // Super Admin has all permissions
  if (isSuperAdmin(user)) return true;
  
  // Check if user has permission
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  
  return false;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user can access a project
 */
export const canAccessProject = (user, project) => {
  if (!user || !project) return false;
  
  // Super Admin and Admin can access all
  if (isSuperAdmin(user) || isAdmin(user)) return true;
  
  // Manager can access their own projects
  if (isManager(user) && project.manager_id === user.id) return true;
  
  // Team Lead can access assigned projects
  if (isTeamLead(user) && project.team_lead_id === user.id) return true;
  
  // Team Member can access projects with their teams
  if (isTeamMember(user) && project.teams) {
    return project.teams.some(team => 
      team.members?.some(member => member.user_id === user.id)
    );
  }
  
  return false;
};

/**
 * Check if user can access a task
 */
export const canAccessTask = (user, task) => {
  if (!user || !task) return false;
  
  // Super Admin and Admin can access all
  if (isSuperAdmin(user) || isAdmin(user)) return true;
  
  // Manager can access tasks in their projects
  if (isManager(user) && task.project?.manager_id === user.id) return true;
  
  // Team Lead can access tasks in their projects
  if (isTeamLead(user) && task.project?.team_lead_id === user.id) return true;
  
  // Team Member can access assigned tasks
  if (isTeamMember(user) && task.assigned_to === user.id) return true;
  
  return false;
};

/**
 * Check if user can access a team
 */
export const canAccessTeam = (user, team) => {
  if (!user || !team) return false;
  
  // Super Admin and Admin can access all
  if (isSuperAdmin(user) || isAdmin(user)) return true;
  
  // Manager can access teams they created
  if (isManager(user) && team.created_by === user.id) return true;
  
  // Team Lead can access teams they lead
  if (isTeamLead(user) && team.team_lead_id === user.id) return true;
  
  // Team Member can access their teams
  if (isTeamMember(user) && team.members) {
    return team.members.some(member => member.user_id === user.id);
  }
  
  return false;
};

/**
 * Check if user can perform action on resource
 */
export const canPerformAction = (user, action, resource) => {
  if (!user) return false;
  
  // Super Admin can perform all actions
  if (isSuperAdmin(user)) return true;
  
  // Check permission based on action and resource
  const permission = `${resource}.${action}`;
  return hasPermission(user, permission);
};

/**
 * Get user's display role
 */
export const getUserRoleDisplay = (user) => {
  if (!user || !user.role) return 'Unknown';
  
  const roleNames = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    team_lead: 'Team Lead',
    team_member: 'Team Member',
  };
  
  return roleNames[user.role.name] || user.role.display_name || 'Unknown';
};

/**
 * Get role color for UI
 */
export const getRoleColor = (roleName) => {
  const colors = {
    super_admin: '#FF6B6B', // Red
    admin: '#FF8C42', // Orange
    manager: '#4ECDC4', // Teal
    team_lead: '#45B7D1', // Blue
    team_member: '#96CEB4', // Green
  };
  
  return colors[roleName] || '#999999';
};

/**
 * Get role badge variant for UI
 */
export const getRoleBadgeVariant = (roleName) => {
  const variants = {
    super_admin: 'error',
    admin: 'warning',
    manager: 'info',
    team_lead: 'primary',
    team_member: 'success',
  };
  
  return variants[roleName] || 'default';
};

export default {
  ROLE_LEVELS,
  ROLES,
  PERMISSIONS,
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isAdmin,
  isManager,
  isTeamLead,
  isTeamMember,
  getRoleLevel,
  hasRoleLevel,
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
};
