/**
 * Custom Hooks for RBAC
 */

import { useAuth } from '../contexts/AuthContext';
import {
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
} from '../utils/rbac';

/**
 * Hook to check user roles and permissions
 */
export const useRBAC = () => {
  const { user } = useAuth();

  return {
    user,
    hasRole: (role) => hasRole(user, role),
    hasAnyRole: (roles) => hasAnyRole(user, roles),
    isSuperAdmin: () => isSuperAdmin(user),
    isAdmin: () => isAdmin(user),
    isManager: () => isManager(user),
    isTeamLead: () => isTeamLead(user),
    isTeamMember: () => isTeamMember(user),
    getRoleLevel: () => getRoleLevel(user),
    hasRoleLevel: (level) => hasRoleLevel(user, level),
    hasPermission: (permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
    canAccessProject: (project) => canAccessProject(user, project),
    canAccessTask: (task) => canAccessTask(user, task),
    canAccessTeam: (team) => canAccessTeam(user, team),
    canPerformAction: (action, resource) => canPerformAction(user, action, resource),
    getUserRoleDisplay: () => getUserRoleDisplay(user),
    getRoleColor: () => getRoleColor(user?.role?.name),
    getRoleBadgeVariant: () => getRoleBadgeVariant(user?.role?.name),
  };
};

/**
 * Hook to check if user can perform specific action
 */
export const useCanAccess = (permission) => {
  const { user } = useAuth();
  return hasPermission(user, permission);
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (role) => {
  const { user } = useAuth();
  return hasRole(user, role);
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useHasAnyRole = (roles) => {
  const { user } = useAuth();
  return hasAnyRole(user, roles);
};

/**
 * Hook to check if user can access a project
 */
export const useCanAccessProject = (project) => {
  const { user } = useAuth();
  return canAccessProject(user, project);
};

/**
 * Hook to check if user can access a task
 */
export const useCanAccessTask = (task) => {
  const { user } = useAuth();
  return canAccessTask(user, task);
};

/**
 * Hook to check if user can access a team
 */
export const useCanAccessTeam = (team) => {
  const { user } = useAuth();
  return canAccessTeam(user, team);
};

/**
 * Hook to get user role display name
 */
export const useUserRoleDisplay = () => {
  const { user } = useAuth();
  return getUserRoleDisplay(user);
};

/**
 * Hook to get user role color
 */
export const useRoleColor = () => {
  const { user } = useAuth();
  return getRoleColor(user?.role?.name);
};

/**
 * Hook to get user role badge variant
 */
export const useRoleBadgeVariant = () => {
  const { user } = useAuth();
  return getRoleBadgeVariant(user?.role?.name);
};

export default useRBAC;
