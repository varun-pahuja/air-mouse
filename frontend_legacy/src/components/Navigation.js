import React, { useState } from 'react';
import ESP32Status from './ESP32Status';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Mouse as MouseIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/',
      color: '#00bcd4',
      description: 'View analytics'
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings',
      color: '#ff5722',
      description: 'Configure device'
    },
    { 
      text: 'About', 
      icon: <InfoIcon />, 
      path: '/about',
      color: '#4caf50',
      description: 'Project info'
    },
    { 
      text: 'Team', 
      icon: <PeopleIcon />, 
      path: '/team',
      color: '#9c27b0',
      description: 'Meet the team'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #0a0e27 0%, #151a30 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)',
          }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 50,
                height: 50,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <MouseIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                ESP32 Mouse
              </Typography>
              {/* Dynamic status in drawer */}
              <Box mt={0.5}>
                <ESP32Status />
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: item.color,
                transform: location.pathname === item.path ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.3s ease',
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(8px)',
                '&::before': {
                  transform: 'scaleY(1)',
                }
              },
              '&.Mui-selected': {
                bgcolor: `${item.color}22`,
                '&:hover': {
                  bgcolor: `${item.color}33`,
                },
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.path ? item.color : 'rgba(255, 255, 255, 0.6)',
                minWidth: 45,
                transition: 'all 0.3s ease'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              secondary={item.description}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 700 : 500,
                color: location.pathname === item.path ? item.color : 'white'
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Drawer Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          background: 'rgba(0, 188, 212, 0.05)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
          ESP32 BLE Mouse v1.0
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={0.5}>
          © 2024 Your Team
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'rgba(10, 14, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 188, 212, 0.1)',
                    transform: 'rotate(90deg)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1.5}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(-5deg)'
                  }
                }}
              >
                <MouseIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00bcd4 0%, #00e5ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  ESP32 BLE Mouse
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Motion Control Dashboard
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Desktop Navigation Buttons */}
          {!isMobile && (
            <Box display="flex" gap={1}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  startIcon={item.icon}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color: location.pathname === item.path ? item.color : 'rgba(255, 255, 255, 0.8)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: location.pathname === item.path ? '80%' : '0%',
                      height: '3px',
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: '3px 3px 0 0',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      bgcolor: `${item.color}15`,
                      color: item.color,
                      '&::before': {
                        width: '80%',
                      }
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Section - ESP32 Status */}
          <Box display="flex" alignItems="center" gap={2}>
            <ESP32Status />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: '#0a0e27',
            backgroundImage: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;