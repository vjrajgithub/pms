import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Grid,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Assignment, Person, Schedule, Delete as DeleteIcon, InsertDriveFile, Edit as EditIcon } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { MentionsInput, Mention } from 'react-mentions';
import { useAuth } from '../contexts/AuthContext';

// Stable, top-level recursive component to avoid remounts on parent re-render
const CommentNode = React.memo(({
  node,
  depth,
  expandedReplies,
  toggleReplies,
  replyOpen,
  onToggleReplyOpen,
  replyInputs,
  setReplyText,
  addReplyFiles,
  removeReplyFile,
  submitReply,
  deleteComment,
  renderWithMentions,
  storageUrl,
  mentionSuggestions,
  savingComment,
  currentUserId,
  editOpen,
  onToggleEditOpen,
  editInputs,
  setEditText,
  submitEdit,
  editAddedFiles,
  editRemovedPaths,
  addEditFiles,
  removeEditAddedFile,
  toggleRemoveExisting,
}) => {
  const replies = Array.isArray(node.replies) ? node.replies : [];
  const showAll = !!expandedReplies[node.id];
  const initialVisible = 2;
  const visibleReplies = showAll ? replies : replies.slice(0, initialVisible);
  const ownerId = (node && (node.user?.id ?? node.user_id));
  const isOwner = currentUserId != null && Number(ownerId) === Number(currentUserId);
  const canDeleteNow = (() => {
    try {
      if (!node.created_at) return false;
      const created = new Date(node.created_at).getTime();
      return isOwner && (Date.now() - created) < 60 * 1000;
    } catch (_e) { return false; }
  })();

  return (
    <Box sx={{ py: 1.5, pl: depth ? 5 : 0 }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box display="flex" alignItems="flex-start" gap={1.5}>
          <Avatar 
            src={node.user?.avatar}
            sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
          >
            {!node.user?.avatar && (node.user?.first_name?.[0] || '?')}
          </Avatar>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2">{node.user?.first_name} {node.user?.last_name}</Typography>
              {node.created_at && (
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(node.created_at), { addSuffix: true })}
                </Typography>
              )}
            </Box>
            {editOpen?.[node.id] ? (
              <Box display="flex" flexDirection="column" gap={1} mt={0.5}>
                <MentionsInput
                  value={editInputs[node.id] || ''}
                  onChange={(e, v) => setEditText(node.id, v || e.target.value)}
                  placeholder="Edit your comment..."
                  style={{ minHeight: 44, border: '1px solid #e0e0e0', borderRadius: 4, padding: 8 }}
                >
                  <Mention trigger="@" data={mentionSuggestions} markup="@[__display__](__id__)" />
                </MentionsInput>
                {Array.isArray(node.attachment_paths) && node.attachment_paths.length > 0 && (
                  <Box mt={1} display="flex" gap={1.5} flexWrap="wrap">
                    {(node.attachment_paths || []).map((p, idx) => {
                      const url = storageUrl(p);
                      const isImg = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p || '');
                      const fileName = (p || '').split('/').pop();
                      const marked = (editRemovedPaths?.[node.id] || []).includes(p);
                      return (
                        <Box key={idx} sx={{ width: 140 }}>
                          {isImg ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                              <img src={url} alt={fileName || `Attachment ${idx + 1}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4, border: marked ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.1)' }} />
                            </a>
                          ) : (
                            <Button size="small" component="a" href={url} target="_blank" rel="noopener noreferrer" fullWidth sx={{ justifyContent: 'flex-start' }} startIcon={<InsertDriveFile fontSize="small" />}>
                              {fileName || `Attachment ${idx + 1}`}
                            </Button>
                          )}
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" noWrap title={fileName || undefined}>
                              {fileName || `Attachment ${idx + 1}`}
                            </Typography>
                            <Button size="small" color={marked ? 'inherit' : 'error'} onClick={() => toggleRemoveExisting(node.id, p)} sx={{ minWidth: 0, ml: 1 }}>
                              {marked ? 'Undo' : 'Remove'}
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
                <Box
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); addEditFiles(node.id, e.dataTransfer.files); }}
                  sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 1.5, textAlign: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">Drag & drop files to add, or click Browse</Typography>
                  <input
                    id={`edit-files-${node.id}`}
                    type="file"
                    multiple
                    onChange={(e) => addEditFiles(node.id, e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById(`edit-files-${node.id}`)?.click()}>Browse</Button>
                  {(editAddedFiles?.[node.id] || []).length > 0 && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                      {(editAddedFiles?.[node.id] || []).map((f, idx) => (
                        <Box key={idx} sx={{ width: 70, height: 70, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', position: 'relative' }}>
                          {f.type && f.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <Typography variant="caption" textAlign="center">{f.name}</Typography>
                            </Box>
                          )}
                          <Button size="small" color="error" onClick={() => removeEditAddedFile(node.id, idx)} sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.25 }}>x</Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box display="flex" gap={1}>
                  <Button size="small" variant="contained" onClick={() => submitEdit(node.id)}
                    disabled={
                      savingComment || (
                        !((editInputs[node.id] ?? '').trim()) &&
                        !((editAddedFiles?.[node.id] || []).length > 0 || (editRemovedPaths?.[node.id] || []).length > 0)
                      )
                    }
                  >Save</Button>
                  <Button size="small" onClick={() => onToggleEditOpen(node.id)}>Cancel</Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">{renderWithMentions(node.comment)}</Typography>
            )}

            {!editOpen?.[node.id] && Array.isArray(node.attachment_paths) && node.attachment_paths.length > 0 && (
              <Box mt={1} display="flex" gap={1.5} flexWrap="wrap">
                {node.attachment_paths.map((p, idx) => {
                  const url = storageUrl(p);
                  const isImg = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p || '');
                  const fileName = (p || '').split('/').pop();
                  return (
                    <Box key={idx} sx={{ width: 120 }}>
                      {isImg ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                          <img src={url} alt={fileName || `Attachment ${idx + 1}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(0,0,0,0.1)' }} />
                        </a>
                      ) : (
                        <Button size="small" component="a" href={url} target="_blank" rel="noopener noreferrer" fullWidth sx={{ justifyContent: 'flex-start' }} startIcon={<InsertDriveFile fontSize="small" />}>
                          {fileName || `Attachment ${idx + 1}`}
                        </Button>
                      )}
                      <Typography variant="caption" color="text.secondary" noWrap title={fileName || undefined}>
                        {fileName || `Attachment ${idx + 1}`}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Button size="small" onClick={() => onToggleReplyOpen(node.id)}>Reply</Button>
              {replies.length > initialVisible && (
                <Button size="small" onClick={() => toggleReplies(node.id)}>
                  {showAll ? 'Hide replies' : `View more replies (${replies.length - initialVisible})`}
                </Button>
              )}
              <Button
                size="small"
                startIcon={<EditIcon fontSize="small" />}
                onClick={() => onToggleEditOpen(node.id, node.comment)}
                disabled={!isOwner}
                title={isOwner ? 'Edit' : 'You can only edit your own comment'}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() => deleteComment(node.id)}
                disabled={!isOwner || !canDeleteNow}
                title={!isOwner ? 'You can only delete your own comment' : (!canDeleteNow ? 'Delete allowed only within 1 minute' : 'Delete')}
              >
                Delete
              </Button>
            </Box>

            {replyOpen[node.id] && (
              <Box mt={1} display="flex" flexDirection="column" gap={1}>
                <MentionsInput
                  value={replyInputs[node.id]?.text || ''}
                  onChange={(e, v) => setReplyText(node.id, v || e.target.value)}
                  placeholder="Write a reply..."
                  style={{ minHeight: 44, border: '1px solid #e0e0e0', borderRadius: 4, padding: 8 }}
                >
                  <Mention trigger="@" data={mentionSuggestions} markup="@[__display__](__id__)" />
                </MentionsInput>
                <Box
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); addReplyFiles(node.id, e.dataTransfer.files); }}
                  sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 1.5, textAlign: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">Drag & drop files here, or click to select</Typography>
                  <input
                    id={`reply-files-${node.id}`}
                    type="file"
                    multiple
                    onChange={(e) => addReplyFiles(node.id, e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById(`reply-files-${node.id}`)?.click()}>Browse</Button>
                  {(replyInputs[node.id]?.files || []).length > 0 && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                      {(replyInputs[node.id]?.files || []).map((f, idx) => (
                        <Box key={idx} sx={{ width: 70, height: 70, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', position: 'relative' }}>
                          {f.type && f.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <Typography variant="caption" textAlign="center">{f.name}</Typography>
                            </Box>
                          )}
                          <Button size="small" color="error" onClick={() => removeReplyFile(node.id, idx)} sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.25 }}>x</Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Button size="small" variant="contained" onClick={() => submitReply(node.id)} disabled={savingComment || !(replyInputs[node.id]?.text || '').trim()}>
                    Post Reply
                  </Button>
                </Box>
              </Box>
            )}

            {visibleReplies.length > 0 && (
              <Box mt={1}>
                {visibleReplies.map((child) => (
                  <CommentNode
                    key={child.id}
                    node={child}
                    depth={(depth || 0) + 1}
                    expandedReplies={expandedReplies}
                    toggleReplies={toggleReplies}
                    replyOpen={replyOpen}
                    onToggleReplyOpen={onToggleReplyOpen}
                    replyInputs={replyInputs}
                    setReplyText={setReplyText}
                    addReplyFiles={addReplyFiles}
                    removeReplyFile={removeReplyFile}
                    submitReply={submitReply}
                    deleteComment={deleteComment}
                    renderWithMentions={renderWithMentions}
                    storageUrl={storageUrl}
                    mentionSuggestions={mentionSuggestions}
                    savingComment={savingComment}
                    currentUserId={currentUserId}
                    editOpen={editOpen}
                    onToggleEditOpen={onToggleEditOpen}
                    editInputs={editInputs}
                    setEditText={setEditText}
                    submitEdit={submitEdit}
                    editAddedFiles={editAddedFiles}
                    editRemovedPaths={editRemovedPaths}
                    addEditFiles={addEditFiles}
                    removeEditAddedFile={removeEditAddedFile}
                    toggleRemoveExisting={toggleRemoveExisting}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id ?? user?.data?.id ?? user?.user?.id;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [replyOpen, setReplyOpen] = useState({});
  const [replyInputs, setReplyInputs] = useState({}); // { [commentId]: { text: string, files: File[] } }
  const [editOpen, setEditOpen] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [editAddedFiles, setEditAddedFiles] = useState({}); // { [commentId]: File[] }
  const [editRemovedPaths, setEditRemovedPaths] = useState({}); // { [commentId]: string[] }
  const [mentionUsers, setMentionUsers] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState({});

  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [projectTeams, setProjectTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const storageUrl = (p) => {
    const backend = (axios.defaults.baseURL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
    const clean = (p || '').replace(/^\/+/, '');
    return `${backend}/storage/${clean}`;
  };

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const u = await axios.get('/api/users', { params: { per_page: 200 }, headers: authHeaders() });
        setMentionUsers(u.data?.data || u.data || []);
      } catch (e) {
        setMentionUsers([]);
      }
    };
    loadUsers();
  }, []);

  const mentionSuggestions = useCallback((query, callback) => {
    const q = (query || '').toLowerCase();
    const data = (mentionUsers || [])
      .map(u => ({ id: u.id, display: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email }))
      .filter(u => u.display.toLowerCase().includes(q))
      .slice(0, 10);
    callback(data);
  }, [mentionUsers]);

  const parseMentionParts = (text) => {
    const src = text || '';
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    let last = 0; const parts = []; let m;
    while ((m = regex.exec(src)) !== null) {
      if (m.index > last) parts.push({ type: 'text', text: src.slice(last, m.index) });
      parts.push({ type: 'mention', display: m[1], id: m[2] });
      last = regex.lastIndex;
    }
    if (src.length > last) parts.push({ type: 'text', text: src.slice(last) });
    return parts;
  };

  const renderWithMentions = useCallback((text) => {
    const parts = parseMentionParts(text);
    return parts.map((p, i) => {
      if (p.type === 'mention') return <span key={`m-${i}`} style={{ color: '#1976d2', fontWeight: 500 }}>@{p.display}</span>;
      const lines = (p.text || '').split('\n');
      return lines.map((line, j) => j === 0 ? <span key={`t-${i}-${j}`}>{line}</span> : [<br key={`br-${i}-${j}`} />, line]);
    });
  }, []);

  const toggleReplies = useCallback((id) => setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] })), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`/api/tasks/${id}` , { headers: authHeaders() });
        setTask(resp.data);
        // Load comments
        try {
          const c = await axios.get(`/api/tasks/${id}/comments`, { headers: authHeaders() });
          setComments(c.data || []);
        } catch (e) {
          setComments([]);
        }
        setError(null);
      } catch (e) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const refreshComments = useCallback(async () => {
    try {
      const c = await axios.get(`/api/tasks/${id}/comments`, { headers: authHeaders() });
      setComments(c.data || []);
    } catch (e) {
      // ignore
    }
  }, [id]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSavingComment(true);
      await axios.post(`/api/tasks/${id}/comments`, { comment: newComment }, { headers: authHeaders() });
      setNewComment('');
      await refreshComments();
      setToast({ open: true, severity: 'success', message: 'Comment posted' });
    } catch (e) {
      setToast({ open: true, severity: 'error', message: 'Failed to post comment' });
    } finally {
      setSavingComment(false);
    }
  };

  const addCommentWithFiles = async () => {
    try {
      setSavingComment(true);
      const form = new FormData();
      if (newComment.trim()) form.append('comment', newComment);
      if (uploadFiles && uploadFiles.length > 0) {
        uploadFiles.forEach(f => form.append('attachments[]', f));
      }
      await axios.post(`/api/tasks/${id}/comments`, form, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      setNewComment('');
      setUploadFiles([]);
      await refreshComments();
      setToast({ open: true, severity: 'success', message: 'Comment posted' });
    } catch (e) {
      setToast({ open: true, severity: 'error', message: 'Failed to post comment' });
    } finally {
      setSavingComment(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, { headers: authHeaders() });
      const removeFromTree = (nodes, targetId) => {
        return (nodes || []).reduce((acc, n) => {
          if (n.id === targetId) {
            return acc;
          }
          const newNode = { ...n };
          if (Array.isArray(n.replies) && n.replies.length) {
            newNode.replies = removeFromTree(n.replies, targetId);
          }
          acc.push(newNode);
          return acc;
        }, []);
      };
      setComments(prev => removeFromTree(prev, commentId));
      setToast({ open: true, severity: 'success', message: 'Comment deleted' });
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to delete comment';
      setToast({ open: true, severity: 'error', message: msg });
    }
  };

  const setReplyText = useCallback((commentId, text) => {
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: { ...(prev[commentId] || { files: [] }), text }
    }));
  }, []);

  const addReplyFiles = useCallback((commentId, files) => {
    const list = Array.from(files || []);
    setReplyInputs(prev => {
      const cur = prev[commentId] || { text: '', files: [] };
      return { ...prev, [commentId]: { ...cur, files: [...(cur.files || []), ...list] } };
    });
  }, []);

  const removeReplyFile = useCallback((commentId, index) => {
    setReplyInputs(prev => {
      const cur = prev[commentId] || { text: '', files: [] };
      const files = (cur.files || []).filter((_, i) => i !== index);
      return { ...prev, [commentId]: { ...cur, files } };
    });
  }, []);

  // Edit attachments handlers
  const addEditFiles = useCallback((commentId, files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setEditAddedFiles(prev => {
      const cur = prev[commentId] || [];
      return { ...prev, [commentId]: [...cur, ...list] };
    });
  }, []);

  const removeEditAddedFile = useCallback((commentId, index) => {
    setEditAddedFiles(prev => {
      const cur = prev[commentId] || [];
      const next = cur.filter((_, i) => i !== index);
      return { ...prev, [commentId]: next };
    });
  }, []);

  const toggleRemoveExisting = useCallback((commentId, path) => {
    setEditRemovedPaths(prev => {
      const cur = prev[commentId] || [];
      const exists = cur.includes(path);
      const next = exists ? cur.filter(p => p !== path) : [...cur, path];
      return { ...prev, [commentId]: next };
    });
  }, []);

  const submitReply = useCallback(async (parentId) => {
    const data = replyInputs[parentId] || {};
    if (!data.text || !data.text.trim()) return;
    try {
      setSavingComment(true);
      const form = new FormData();
      form.append('comment', data.text);
      form.append('parent_id', parentId);
      (data.files || []).forEach(f => form.append('attachments[]', f));
      await axios.post(`/api/tasks/${id}/comments`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      // clear reply state
      setReplyInputs(prev => { const { [parentId]: _omit, ...rest } = prev; return rest; });
      setReplyOpen(prev => ({ ...prev, [parentId]: false }));
      await refreshComments();
    } catch (e) {
      // ignore
    } finally {
      setSavingComment(false);
    }
  }, [id, refreshComments, replyInputs]);

  // Edit handlers
  const setEditText = useCallback((commentId, text) => {
    setEditInputs(prev => ({
      ...prev,
      [commentId]: text
    }));
  }, []);

  const onToggleEditOpen = useCallback((commentId, initialText) => {
    setEditOpen(prev => {
      const isOpen = !!prev[commentId];
      const next = { ...prev, [commentId]: !isOpen };
      // When closing, clear transient edit state
      if (isOpen) {
        setEditInputs(prevInputs => { const { [commentId]: _omit, ...rest } = prevInputs; return rest; });
        setEditAddedFiles(prevFiles => { const { [commentId]: _omit, ...rest } = prevFiles; return rest; });
        setEditRemovedPaths(prevPaths => { const { [commentId]: _omit, ...rest } = prevPaths; return rest; });
      }
      return next;
    });
    // When opening and no existing buffer, seed with current text
    setEditInputs(prev => (prev[commentId] == null && initialText != null)
      ? { ...prev, [commentId]: initialText }
      : prev);
  }, []);

  const submitEdit = useCallback(async (commentId) => {
    const text = editInputs[commentId];
    const removed = editRemovedPaths[commentId] || [];
    const added = editAddedFiles[commentId] || [];
    if ((text == null || text.trim() === '') && removed.length === 0 && added.length === 0) return;
    try {
      setSavingComment(true);
      const form = new FormData();
      form.append('_method', 'PUT');
      if (text != null) form.append('comment', text);
      removed.forEach(p => form.append('remove_attachment_paths[]', p));
      added.forEach(f => form.append('attachments[]', f));
      await axios.post(`/api/comments/${commentId}`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      setEditOpen(prev => ({ ...prev, [commentId]: false }));
      setEditInputs(prev => { const { [commentId]: _omit, ...rest } = prev; return rest; });
      setEditAddedFiles(prev => { const { [commentId]: _omit, ...rest } = prev; return rest; });
      setEditRemovedPaths(prev => { const { [commentId]: _omit, ...rest } = prev; return rest; });
      await refreshComments();
      setToast({ open: true, severity: 'success', message: 'Comment updated' });
    } catch (e) {
      setToast({ open: true, severity: 'error', message: 'Failed to update comment' });
    } finally {
      setSavingComment(false);
    }
  }, [editInputs, editRemovedPaths, editAddedFiles, refreshComments]);

  const openMembersDialog = async () => {
    if (!task?.project?.id) { setMembersDialogOpen(true); return; }
    try {
      const teamsResp = await axios.get('/api/teams', { params: { project_id: task.project.id, per_page: 100 }, headers: authHeaders() });
      setProjectTeams(teamsResp.data?.data || []);
      // Preselect first team if any
      const firstId = teamsResp.data?.data?.[0]?.id || '';
      setSelectedTeamId(firstId);
      if (firstId) {
        const membersResp = await axios.get(`/api/teams/${firstId}/members`, { headers: authHeaders() });
        const normalized = (membersResp.data || []).map(m => m.user ?? m);
        setTeamMembers(normalized);
      } else {
        setTeamMembers([]);
      }
      // Load all users for add dropdown (optional filtered client-side)
      const usersResp = await axios.get('/api/users', { params: { per_page: 100 }, headers: authHeaders() });
      setAllUsers(usersResp.data?.data || []);
    } catch (e) {
      setProjectTeams([]);
      setTeamMembers([]);
      setAllUsers([]);
    }
    setMembersDialogOpen(true);
  };

  const changeSelectedTeam = async (teamId) => {
    setSelectedTeamId(teamId);
    if (!teamId) { setTeamMembers([]); return; }
    try {
      const membersResp = await axios.get(`/api/teams/${teamId}/members`, { headers: authHeaders() });
      const normalized = (membersResp.data || []).map(m => m.user ?? m);
      setTeamMembers(normalized);
    } catch (e) {
      setTeamMembers([]);
    }
  };

  const addTeamMember = async () => {
    if (!selectedTeamId || !memberToAdd) return;
    try {
      await axios.post(`/api/teams/${selectedTeamId}/add-member`, { user_id: Number(memberToAdd), role: 'member' }, { headers: authHeaders() });
      setMemberToAdd('');
      await changeSelectedTeam(selectedTeamId);
    } catch (e) {
      // ignore
    }
  };

  const removeTeamMember = async (userId) => {
    if (!selectedTeamId) return;
    try {
      await axios.delete(`/api/teams/${selectedTeamId}/remove-member/${userId}`, { headers: authHeaders() });
      setTeamMembers(prev => prev.filter(u => u.id !== userId));
    } catch (e) {
      // ignore
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'default';
      case 'review': return 'warning';
      default: return 'default';
    }
  };

  const onToggleReplyOpen = useCallback((id) => setReplyOpen(prev => ({ ...prev, [id]: !prev[id] })), []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box p={3}>
        <Typography color="error" mb={2}>{error || 'Task not found'}</Typography>
        <Button variant="outlined" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">{task.title}</Typography>
        <Button variant="outlined" onClick={() => navigate('/tasks')}>Back</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Overview</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>{task.description || 'No description'}</Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" variant="outlined" />
              </Box>
              <Box display="flex" gap={3}>
                {task.project && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Assignment fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Project: {task.project.name}</Typography>
                  </Box>
                )}
                {task.deadline && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Due: {new Date(task.deadline).toLocaleDateString()}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Comments</Typography>
              <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
                <Box>
                  <MentionsInput
                    value={newComment}
                    onChange={(e, v) => setNewComment(v || e.target.value)}
                    placeholder="Write a comment..."
                    style={{ minHeight: 60, border: '1px solid #e0e0e0', borderRadius: 4, padding: 8 }}
                  >
                    <Mention trigger="@" data={mentionSuggestions} markup="@[__display__](__id__)" />
                  </MentionsInput>
                </Box>
                <Box
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files || []); if (files.length) setUploadFiles(prev => (prev ? [...prev, ...files] : files)); }}
                  sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 2, textAlign: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">Drag & drop images here, or click to select</Typography>
                  <input
                    id="comment-files"
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById('comment-files')?.click()}>Browse</Button>
                  {uploadFiles && uploadFiles.length > 0 && (
                    <Box mt={2} display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                      {uploadFiles.map((f, idx) => (
                        <Box key={idx} sx={{ width: 80, height: 80, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', position: 'relative' }}>
                          {f.type && f.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <Typography variant="caption" textAlign="center">{f.name}</Typography>
                            </Box>
                          )}
                          <Button size="small" color="error" onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== idx))} sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}>x</Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={addCommentWithFiles} disabled={savingComment || !newComment.trim()}>
                    Post
                  </Button>
                </Box>
              </Box>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
              ) : (
                comments.map((c) => (
                  <CommentNode
                    key={c.id}
                    node={c}
                    depth={0}
                    expandedReplies={expandedReplies}
                    toggleReplies={toggleReplies}
                    replyOpen={replyOpen}
                    onToggleReplyOpen={onToggleReplyOpen}
                    replyInputs={replyInputs}
                    setReplyText={setReplyText}
                    addReplyFiles={addReplyFiles}
                    removeReplyFile={removeReplyFile}
                    submitReply={submitReply}
                    deleteComment={deleteComment}
                    renderWithMentions={renderWithMentions}
                    storageUrl={storageUrl}
                    mentionSuggestions={mentionSuggestions}
                    savingComment={savingComment}
                    currentUserId={currentUserId}
                    editOpen={editOpen}
                    onToggleEditOpen={onToggleEditOpen}
                    editInputs={editInputs}
                    setEditText={setEditText}
                    submitEdit={submitEdit}
                    editAddedFiles={editAddedFiles}
                    editRemovedPaths={editRemovedPaths}
                    addEditFiles={addEditFiles}
                    removeEditAddedFile={removeEditAddedFile}
                    toggleRemoveExisting={toggleRemoveExisting}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Assignee</Typography>
              {task.assigned_user ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar 
                    src={task.assigned_user.avatar}
                    sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
                  >
                    {!task.assigned_user.avatar && task.assigned_user.first_name?.[0]}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {task.assigned_user.first_name} {task.assigned_user.last_name}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Unassigned</Typography>
              )}
            </CardContent>
          </Card>

          {/* Manage Team Members for this Project */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Project Team</Typography>
                <Button size="small" variant="outlined" onClick={openMembersDialog}>Manage</Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Add or remove team members for teams under this task's project.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Members Dialog */}
      <Dialog open={membersDialogOpen} onClose={() => setMembersDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Project Team</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeamId}
              label="Team"
              onChange={(e) => changeSelectedTeam(e.target.value)}
            >
              <MenuItem value="">Select Team</MenuItem>
              {projectTeams.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Add Member</InputLabel>
              <Select
                value={memberToAdd}
                label="Add Member"
                onChange={(e) => setMemberToAdd(e.target.value)}
                disabled={!selectedTeamId}
              >
                {allUsers
                  .filter(u => !teamMembers.some(m => m.id === u.id))
                  .map(u => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.role?.display_name || u.role?.name})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={addTeamMember} disabled={!memberToAdd || !selectedTeamId}>Add</Button>
          </Box>

          {teamMembers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No members in this team.</Typography>
          ) : (
            teamMembers.map((m) => (
              <Box key={m.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar 
                    src={m.avatar}
                    sx={{ width: 24, height: 24, fontSize: 12 }}
                  >
                    {!m.avatar && `${m.first_name?.[0]}${m.last_name?.[0]}`}
                  </Avatar>
                  <Typography variant="body2">{m.first_name} {m.last_name}</Typography>
                </Box>
                <Button size="small" color="error" onClick={() => removeTeamMember(m.id)}>Remove</Button>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity || 'info'} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskDetail;


