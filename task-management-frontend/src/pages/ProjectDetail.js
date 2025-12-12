import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import { Assignment, Group, Schedule, CheckCircle, Warning, InsertDriveFile, Edit as EditIcon, Delete as DeleteIcon, ArrowBack } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import { MentionsInput, Mention } from 'react-mentions';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Reusable nested comment node (mirrors TaskDetail)
const ProjectCommentNode = React.memo(({
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
          <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
            {node.user?.first_name?.[0] || '?'}
          </Avatar>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2">{node.user?.first_name} {node.user?.last_name}</Typography>
              {node.created_at && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(node.created_at).toLocaleString()}
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
                    id={`proj-edit-files-${node.id}`}
                    type="file"
                    multiple
                    onChange={(e) => addEditFiles(node.id, e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById(`proj-edit-files-${node.id}`)?.click()}>Browse</Button>
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
                    id={`proj-reply-files-${node.id}`}
                    type="file"
                    multiple
                    onChange={(e) => addReplyFiles(node.id, e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById(`proj-reply-files-${node.id}`)?.click()}>Browse</Button>
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
                  <ProjectCommentNode
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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id ?? user?.data?.id ?? user?.user?.id;
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [replyOpen, setReplyOpen] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [editOpen, setEditOpen] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [editAddedFiles, setEditAddedFiles] = useState({});
  const [editRemovedPaths, setEditRemovedPaths] = useState({});
  const [mentionUsers, setMentionUsers] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [memberForm, setMemberForm] = useState({ user_id: '', role: 'member' });
  const [memberSaving, setMemberSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    description: '', 
    status: '', 
    priority: '',
    progress: 0,
    start_date: '',
    end_date: '',
    budget: ''
  });
  const [editSaving, setEditSaving] = useState(false);

  const sendOverdueNotification = async (projectData) => {
    try {
      const isProjectOverdue = projectData.end_date && new Date(projectData.end_date) < new Date() && projectData.status !== 'completed';
      if (!isProjectOverdue) return;

      // Check if notification was already sent today for this project
      const today = new Date().toDateString();
      const lastNotificationKey = `overdue_notif_${projectData.id}`;
      const lastNotificationDate = localStorage.getItem(lastNotificationKey);
      
      if (lastNotificationDate === today) {
        // Notification already sent today, skip
        return;
      }

      // Collect recipient IDs: manager, team lead, and all team members
      const recipientIds = new Set();
      
      // Add manager
      if (projectData.manager?.id) {
        recipientIds.add(projectData.manager.id);
      }
      
      // Add team lead
      if (projectData.team_lead?.id) {
        recipientIds.add(projectData.team_lead.id);
      }
      
      // Add all team members
      if (Array.isArray(projectData.teams)) {
        projectData.teams.forEach(team => {
          if (team.team_lead?.id) {
            recipientIds.add(team.team_lead.id);
          }
          if (Array.isArray(team.members)) {
            team.members.forEach(member => {
              if (member.id) {
                recipientIds.add(member.id);
              }
            });
          }
        });
      }

      // Send notification to each recipient
      const notificationPromises = Array.from(recipientIds).map(userId =>
        axios.post('/api/notifications', {
          user_id: userId,
          title: 'Project Overdue',
          message: `Project "${projectData.name}" has exceeded its deadline of ${new Date(projectData.end_date).toLocaleDateString()}`,
          type: 'project_overdue',
          priority: 'high',
          action_url: `/projects/${projectData.id}`,
          data: { project_id: projectData.id, project_name: projectData.name }
        }, { headers: authHeaders() }).catch(() => {})
      );

      await Promise.all(notificationPromises);
      
      // Mark notification as sent today
      localStorage.setItem(lastNotificationKey, today);
    } catch (e) {
      console.error('Failed to send overdue notifications:', e);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projResp, statsResp] = await Promise.all([
          axios.get(`/api/projects/${id}`),
          axios.get(`/api/projects/${id}/stats`).catch(() => ({ data: null })),
        ]);

        setProject(projResp.data);
        setStats(statsResp.data);

        // Send overdue notification if applicable
        await sendOverdueNotification(projResp.data);

        // Load tasks (fallback: fetch and filter client-side)
        try {
          const tasksResp = await axios.get('/api/tasks', { params: { per_page: 100 } });
          const list = Array.isArray(tasksResp.data?.data) ? tasksResp.data.data : [];
          setTasks(list.filter(t => String(t.project_id) === String(id)));
        } catch (e) {
          setTasks([]);
        }
        // Load project comments
        try {
          const c = await axios.get(`/api/projects/${id}/comments`, { headers: authHeaders() });
          setComments(c.data || []);
        } catch (e) {
          setComments([]);
        }
        setError(null);
      } catch (e) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Mentions: load users once
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

  const storageUrl = (p) => {
    const backend = (axios.defaults.baseURL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
    const clean = (p || '').replace(/^\/+/, '');
    return `${backend}/storage/${clean}`;
  };

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const refreshProjectOnly = async () => {
    try {
      const projResp = await axios.get(`/api/projects/${id}`);
      setProject(projResp.data);
    } catch (e) {}
  };

  const getAssignedTeamFromProject = (p) => {
    if (!p || !Array.isArray(p.teams) || p.teams.length === 0) return null;
    const matched = p.teams.find(t => String(t.team_lead_id) === String(p.team_lead_id));
    return matched || p.teams[0];
  };

  const handleOpenMembersDialog = async () => {
    const team = getAssignedTeamFromProject(project);
    if (!team) return;
    try {
      const resp = await axios.get('/api/users', {
        params: { per_page: 200 },
        headers: authHeaders(),
      });
      setAvailableUsers(resp.data?.data || resp.data || []);
    } catch (e) {
      setAvailableUsers([]);
    }
    setMemberForm({ user_id: '', role: 'member' });
    setMemberDialogOpen(true);
  };

  const handleAddMember = async () => {
    const team = getAssignedTeamFromProject(project);
    if (!team || !memberForm.user_id) return;
    try {
      setMemberSaving(true);
      await axios.post(`/api/teams/${team.id}/add-member`, memberForm, {
        headers: authHeaders(),
      });
      await refreshProjectOnly();
      setMemberForm({ user_id: '', role: 'member' });
      setToast({ open: true, severity: 'success', message: 'Member added' });
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to add member';
      setToast({ open: true, severity: 'error', message: msg });
    } finally {
      setMemberSaving(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    const team = getAssignedTeamFromProject(project);
    if (!team || !userId) return;
    try {
      setMemberSaving(true);
      await axios.delete(`/api/teams/${team.id}/remove-member/${userId}`, {
        headers: authHeaders(),
      });
      await refreshProjectOnly();
      setToast({ open: true, severity: 'success', message: 'Member removed' });
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to remove member';
      setToast({ open: true, severity: 'error', message: msg });
    } finally {
      setMemberSaving(false);
    }
  };

  const handleOpenEditDialog = () => {
    setEditForm({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      progress: project.progress || 0,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
      end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
      budget: project.budget || ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    try {
      setEditSaving(true);
      await axios.put(`/api/projects/${id}`, editForm, {
        headers: authHeaders(),
      });
      await refreshProjectOnly();
      setEditDialogOpen(false);
      setToast({ open: true, severity: 'success', message: 'Project updated successfully' });
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to update project';
      setToast({ open: true, severity: 'error', message: msg });
    } finally {
      setEditSaving(false);
    }
  };

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

  const refreshComments = useCallback(async () => {
    try {
      const c = await axios.get(`/api/projects/${id}/comments`, { headers: authHeaders() });
      setComments(c.data || []);
    } catch (e) {}
  }, [id]);

  const addCommentWithFiles = async () => {
    try {
      if (!newComment.trim() && (!uploadFiles || uploadFiles.length === 0)) return;
      setSavingComment(true);
      const form = new FormData();
      if (newComment.trim()) form.append('comment', newComment);
      (uploadFiles || []).forEach(f => form.append('attachments[]', f));
      await axios.post(`/api/projects/${id}/comments`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      
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

  const setReplyText = useCallback((commentId, text) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: { ...(prev[commentId] || { files: [] }), text } }));
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

  const submitReply = useCallback(async (parentId) => {
    const data = replyInputs[parentId] || {};
    if (!data.text || !data.text.trim()) return;
    try {
      setSavingComment(true);
      const form = new FormData();
      form.append('comment', data.text);
      form.append('parent_id', parentId);
      (data.files || []).forEach(f => form.append('attachments[]', f));
      await axios.post(`/api/projects/${id}/comments`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      
      setReplyInputs(prev => { const { [parentId]: _omit, ...rest } = prev; return rest; });
      setReplyOpen(prev => ({ ...prev, [parentId]: false }));
      await refreshComments();
    } catch (e) {
    } finally {
      setSavingComment(false);
    }
  }, [id, refreshComments, replyInputs]);

  const onToggleReplyOpen = useCallback((id) => setReplyOpen(prev => ({ ...prev, [id]: !prev[id] })), []);

  // Edit handlers
  const setEditText = useCallback((commentId, text) => {
    setEditInputs(prev => ({ ...prev, [commentId]: text }));
  }, []);

  const onToggleEditOpen = useCallback((commentId, initialText) => {
    setEditOpen(prev => {
      const isOpen = !!prev[commentId];
      const next = { ...prev, [commentId]: !isOpen };
      if (isOpen) {
        setEditInputs(prevInputs => { const { [commentId]: _omit, ...rest } = prevInputs; return rest; });
        setEditAddedFiles(prevFiles => { const { [commentId]: _omit, ...rest } = prevFiles; return rest; });
        setEditRemovedPaths(prevPaths => { const { [commentId]: _omit, ...rest } = prevPaths; return rest; });
      }
      return next;
    });
    setEditInputs(prev => (prev[commentId] == null && initialText != null) ? { ...prev, [commentId]: initialText } : prev);
  }, []);

  const addEditFiles = useCallback((commentId, files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setEditAddedFiles(prev => { const cur = prev[commentId] || []; return { ...prev, [commentId]: [...cur, ...list] }; });
  }, []);

  const removeEditAddedFile = useCallback((commentId, index) => {
    setEditAddedFiles(prev => { const cur = prev[commentId] || []; return { ...prev, [commentId]: cur.filter((_, i) => i !== index) }; });
  }, []);

  const toggleRemoveExisting = useCallback((commentId, path) => {
    setEditRemovedPaths(prev => {
      const cur = prev[commentId] || [];
      const exists = cur.includes(path);
      const next = exists ? cur.filter(p => p !== path) : [...cur, path];
      return { ...prev, [commentId]: next };
    });
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
      await axios.post(`/api/project-comments/${commentId}`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
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

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/project-comments/${commentId}`, { headers: authHeaders() });
      const removeFromTree = (nodes, targetId) => {
        return (nodes || []).reduce((acc, n) => {
          if (n.id === targetId) return acc;
          const newNode = { ...n };
          if (Array.isArray(n.replies) && n.replies.length) newNode.replies = removeFromTree(n.replies, targetId);
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


  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'info';
      case 'active': return 'success';
      case 'on_hold': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
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

  const calculateProgress = () => {
    // Prefer calculation from tasks so it matches the projects list
    const totalTasks =
      stats?.tasks?.total ??
      project?.tasks_count ??
      (Array.isArray(project?.tasks) ? project.tasks.length : 0);

    const completedTasks =
      stats?.tasks?.completed ??
      project?.completed_tasks_count ??
      (Array.isArray(project?.tasks)
        ? project.tasks.filter(t => t.status === 'completed').length
        : 0);

    if (totalTasks > 0) {
      return Math.round((completedTasks / totalTasks) * 100);
    }

    // Fallback to stored project progress when no tasks data is available
    if (project?.progress !== null && project?.progress !== undefined) {
      return project.progress;
    }

    return 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box p={3}>
        <Typography color="error" mb={2}>{error || 'Project not found'}</Typography>
        <Button variant="outlined" onClick={() => navigate('/projects')}>Back to Projects</Button>
      </Box>
    );
  }

  const assignedTeam = getAssignedTeamFromProject(project);

  const assignedTeamMembers = Array.isArray(assignedTeam?.members) ? assignedTeam.members : [];
  const visibleTeamMembers = assignedTeamMembers.slice(0, 5);
  const extraTeamMembers = assignedTeamMembers.length > visibleTeamMembers.length
    ? assignedTeamMembers.length - visibleTeamMembers.length
    : 0;
  const assignedTeamLead = assignedTeam?.team_lead || project.team_lead;
  const isManagerUser = !!(user && (typeof user.isManager === 'function' ? user.isManager() : user.role?.name === 'manager'));
  const isAssignedTeamLead = !!(assignedTeam && String(currentUserId) === String(assignedTeam.team_lead_id));
  const canManageAssignedTeam = !!(assignedTeam && (isManagerUser || isAssignedTeamLead));
  const showManageButton = !!assignedTeam;

  return (
    <Box sx={{ p: 3 }}>
      {(() => {
        const isProjectOverdue = project.end_date && new Date(project.end_date) < new Date() && project.status !== 'completed';
        return (
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} sx={{
            bgcolor: isProjectOverdue ? 'error.lighter' : 'transparent',
            borderLeft: isProjectOverdue ? '4px solid' : 'none',
            borderLeftColor: isProjectOverdue ? 'error.main' : 'transparent',
            pl: isProjectOverdue ? 2 : 0,
            pr: 2,
            py: 1.5,
            borderRadius: 1,
          }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1, minWidth: 0 }}>
              <IconButton onClick={() => navigate('/projects')} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{ minWidth: 0 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h4" fontWeight={isProjectOverdue ? 700 : 'bold'} noWrap sx={{ color: isProjectOverdue ? 'error.main' : 'inherit' }}>
                    {project.name}
                  </Typography>
                  {isProjectOverdue && (
                    <Chip label="PROJECT OVERDUE" size="small" color="error" variant="filled" sx={{ height: 24 }} />
                  )}
                </Box>
                <Box display="flex" flexWrap="wrap" gap={2} mt={0.5}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" color="text.secondary">Manager:</Typography>
                    <Typography variant="body2">
                      {project.manager?.full_name
                        || `${project.manager?.first_name || ''} ${project.manager?.last_name || ''}`.trim()
                        || 'Not assigned'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" color={isProjectOverdue ? 'error.main' : 'text.secondary'} sx={{ fontWeight: isProjectOverdue ? 600 : 400 }}>Deadline:</Typography>
                    <Typography variant="body2" sx={{ color: isProjectOverdue ? 'error.main' : 'inherit', fontWeight: isProjectOverdue ? 600 : 400 }}>
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString()
                        : 'No deadline'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ ml: 2 }}>
              <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
              <Chip label={project.priority} color={getPriorityColor(project.priority)} size="small" variant="outlined" />
            </Box>
          </Box>
        );
      })()}

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Project Details */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Project Details
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Chip 
                    label={project.status.toUpperCase()} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                  <Button size="small" variant="outlined" onClick={handleOpenEditDialog}>
                    Edit
                  </Button>
                </Box>
              </Box>
              
              <Typography variant="body1" color="text.secondary" mb={2}>
                {project.description || 'No description available'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {calculateProgress()}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress()} 
                  sx={{ height: 10, borderRadius: 4 }}
                />
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
                    id="project-comment-files"
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                    style={{ display: 'none' }}
                  />
                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => document.getElementById('project-comment-files')?.click()}>Browse</Button>
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
                  <Button variant="contained" onClick={addCommentWithFiles} disabled={savingComment || (!newComment.trim() && (!uploadFiles || uploadFiles.length === 0))}>
                    Post
                  </Button>
                </Box>
              </Box>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
              ) : (
                comments.map((c) => (
                  <ProjectCommentNode
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

        {/* Right Column - Statistics */}
        <Grid item xs={12} md={4}>
          {/* Assigned Team */}
          {assignedTeam && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ pb: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Team
                  </Typography>
                  <Button size="small" onClick={handleOpenMembersDialog} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                    Manage
                  </Button>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                    {assignedTeam.name?.[0] || 'T'}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="500" noWrap>
                      {assignedTeam.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      Lead: {assignedTeamLead?.first_name} {assignedTeamLead?.last_name}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
                  Members ({assignedTeamMembers.length})
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {assignedTeamMembers.slice(0, 5).map((member) => (
                    <Tooltip key={member.id} title={`${member.first_name} ${member.last_name}`}>
                      <Avatar 
                        src={member.avatar}
                        sx={{ width: 24, height: 24, fontSize: '0.65rem', cursor: 'pointer' }}
                      >
                        {!member.avatar && (member.first_name?.[0] || member.last_name?.[0] || member.email?.[0] || '?')}
                      </Avatar>
                    </Tooltip>
                  ))}
                  {assignedTeamMembers.length > 5 && (
                    <Tooltip title={`+${assignedTeamMembers.length - 5} more`}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: 'action.hover' }}>
                        +{assignedTeamMembers.length - 5}
                      </Avatar>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Assignment color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.total_tasks || project?.tasks_count || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <CheckCircle color="success" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.completed_tasks || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Group color="info" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.total_teams || project?.teams_count || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Teams
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      {calculateProgress()}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Schedule color="warning" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.pending_tasks || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Warning color="error" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.overdue_tasks || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Overdue
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Related Tasks */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Related Tasks</Typography>
                <Button size="small" onClick={() => navigate('/tasks')}>View All Tasks</Button>
              </Box>
              <List>
                {tasks.map((task, idx) => {
                  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
                  return (
                    <React.Fragment key={task.id}>
                      <ListItem sx={{ 
                        bgcolor: isOverdue ? 'error.lighter' : 'transparent',
                        borderLeft: isOverdue ? '4px solid' : 'none',
                        borderLeftColor: isOverdue ? 'error.main' : 'transparent',
                        pl: isOverdue ? 1.5 : 2,
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: task.status === 'completed' ? 'success.main' : (task.priority === 'urgent' ? 'error.main' : 'info.main') }}>
                            {task.status === 'completed' ? <CheckCircle /> : (task.priority === 'urgent' ? <Warning /> : <Schedule />)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" fontWeight={isOverdue ? 600 : 500}>
                                {task.title || task.name}
                              </Typography>
                              {isOverdue && (
                                <Chip label="Overdue" size="small" color="error" variant="filled" sx={{ height: 20 }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <Chip label={task.status} size="small" />
                              <Chip label={task.priority} size="small" variant="outlined" />
                              {task.deadline && (
                                <Typography variant="caption" sx={{ color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: isOverdue ? 600 : 400 }}>
                                  Due: {new Date(task.deadline).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                      {idx < tasks.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
                {tasks.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No tasks found for this project.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={memberDialogOpen} onClose={() => setMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Team Members</DialogTitle>
        <DialogContent>
          {assignedTeam ? (
            <Box>
              {canManageAssignedTeam && (
                <Box mb={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>User</InputLabel>
                    <Select
                      label="User"
                      value={memberForm.user_id}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, user_id: e.target.value }))}
                    >
                      {availableUsers.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {(u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim()) || u.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <MenuItem value="member">Member</MenuItem>
                      <MenuItem value="lead">Lead</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: canManageAssignedTeam ? 1 : 0, mb: 1 }}>
                Current Members
              </Typography>
              <List dense sx={{ py: 0 }}>
                {assignedTeamMembers.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No team members assigned.
                  </Typography>
                )}
                {assignedTeamMembers.map((member) => (
                  <ListItem key={member.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar 
                        src={member.avatar}
                        sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                      >
                        {!member.avatar && (member.first_name?.[0] || member.last_name?.[0] || member.email?.[0] || '?')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}
                      secondary={
                        (member.pivot?.role || member.pivot?.status) ? (
                          <Box display="flex" gap={1}>
                            {member.pivot?.role && (
                              <Typography variant="caption" color="text.secondary">
                                {member.pivot.role}
                              </Typography>
                            )}
                            {member.pivot?.status && (
                              <Typography variant="caption" color="text.secondary">
                                {member.pivot.status}
                              </Typography>
                            )}
                          </Box>
                        ) : null
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                    {canManageAssignedTeam && member.id !== assignedTeam.team_lead_id && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={memberSaving}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No team is assigned to this project.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Close</Button>
          {canManageAssignedTeam && (
            <Button
              onClick={handleAddMember}
              variant="contained"
              disabled={memberSaving || !memberForm.user_id}
            >
              Add Member
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Project Name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />

          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={editForm.start_date}
                onChange={(e) => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={editForm.end_date}
                onChange={(e) => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Budget"
            type="number"
            value={editForm.budget}
            onChange={(e) => setEditForm(prev => ({ ...prev, budget: e.target.value }))}
            margin="normal"
            inputProps={{ step: '0.01', min: '0' }}
          />

          <Box mt={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {editForm.progress}%
              </Typography>
            </Box>
            <input
              type="range"
              min="0"
              max="100"
              value={editForm.progress}
              onChange={(e) => setEditForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
              style={{ width: '100%', height: 6, borderRadius: 3, cursor: 'pointer' }}
            />
            <Box display="flex" gap={1} mt={1} justifyContent="space-between">
              <Button size="small" variant="text" onClick={() => setEditForm(prev => ({ ...prev, progress: 0 }))}>0%</Button>
              <Button size="small" variant="text" onClick={() => setEditForm(prev => ({ ...prev, progress: 25 }))}>25%</Button>
              <Button size="small" variant="text" onClick={() => setEditForm(prev => ({ ...prev, progress: 50 }))}>50%</Button>
              <Button size="small" variant="text" onClick={() => setEditForm(prev => ({ ...prev, progress: 75 }))}>75%</Button>
              <Button size="small" variant="text" onClick={() => setEditForm(prev => ({ ...prev, progress: 100 }))}>100%</Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProject} variant="contained" disabled={editSaving || !editForm.name.trim()}>
            {editSaving ? 'Saving...' : 'Save'}
          </Button>
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

export default ProjectDetail;


