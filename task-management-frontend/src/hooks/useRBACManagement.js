/**
 * Hook for RBAC Management - Super Admin only
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useRBACManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Get all roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/rbac/roles');
      setRoles(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch roles';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all permissions
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/rbac/permissions');
      setPermissions(response.data.permissions);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch permissions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get permission matrix
  const fetchPermissionMatrix = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/rbac/permission-matrix');
      setMatrix(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch permission matrix';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get statistics
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/rbac/statistics');
      setStatistics(response.data.statistics);
      return response.data.statistics;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch statistics';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create role
  const createRole = useCallback(async (roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/admin/rbac/roles', roleData);
      setRoles([...roles, response.data.role]);
      return response.data.role;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create role';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  // Update role
  const updateRole = useCallback(async (roleId, roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/admin/rbac/roles/${roleId}`, roleData);
      setRoles(roles.map(r => r.id === roleId ? response.data.role : r));
      return response.data.role;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update role';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  // Delete role
  const deleteRole = useCallback(async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/admin/rbac/roles/${roleId}`);
      setRoles(roles.filter(r => r.id !== roleId));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete role';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  // Assign permissions to role
  const assignPermissionsToRole = useCallback(async (roleId, permissionIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/admin/rbac/roles/${roleId}/permissions`, {
        permissions: permissionIds
      });
      setRoles(roles.map(r => r.id === roleId ? response.data.role : r));
      return response.data.role;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to assign permissions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  // Remove permissions from role
  const removePermissionsFromRole = useCallback(async (roleId, permissionIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/admin/rbac/roles/${roleId}/permissions`, {
        data: { permissions: permissionIds }
      });
      setRoles(roles.map(r => r.id === roleId ? response.data.role : r));
      return response.data.role;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to remove permissions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  // Get role permissions
  const getRolePermissions = useCallback(async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/admin/rbac/roles/${roleId}/permissions`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch role permissions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get role users
  const getRoleUsers = useCallback(async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/admin/rbac/roles/${roleId}/users`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch role users';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign role to user
  const assignRoleToUser = useCallback(async (roleId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/admin/rbac/roles/${roleId}/assign-user`, {
        user_id: userId
      });
      return response.data.user;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to assign role to user';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create permission
  const createPermission = useCallback(async (permissionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/admin/rbac/permissions', permissionData);
      setPermissions([...permissions, response.data.permission]);
      return response.data.permission;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create permission';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  // Update permission
  const updatePermission = useCallback(async (permissionId, permissionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/admin/rbac/permissions/${permissionId}`, permissionData);
      setPermissions(permissions.map(p => p.id === permissionId ? response.data.permission : p));
      return response.data.permission;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update permission';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  // Delete permission
  const deletePermission = useCallback(async (permissionId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/admin/rbac/permissions/${permissionId}`);
      setPermissions(permissions.filter(p => p.id !== permissionId));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete permission';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  return {
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
  };
};

export default useRBACManagement;
