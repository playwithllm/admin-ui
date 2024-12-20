import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as KeyIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface UserDetails {
  profile: {
    name: string;
    email: string;
    role: string;
    phone: string;
    department: string;
    joinDate: string;
  };
  apiKeys: Array<{
    id: string;
    name: string;
    created: string;
    lastUsed: string;
  }>;
  usage: {
    apiCalls: number;
    tokensUsed: number;
    lastMonthCalls: number;
    lastMonthTokens: number;
  };
  billing: {
    plan: string;
    monthlyQuota: number;
    renewalDate: string;
    paymentStatus: string;
  };
}

interface UserDetailsMap {
  [key: number]: UserDetails;
}

// Dummy data for users
const dummyUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-01-20T15:30:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2024-01-20T14:45:00Z',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'User',
    status: 'Inactive',
    lastActive: '2024-01-19T10:20:00Z',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-01-20T16:15:00Z',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '2024-01-20T13:10:00Z',
  },
];

// Dummy data for user details
const dummyUserDetails: UserDetailsMap = {
  1: {
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      phone: '+1 234 567 8900',
      department: 'Engineering',
      joinDate: '2023-01-15',
    },
    apiKeys: [
      { id: 'key1', name: 'Production API Key', created: '2023-06-15', lastUsed: '2024-01-20' },
      { id: 'key2', name: 'Development API Key', created: '2023-08-20', lastUsed: '2024-01-19' },
    ],
    usage: {
      apiCalls: 15420,
      tokensUsed: 128900,
      lastMonthCalls: 4500,
      lastMonthTokens: 35000,
    },
    billing: {
      plan: 'Enterprise',
      monthlyQuota: 100000,
      renewalDate: '2024-02-01',
      paymentStatus: 'Active',
    },
  },
  2: {
    profile: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      phone: '+1 234 567 8901',
      department: 'Marketing',
      joinDate: '2023-03-20',
    },
    apiKeys: [
      { id: 'key3', name: 'Production API Key', created: '2023-07-10', lastUsed: '2024-01-20' },
    ],
    usage: {
      apiCalls: 8750,
      tokensUsed: 65400,
      lastMonthCalls: 2800,
      lastMonthTokens: 22000,
    },
    billing: {
      plan: 'Professional',
      monthlyQuota: 50000,
      renewalDate: '2024-02-15',
      paymentStatus: 'Active',
    },
  },
};

const roleOptions = ['Admin', 'User'];
const statusOptions = ['Active', 'Inactive'];

interface EditUserData {
  name: string;
  email: string;
  role: string;
  status: string;
}

// Add interface for user type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export const UserManagementPage = () => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for user details dialog
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // State for edit user dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditUserData | null>(null);

  // State for add user dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });

  // Handle pagination changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle user actions
  const handleViewDetails = (userId: number) => {
    setSelectedUser(userId);
    setDetailsOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditData(user);
    setEditOpen(true);
  };

  const handleAddUser = () => {
    setAddOpen(true);
  };

  const handleSaveNewUser = () => {
    // Here you would typically make an API call to save the new user
    setAddOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
    });
  };

  const handleSaveEdit = () => {
    // Here you would typically make an API call to update the user
    setEditOpen(false);
    setEditData(null);
  };

  const handleDeleteUser = (userId: number) => {
    // Here you would typically show a confirmation dialog and make an API call
    console.log('Delete user:', userId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </Box>

      {/* Users Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'Admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'Active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(user.id)}
                        sx={{ mr: 1 }}
                      >
                        <PersonIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dummyUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* User Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          User Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && dummyUserDetails[selectedUser] && (
            <Grid container spacing={3}>
              {/* Profile Information */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Profile Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Role</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.role}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Department</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.department}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Phone</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Join Date</Typography>
                        <Typography>{dummyUserDetails[selectedUser].profile.joinDate}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* API Keys */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>API Keys</Typography>
                    <List>
                      {dummyUserDetails[selectedUser].apiKeys.map((key) => (
                        <ListItem key={key.id}>
                          <ListItemText
                            primary={key.name}
                            secondary={`Created: ${key.created} | Last Used: ${key.lastUsed}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small">
                              <KeyIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Usage Statistics */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Usage Statistics</Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Total API Calls"
                          secondary={dummyUserDetails[selectedUser].usage.apiCalls.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Total Tokens Used"
                          secondary={dummyUserDetails[selectedUser].usage.tokensUsed.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Last Month API Calls"
                          secondary={dummyUserDetails[selectedUser].usage.lastMonthCalls.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Last Month Tokens"
                          secondary={dummyUserDetails[selectedUser].usage.lastMonthTokens.toLocaleString()}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Billing Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Billing Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Plan"
                          secondary={dummyUserDetails[selectedUser].billing.plan}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Monthly Quota"
                          secondary={dummyUserDetails[selectedUser].billing.monthlyQuota.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Renewal Date"
                          secondary={dummyUserDetails[selectedUser].billing.renewalDate}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Payment Status"
                          secondary={
                            <Chip
                              label={dummyUserDetails[selectedUser].billing.paymentStatus}
                              color="success"
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          {editData && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Role"
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                value={newUserData.status}
                onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 
