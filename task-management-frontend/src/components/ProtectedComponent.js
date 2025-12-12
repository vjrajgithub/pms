/**
 * Protected Component - Conditionally renders based on permissions/roles
 */

import React from 'react';
import { useRBAC } from '../hooks/useRBAC';

/**
 * Component that renders children only if user has the required permission
 */
export const CanAccess = ({ 
  permission, 
  children, 
  fallback = null,
  requireAll = false 
}) => {
  const { hasPermission, hasAllPermissions } = useRBAC();
  
  // Handle array of permissions
  if (Array.isArray(permission)) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : permission.some(p => hasPermission(p));
    
    return hasAccess ? children : fallback;
  }
  
  // Single permission
  return hasPermission(permission) ? children : fallback;
};

/**
 * Component that renders children only if user has the required role
 */
export const CanAccessRole = ({ 
  role, 
  children, 
  fallback = null,
  requireAll = false 
}) => {
  const { hasRole, hasAnyRole } = useRBAC();
  
  // Handle array of roles
  if (Array.isArray(role)) {
    const hasAccess = requireAll 
      ? role.every(r => hasRole(r))
      : hasAnyRole(role);
    
    return hasAccess ? children : fallback;
  }
  
  // Single role
  return hasRole(role) ? children : fallback;
};

/**
 * Component that renders children only if user is Super Admin
 */
export const IsSuperAdmin = ({ children, fallback = null }) => {
  const { isSuperAdmin } = useRBAC();
  return isSuperAdmin() ? children : fallback;
};

/**
 * Component that renders children only if user is Admin
 */
export const IsAdmin = ({ children, fallback = null }) => {
  const { isAdmin } = useRBAC();
  return isAdmin() ? children : fallback;
};

/**
 * Component that renders children only if user is Manager
 */
export const IsManager = ({ children, fallback = null }) => {
  const { isManager } = useRBAC();
  return isManager() ? children : fallback;
};

/**
 * Component that renders children only if user is Team Lead
 */
export const IsTeamLead = ({ children, fallback = null }) => {
  const { isTeamLead } = useRBAC();
  return isTeamLead() ? children : fallback;
};

/**
 * Component that renders children only if user is Team Member
 */
export const IsTeamMember = ({ children, fallback = null }) => {
  const { isTeamMember } = useRBAC();
  return isTeamMember() ? children : fallback;
};

/**
 * Component that renders children only if user can access a project
 */
export const CanAccessProject = ({ 
  project, 
  children, 
  fallback = null 
}) => {
  const { canAccessProject } = useRBAC();
  return canAccessProject(project) ? children : fallback;
};

/**
 * Component that renders children only if user can access a task
 */
export const CanAccessTask = ({ 
  task, 
  children, 
  fallback = null 
}) => {
  const { canAccessTask } = useRBAC();
  return canAccessTask(task) ? children : fallback;
};

/**
 * Component that renders children only if user can access a team
 */
export const CanAccessTeam = ({ 
  team, 
  children, 
  fallback = null 
}) => {
  const { canAccessTeam } = useRBAC();
  return canAccessTeam(team) ? children : fallback;
};

export default {
  CanAccess,
  CanAccessRole,
  IsSuperAdmin,
  IsAdmin,
  IsManager,
  IsTeamLead,
  IsTeamMember,
  CanAccessProject,
  CanAccessTask,
  CanAccessTeam,
};
