import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  VpnKey as KeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Dummy user data
const dummyUserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  apiKeys: [
    { id: 'key1', name: 'Production API Key', created: '2023-06-15', lastUsed: '2024-01-20' },
    { id: 'key2', name: 'Development API Key', created: '2023-08-20', lastUsed: '2024-01-19' },
  ],
  preferences: {
    emailNotifications: true,
    apiUsageAlerts: true,
    monthlyReports: true,
    twoFactorAuth: false,
  },
};

export const ProfilePage = () => {
  // Personal Information state
  const [profile, setProfile] = useState(dummyUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(dummyUserProfile);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');

  // API Keys state
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  // Preferences state
  const [preferences, setPreferences] = useState(dummyUserProfile.preferences);

  // Handle profile update
  const handleUpdateProfile = () => {
    // Here you would typically make an API call to update the profile
    setProfile(editedProfile);
    setIsEditing(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    // Here you would typically make an API call to change the password
    setPasswordError('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  // Handle preferences change
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle API key management
  const handleAddApiKey = () => {
    // Here you would typically make an API call to create a new API key
    setIsAddKeyDialogOpen(false);
    setNewKeyName('');
  };

  const handleDeleteApiKey = (keyId: string) => {
    // Here you would typically make an API call to delete the API key
    console.log('Delete key:', keyId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Update successful!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={isEditing ? editedProfile.name : profile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                {isEditing && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleUpdateProfile}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              {passwordError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordError}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          edge="end"
                        >
                          {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          edge="end"
                        >
                          {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                    fullWidth
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <List>
                <ListItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={() => handlePreferenceChange('emailNotifications')}
                      />
                    }
                    label="Email Notifications"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.apiUsageAlerts}
                        onChange={() => handlePreferenceChange('apiUsageAlerts')}
                      />
                    }
                    label="API Usage Alerts"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.monthlyReports}
                        onChange={() => handlePreferenceChange('monthlyReports')}
                      />
                    }
                    label="Monthly Reports"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.twoFactorAuth}
                        onChange={() => handlePreferenceChange('twoFactorAuth')}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* API Keys */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">API Keys</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddKeyDialogOpen(true)}
                >
                  Add New Key
                </Button>
              </Box>
              <List>
                {profile.apiKeys.map((key) => (
                  <ListItem key={key.id}>
                    <ListItemText
                      primary={key.name}
                      secondary={`Created: ${key.created} | Last Used: ${key.lastUsed}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteApiKey(key.id)}
                        color="error"
                      >
                        <KeyIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add API Key Dialog */}
      <Dialog
        open={isAddKeyDialogOpen}
        onClose={() => setIsAddKeyDialogOpen(false)}
      >
        <DialogTitle>Add New API Key</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Key Name"
            fullWidth
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddKeyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddApiKey} variant="contained">
            Create Key
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 
