// src/components/ApiKeyManager.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Chip,
  TableContainer,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Refresh, Delete, ContentCopy, Add } from '@mui/icons-material';
import axiosInstance from '../utils/api';

export interface ApiKey {
  _id: string;
  createdAt: string;
  name: string;
  keyPrefix: string;
  status: string;
  usage: {
    requests: number,
    tokens: number,
    cost: number,
  },
}

export const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState<string>('');
  const [newlyCreatedApiKey, setNewlyCreatedApiKey] = useState<ApiKey>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [openRevokeDialog, setOpenRevokeDialog] = useState<boolean>(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [newApiKeyName, setNewApiKeyName] = useState<string>('');
  const [openGenerateDialog, setOpenGenerateDialog] = useState<boolean>(false);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/v1/api-keys/search');
      console.log('API keys:', response.data);
      setApiKeys(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch API keys.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGenerateDialog = () => {
    setOpenGenerateDialog(true);
  };

  const handleCloseGenerateDialog = () => {
    setOpenGenerateDialog(false);
    setNewApiKeyName('');
  };

  const handleGenerateApiKey = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/api-keys/create', { name: newApiKeyName });
      console.log('API Key:', response);
      setNewlyCreatedApiKey(response.data);
      setNewApiKey(response.data.apiKey);
      setSuccess('API Key generated successfully!');
      fetchApiKeys();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate API key.');
    } finally {
      setLoading(false);
      handleCloseGenerateDialog();
    }
  };

  const handleRevokeApiKey = (keyId: string) => {
    setSelectedKeyId(keyId);
    setOpenRevokeDialog(true);
  };

  const confirmRevokeApiKey = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/v1/api-keys/revoke/${selectedKeyId}`);
      setSuccess('API Key revoked successfully!');
      fetchApiKeys();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke API key.');
    } finally {
      setLoading(false);
      setOpenRevokeDialog(false);
      setSelectedKeyId('');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
    setCopySuccess(false);
  };

  const handleCopyApiKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey)
        .then(() => setCopySuccess(true))
        .catch(() => setError('Failed to copy API key.'));
    }
  };

  const handleDismissNewApiKey = () => {
    setNewApiKey('');
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ margin: '0 auto', padding: 4 }}>
              <Typography variant="h4" gutterBottom>
                API Key Management
              </Typography>

              <Box sx={{ marginBottom: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenGenerateDialog}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                >
                  Generate New API Key
                </Button>
                {newApiKey && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Newly Created API Key</Typography>
                    <Box sx={{ padding: 2, backgroundColor: '#e0f7fa', borderRadius: 2, marginTop: 1 }}>
                      <Typography variant="subtitle1"><strong>Name:</strong> {newlyCreatedApiKey?.name}</Typography>
                      <Typography variant="subtitle1"><strong>Key Prefix:</strong> {newlyCreatedApiKey?.keyPrefix}</Typography>
                      <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}><strong>API Key:</strong> {newApiKey}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={handleCopyApiKey}
                          aria-label="copy API key"
                        >
                          <ContentCopy />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ marginTop: 1, display: 'block' }}>
                        This is the only time you will see this API key. Please store it securely.
                      </Typography>
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={handleDismissNewApiKey}
                        sx={{ marginTop: 1 }}
                      >
                        Dismiss
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Generate API Key Dialog */}
              <Dialog
                open={openGenerateDialog}
                onClose={handleCloseGenerateDialog}
                aria-labelledby="generate-api-key-dialog-title"
              >
                <DialogTitle id="generate-api-key-dialog-title">Generate New API Key</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter a name for the new API key.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="API Key Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseGenerateDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateApiKey} color="primary" disabled={!newApiKeyName}>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Your API Keys
                </Typography>
                <IconButton onClick={fetchApiKeys} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Key Prefix</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Requests</TableCell>
                      <TableCell>Tokens</TableCell>
                      <TableCell>Cost</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key._id}>
                        <TableCell>{key.name}</TableCell>
                        <TableCell>{key.keyPrefix}</TableCell>
                        <TableCell>{new Date(key.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={key.status === 'revoked' ? 'Revoked' : 'Active'}
                            color={key.status === 'revoked' ? 'error' : 'success'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{key.usage.requests}</TableCell>
                        <TableCell>{key.usage.tokens}</TableCell>
                        <TableCell>${key.usage.cost?.toFixed(2)}</TableCell>
                        <TableCell>
                          {key.status === 'active' && (
                            <IconButton edge="end" color="error" onClick={() => handleRevokeApiKey(key._id)}>
                              <Delete />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Revoke Confirmation Dialog */}
              <Dialog
                open={openRevokeDialog}
                onClose={() => setOpenRevokeDialog(false)}
                aria-labelledby="revoke-dialog-title"
              >
                <DialogTitle id="revoke-dialog-title">Revoke API Key</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to revoke this API key? This action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenRevokeDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={confirmRevokeApiKey} color="error">
                    Revoke
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Success Snackbar */}
              <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  {success}
                </Alert>
              </Snackbar>

              {/* Error Snackbar */}
              <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              </Snackbar>

              {/* Copy Success Snackbar */}
              <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  API Key copied to clipboard!
                </Alert>
              </Snackbar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};


