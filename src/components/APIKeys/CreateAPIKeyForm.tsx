import { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';

interface CreateAPIKeyFormProps {
  onSubmit: (key: any) => void;
  onCancel: () => void;
}

export const CreateAPIKeyForm = ({ onSubmit, onCancel }: CreateAPIKeyFormProps) => {
  const [name, setName] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [newKeyData, setNewKeyData] = useState<any>(null);

  const generateAPIKey = () => {
    // In a real app, this would be generated by the backend
    const key = 'pk_live_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return key;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name for the API key');
      return;
    }

    const key = generateAPIKey();
    setNewKey(key);
    setShowNewKey(true);

    const keyData = {
      name: name.trim(),
      createdAt: new Date().toISOString(),
      status: 'Active',
      usage: 0,
      lastUsed: null,
      key,
    };
    setNewKeyData(keyData);
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(newKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClose = () => {
    if (newKeyData) {
      onSubmit(newKeyData);
    }
    onCancel();
  };

  if (showNewKey) {
    return (
      <>
        <DialogTitle>Your New API Key</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Important: Copy your API key now. For security reasons, you won't be able to see it again!
          </Alert>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {name}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              API Key
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                position: 'relative',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {newKey}
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<CopyIcon />}
            onClick={handleCopyKey}
            fullWidth
            color={copySuccess ? 'success' : 'primary'}
          >
            {copySuccess ? 'Copied!' : 'Copy API Key'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Create New API Key</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="API Key Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          helperText="Give your API key a name to remember its purpose"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          Create API Key
        </Button>
      </DialogActions>
    </form>
  );
}; 
