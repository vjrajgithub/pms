import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Chip,
} from '@mui/material';
import {
  Notifications,
  Close,
  CheckCircle,
  Assignment,
  Group,
  Person,
  Schedule,
  OpenInNew,
} from '@mui/icons-material';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationDropdown = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned':
      case 'task_updated':
        return <Assignment color="primary" />;
      case 'team_added':
      case 'team_updated':
        return <Group color="success" />;
      case 'project_comment':
        return <Assignment color="info" />;
      case 'project_overdue':
        return <Schedule color="error" />;
      case 'deadline_reminder':
        return <Schedule color="warning" />;
      default:
        return <Notifications color="info" />;
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate to the action URL if available
    if (notification.action_url) {
      onClose();
      navigate(notification.action_url);
    }
  };

  const handleRemoveNotification = (notificationId, event) => {
    event.stopPropagation();
    removeNotification(notificationId);
  };

  const handleNavigateToNotification = (notification, event) => {
    event.stopPropagation();
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      onClose();
      navigate(notification.action_url);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const recentNotifications = notifications.slice(0, 10);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          overflow: 'hidden',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          <Badge badgeContent={unreadNotifications.length} color="error">
            <Notifications />
          </Badge>
        </Box>
        {unreadNotifications.length > 0 && (
          <Button
            size="small"
            onClick={markAllAsRead}
            sx={{ mt: 1 }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {recentNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {recentNotifications.map((notification, index) => (
              <React.Fragment key={`${notification.id}-${index}`}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.is_read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    borderLeft: notification.is_read ? 'none' : '4px solid',
                    borderLeftColor: notification.is_read ? 'transparent' : 'primary.main',
                    pl: notification.is_read ? 2 : 1.5,
                    '&:hover': {
                      bgcolor: notification.is_read ? 'action.hover' : 'rgba(25, 118, 210, 0.12)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.is_read ? 'grey.300' : 'primary.main',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.is_read ? 400 : 600,
                            flex: 1,
                            color: notification.is_read ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {notification.is_read && (
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                        )}
                        <Chip
                          label={notification.priority}
                          size="small"
                          color={getNotificationColor(notification.priority)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(notification.created_at)}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  
                  <ListItemSecondaryAction>
                    {notification.action_url && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleNavigateToNotification(notification, e)}
                        title="Open"
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleRemoveNotification(notification.id, e)}
                      title="Delete"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < recentNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      {notifications.length > 10 && (
        <>
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button
              size="small"
              onClick={() => {
                onClose();
                // Navigate to notifications page
                window.location.href = '/notifications';
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </>
      )}
    </Menu>
  );
};

export default NotificationDropdown;
