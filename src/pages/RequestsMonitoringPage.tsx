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
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

// Dummy data for requests
const dummyRequests = [
  {
    id: 'REQ-001',
    timestamp: '2024-01-20T10:30:00Z',
    user: 'john.doe@example.com',
    endpoint: '/api/classify',
    status: 'Success',
    latency: 245,
  },
  {
    id: 'REQ-002',
    timestamp: '2024-01-20T10:35:00Z',
    user: 'jane.smith@example.com',
    endpoint: '/api/summarize',
    status: 'Error',
    latency: 1250,
  },
  {
    id: 'REQ-003',
    timestamp: '2024-01-20T10:40:00Z',
    user: 'bob.wilson@example.com',
    endpoint: '/api/classify',
    status: 'Success',
    latency: 180,
  },
  {
    id: 'REQ-004',
    timestamp: '2024-01-20T10:45:00Z',
    user: 'alice.jones@example.com',
    endpoint: '/api/translate',
    status: 'Success',
    latency: 890,
  },
  {
    id: 'REQ-005',
    timestamp: '2024-01-20T10:50:00Z',
    user: 'john.doe@example.com',
    endpoint: '/api/summarize',
    status: 'Error',
    latency: 1500,
  },
];

// Dummy data for request details
const dummyRequestDetails = {
  'REQ-001': {
    requestPayload: {
      text: 'Sample text for classification',
      model: 'gpt-3.5-turbo',
    },
    responsePayload: {
      category: 'technology',
      confidence: 0.95,
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ****',
    },
    errorMessage: null,
    processingTime: 245,
  },
  'REQ-002': {
    requestPayload: {
      text: 'Long text for summarization',
      maxLength: 100,
    },
    responsePayload: null,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ****',
    },
    errorMessage: 'Rate limit exceeded',
    processingTime: 1250,
  },
  'REQ-003': {
    requestPayload: {
      text: 'Another text for classification',
      model: 'gpt-4',
    },
    responsePayload: {
      category: 'science',
      confidence: 0.88,
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ****',
    },
    errorMessage: null,
    processingTime: 180,
  },
  'REQ-004': {
    requestPayload: {
      text: 'Hello world',
      targetLanguage: 'es',
    },
    responsePayload: {
      translatedText: 'Hola mundo',
      confidence: 0.98,
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ****',
    },
    errorMessage: null,
    processingTime: 890,
  },
  'REQ-005': {
    requestPayload: {
      text: 'Very long article for summarization',
      maxLength: 200,
    },
    responsePayload: null,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ****',
    },
    errorMessage: 'Model currently unavailable',
    processingTime: 1500,
  },
};

const statusOptions = ['', 'Success', 'Error'];

export const RequestsMonitoringPage = () => {
  // State for filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [userFilter, setUserFilter] = useState('');
  const [endpointFilter, setEndpointFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // State for request details modal
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter requests based on current filters
  const filteredRequests = dummyRequests.filter(request => {
    const matchesSearch = searchQuery === '' ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.endpoint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = userFilter === '' || request.user.toLowerCase().includes(userFilter.toLowerCase());
    const matchesEndpoint = endpointFilter === '' || request.endpoint.toLowerCase().includes(endpointFilter.toLowerCase());
    const matchesStatus = statusFilter === '' || request.status.toLowerCase() === statusFilter.toLowerCase();

    const requestDate = new Date(request.timestamp);
    const matchesDateRange = (!startDate || requestDate >= startDate) &&
      (!endDate || requestDate <= endDate);

    return matchesSearch && matchesUser && matchesEndpoint && matchesStatus && matchesDateRange;
  });

  // Handle opening request details
  const handleOpenDetails = (requestId: string) => {
    setSelectedRequest(requestId);
    setDetailsOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Requests Monitoring
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="User"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option || 'All'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Requests Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Latency (ms)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{new Date(request.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{request.user}</TableCell>
                    <TableCell>{request.endpoint}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={request.status === 'Success' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.latency}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(request.id)}
                      >
                        <VisibilityIcon />
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
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Request Details Modal */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Request Details - {selectedRequest}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && dummyRequestDetails[selectedRequest] && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Request Payload</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(dummyRequestDetails[selectedRequest].requestPayload, null, 2)}
                  </pre>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Response Payload</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {dummyRequestDetails[selectedRequest].responsePayload
                      ? JSON.stringify(dummyRequestDetails[selectedRequest].responsePayload, null, 2)
                      : 'No response payload'}
                  </pre>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Headers</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(dummyRequestDetails[selectedRequest].headers, null, 2)}
                  </pre>
                </Paper>
              </Grid>
              {dummyRequestDetails[selectedRequest].errorMessage && (
                <Grid item xs={12}>
                  <Typography variant="h6" color="error">Error Message</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
                    <Typography color="error.contrastText">
                      {dummyRequestDetails[selectedRequest].errorMessage}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="h6">Processing Time</Typography>
                <Typography>{dummyRequestDetails[selectedRequest].processingTime} ms</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 
