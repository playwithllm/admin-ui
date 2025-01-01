import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Dialog,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { APIKeysTable } from '../components/APIKeys/APIKeysTable';
import { CreateAPIKeyForm } from '../components/APIKeys/CreateAPIKeyForm';

import api from '../utils/api';

// Dummy data for API keys
const dummyAPIKeys = [
  {
    id: '1',
    name: 'Production API Key',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'Active',
    usage: 1250,
    lastUsed: '2024-01-16T15:30:00Z',
    key: 'pk_live_***********************abc',
  },
  {
    id: '2',
    name: 'Development API Key',
    createdAt: '2024-01-10T15:30:00Z',
    status: 'Active',
    usage: 450,
    lastUsed: '2024-01-15T09:45:00Z',
    key: 'pk_test_***********************xyz',
  },
  {
    id: '3',
    name: 'Test API Key',
    createdAt: '2024-01-05T09:15:00Z',
    status: 'Inactive',
    usage: 0,
    lastUsed: null,
    key: 'pk_test_***********************123',
  },
];

export const APIKeysPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState(dummyAPIKeys);

  // load API keys from the server
  useEffect(() => {
    const fetchAPIKeys = async () => {
      try {
        const response = await api.get('/api/v1/api-keys/search');
        console.log('API keys:', response.data);
        setApiKeys(response.data);
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    };

    fetchAPIKeys();
  } , []);

  const handleCreateKey = async (keyData: object) => {
    try {
      const response = await api.post('/api/v1/api-keys/create', { ...keyData });
      console.log('New API key:', response.data);
      setApiKeys([...apiKeys, response.data]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDeactivateKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'Inactive' } : key
    ));
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          API Keys Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New API Key
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <APIKeysTable
          apiKeys={apiKeys}
          onDeactivate={handleDeactivateKey}
          onDelete={handleDeleteKey}
        />
      </Paper>

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateAPIKeyForm
          onSubmit={handleCreateKey}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Dialog>
    </Container>
  );
}; 
