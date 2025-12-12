import axios from 'axios';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTree = async () => {
  const resp = await axios.get('/api/categories/tree', { headers: authHeaders() });
  return resp.data || [];
};

export const getChildren = async (parentId = null) => {
  const params = {};
  if (parentId !== null && parentId !== undefined) params.parent_id = parentId;
  const resp = await axios.get('/api/categories', { params, headers: authHeaders() });
  return resp.data || [];
};

export const createCategory = async (payload) => {
  const resp = await axios.post('/api/categories', payload, { headers: authHeaders() });
  return resp.data?.category;
};

export const updateCategory = async (id, payload) => {
  const resp = await axios.put(`/api/categories/${id}`, payload, { headers: authHeaders() });
  return resp.data?.category;
};

export const deleteCategory = async (id) => {
  const resp = await axios.delete(`/api/categories/${id}`, { headers: authHeaders() });
  return resp.data;
};
