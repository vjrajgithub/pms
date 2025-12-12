import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, Add, Edit, Delete, Save, Close } from '@mui/icons-material';
import { getTree, createCategory, updateCategory, deleteCategory } from '../../api/categories';

const Row = ({ children, depth, ...props }) => (
  <Box display="flex" alignItems="center" gap={1} pl={depth * 2} py={0.5} {...props}>
    {children}
  </Box>
);

export default function CategoryTree({ canManage = true, maxDepth = 6 }) {
  const [tree, setTree] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [addingFor, setAddingFor] = useState(null);
  const [addingName, setAddingName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTree();
      setTree(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const startAdd = (parentId) => { setAddingFor(parentId ?? 'root'); setAddingName(''); };
  const cancelAdd = () => { setAddingFor(null); setAddingName(''); };
  const saveAdd = async (parentId) => {
    if (!addingName.trim()) return;
    const pid = parentId === 'root' ? null : (parentId || null);
    await createCategory({ name: addingName.trim(), parent_id: pid });
    cancelAdd();
    await load();
    if (parentId && parentId !== 'root') setExpanded(prev => ({ ...prev, [parentId]: true }));
  };

  const startEdit = (id, name) => { setEditingId(id); setEditingName(name); };
  const cancelEdit = () => { setEditingId(null); setEditingName(''); };
  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
    await updateCategory(id, { name: editingName.trim() });
    cancelEdit();
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category and its subtree?')) return;
    await deleteCategory(id);
    await load();
  };

  const getKids = (n) => (n?.children_recursive || n?.children || n?.childrenRecursive || []);
  const findNode = (nodes, id) => {
    for (const n of nodes) {
      if (n.id === id) return n;
      const found = findNode(getKids(n), id);
      if (found) return found;
    }
    return null;
  };
  const isDesc = (ancestorId, childId) => {
    const anc = findNode(tree, ancestorId);
    if (!anc) return false;
    const stack = [...getKids(anc)];
    while (stack.length) {
      const cur = stack.pop();
      if (cur.id === childId) return true;
      stack.push(...getKids(cur));
    }
    return false;
  };
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    if (e?.dataTransfer) e.dataTransfer.setData('text/plain', String(id));
  };
  const handleDragOver = (e) => {
    if (canManage) e.preventDefault();
  };
  const handleDropToNode = async (e, targetId) => {
    e.preventDefault();
    const srcId = (draggingId ?? Number(e.dataTransfer.getData('text/plain'))) || null;
    setDraggingId(null);
    if (!canManage || !srcId || srcId === targetId) return;
    if (isDesc(srcId, targetId)) return;
    await updateCategory(srcId, { parent_id: targetId });
    await load();
    setExpanded(prev => ({ ...prev, [targetId]: true }));
  };
  const handleDropToRoot = async (e) => {
    e.preventDefault();
    const srcId = (draggingId ?? Number(e.dataTransfer.getData('text/plain'))) || null;
    setDraggingId(null);
    if (!canManage || !srcId) return;
    await updateCategory(srcId, { parent_id: null });
    await load();
  };

  const renderNode = (node, depth) => {
    const hasChildren = Array.isArray(node.children_recursive) ? node.children_recursive.length > 0 : Array.isArray(node.children) ? node.children.length > 0 : Array.isArray(node.childrenRecursive) ? node.childrenRecursive.length > 0 : false;
    const children = (node.children_recursive || node.children || node.childrenRecursive || []);
    const isOpen = !!expanded[node.id];
    const atMaxDepth = depth >= maxDepth - 1;

    return (
      <Box key={node.id}>
        <Row
          depth={depth}
          draggable={canManage}
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropToNode(e, node.id)}
        >
          <IconButton size="small" onClick={() => toggle(node.id)} disabled={!hasChildren}>
            {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
          {editingId === node.id ? (
            <>
              <TextField size="small" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
              <IconButton size="small" onClick={() => saveEdit(node.id)}><Save fontSize="small" /></IconButton>
              <IconButton size="small" onClick={cancelEdit}><Close fontSize="small" /></IconButton>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ minWidth: 200 }}>{node.name}</Typography>
              {canManage && (
                <>
                  <IconButton size="small" onClick={() => startEdit(node.id, node.name)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => remove(node.id)}><Delete fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => startAdd(node.id)} disabled={atMaxDepth}><Add fontSize="small" /></IconButton>
                </>
              )}
            </>
          )}
        </Row>
        {isOpen && children.map(child => renderNode(child, depth + 1))}
        {(addingFor === node.id) && (
          <Row depth={depth + 1}>
            <TextField size="small" placeholder="New category" value={addingName} onChange={(e) => setAddingName(e.target.value)} />
            <IconButton size="small" onClick={() => saveAdd(node.id)} disabled={!addingName.trim()}><Save fontSize="small" /></IconButton>
            <IconButton size="small" onClick={cancelAdd}><Close fontSize="small" /></IconButton>
          </Row>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Client Hierarchy</Typography>
        {canManage && (
          <Button startIcon={<Add />} onClick={() => startAdd('root')}>Add Root</Button>
        )}
      </Box>
      {canManage && (
        <Box
          sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 1, textAlign: 'center', mb: 1 }}
          onDragOver={handleDragOver}
          onDrop={handleDropToRoot}
        >
          <Typography variant="caption" color="text.secondary">Drop here to move to root</Typography>
        </Box>
      )}
      {addingFor === 'root' && canManage && (
        <Row depth={0}>
          <TextField size="small" placeholder="New root category" value={addingName} onChange={(e) => setAddingName(e.target.value)} />
          <IconButton size="small" onClick={() => saveAdd('root')} disabled={!addingName.trim()}><Save fontSize="small" /></IconButton>
          <IconButton size="small" onClick={cancelAdd}><Close fontSize="small" /></IconButton>
        </Row>
      )}
      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : (
        <Box>
          {tree.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No categories.</Typography>
          ) : (
            tree.map(n => (
              <Box key={n.id}>
                {renderNode(n, 0)}
                {(addingFor === null) && null}
              </Box>
            ))
          )}
        </Box>
      )}
      {addingFor === null && canManage && (
        <Box mt={1}>
          {/* Root adder inline under list */}
        </Box>
      )}
      {(addingFor === null) && false}
      {(addingFor === null) && false}
      {addingFor === null && false}
      {/* Root adder at top */}
      {addingFor === null && false}
      {addingFor === null && false}
      {addingFor === null && false}
      {addingFor === null && false}
      {addingFor === null && false}
      {(addingFor === null) && false}
      {(addingFor === null) && false}
    </Box>
  );
}
