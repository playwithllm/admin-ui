import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  VpnKey as ApiKeyIcon,
  Assessment as RequestsIcon,
  Payment as BillingIcon,
  Person as PersonIcon,
  Feedback as FeedbackIcon,
  Group as UsersIcon,
  Timeline as UsageIcon,
  MonetizationOn as CostIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

import { Navbar } from './Navbar';

const drawerWidth = 240;

export const DashboardLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <UsersIcon />, path: '/dashboard/users' },
    { text: 'API Keys', icon: <ApiKeyIcon />, path: '/dashboard/api-keys' },
    { text: 'Requests', icon: <RequestsIcon />, path: '/dashboard/requests' },
    { text: 'Usage', icon: <UsageIcon />, path: '/dashboard/usage' },
    { text: 'Cost', icon: <CostIcon />, path: '/dashboard/cost' },
    { text: 'Billing', icon: <BillingIcon />, path: '/dashboard/billing' },
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Support', icon: <FeedbackIcon />, path: '/dashboard/support' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                px: 2.5,
                cursor: 'pointer',
                bgcolor: isActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'action.selected' : 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'inherit',
                },
                '& .MuiListItemText-primary': {
                  color: isActive ? 'primary.main' : 'inherit',
                  fontWeight: isActive ? 500 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
          <Navbar />        
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}; 
