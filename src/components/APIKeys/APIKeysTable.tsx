import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Block as BlockIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  usage: number;
  lastUsed: string | null;
  key: string;
}

interface APIKeysTableProps {
  apiKeys: APIKey[];
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const APIKeysTable = ({ apiKeys, onDeactivate, onDelete }: APIKeysTableProps) => {
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // In a real app, you would show a success toast/notification here
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return 'Never used';
    return format(new Date(lastUsed), 'MMM d, yyyy HH:mm');
  };

  const maskAPIKey = (key: string) => {
    // Show first 8 and last 4 characters, mask the rest
    const firstPart = key.slice(0, 8);
    const lastPart = key.slice(-4);
    const maskedLength = key.length - 12; // 12 = 8 + 4 characters we're showing
    const maskedPart = '•'.repeat(maskedLength);
    return `${firstPart}${maskedPart}${lastPart}`;
  };

  return (
    <TableContainer>
      <Table aria-label="API keys table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>API Key</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Last Used</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>
                <Typography variant="body1">{key.name}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    {maskAPIKey(key.key)}
                  </Typography>
                  <Tooltip title="Copy Full API Key">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyKey(key.key)}
                      aria-label="copy api key"
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>{formatDate(key.createdAt)}</TableCell>
              <TableCell>
                <Chip
                  label={key.status}
                  color={key.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>{key.usage.toLocaleString()} requests</TableCell>
              <TableCell>{formatLastUsed(key.lastUsed)}</TableCell>
              <TableCell align="right">
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Tooltip title="Deactivate Key">
                    <IconButton
                      size="small"
                      onClick={() => onDeactivate(key.id)}
                      disabled={key.status === 'Inactive'}
                      aria-label="deactivate api key"
                    >
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Key">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(key.id)}
                      color="error"
                      aria-label="delete api key"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 
