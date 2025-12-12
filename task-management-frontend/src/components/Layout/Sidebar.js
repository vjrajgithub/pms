import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Group,
  Task,
  ViewKanban,
  Assessment,
  Person,
  Settings,
  Notifications,
  Category,
  Security,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
   
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
     {
      text: 'User Management',
      icon: <Person />,
      path: '/users',
      roles: ['super_admin', 'admin', 'manager', 'team_lead'],
    },
      {
      text: 'Teams',
      icon: <Group />,
      path: '/teams',
      roles: ['super_admin', 'admin', 'manager', 'team_lead'],
    },
    {
      text: 'Projects',
      icon: <Assignment />,
      path: '/projects',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
  
    
    {
      text: 'Tasks',
      icon: <Task />,
      path: '/tasks',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
    {
      text: 'Kanban Board',
      icon: <ViewKanban />,
      path: '/kanban',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
    {
      text: 'Categories',
      icon: <Category />,
      path: '/categories',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member', 'client'],
    },
    {
      text: 'Reports',
      icon: <Assessment />,
      path: '/reports',
      roles: ['super_admin', 'admin', 'manager', 'team_lead'],
    },
    {
      text: 'RBAC Management',
      icon: <Security />,
      path: '/admin/rbac',
      roles: ['super_admin'],
    },
  ];

  const bottomMenuItems = [
    {
      text: 'Notifications',
      icon: <Notifications />,
      path: '/notifications',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: '/settings',
      roles: ['super_admin', 'admin', 'manager', 'team_lead', 'team_member'],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const canAccess = (roles) => {
    if (!user?.role?.name) return false;
    return roles.includes(user.role.name);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'manager':
        return 'info';
      case 'team_lead':
        return 'primary';
      case 'team_member':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'team_lead':
        return 'Team Lead';
      case 'team_member':
        return 'Team Member';
      default:
        return 'User';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            TaskFlow
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider />
      
      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {user?.first_name} {user?.last_name}
        </Typography>
        <Chip
          label={getRoleLabel(user?.role?.name)}
          color={getRoleColor(user?.role?.name)}
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Divider />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
            No menu items available
          </Typography>
        ) : (
          menuItems.map((item) => {
            if (!canAccess(item.roles)) return null;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'white' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        )}
      </List>

      <Divider />

      {/* Bottom Navigation */}
      <List sx={{ pb: 1 }}>
        {bottomMenuItems.map((item) => {
          if (!canAccess(item.roles)) return null;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
