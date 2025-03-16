import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import api from '../utils/api';
import { InferenceRequest } from '../types/inference';



export const PromptsPage = () => {
  // State for filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for request details modal
  const [selectedRequest, setSelectedRequest] = useState<InferenceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [requests, setRequests] = useState<InferenceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/inference/search');
        const tempRequests: [] = response.data;
        const tempRequests2: InferenceRequest[] = tempRequests.map((request: any) => {
          return {
            _id: request._id,
            prompt: request.prompt,
            createdAt: request.createdAt,
            status: request.status,
            imageBase64: request.imageBase64,
            result: {
              ...request.result,
              total_duration_in_seconds: (request.result?.total_duration || 0 / (1000 * 1000 * 1000)).toString(), // nanoseconds to seconds
              load_duration_in_seconds: (request.result?.load_duration || 0 / (1000 * 1000 * 1000)).toString(), // nanoseconds to seconds
              prompt_eval_duration_in_seconds: (request.result?.prompt_eval_duration || 0 / (1000 * 1000 * 1000)).toString(), // nanoseconds to seconds
              eval_duration_in_seconds: (request.result?.eval_duration || 0 / (1000 * 1000 * 1000)).toString(), // nanoseconds to seconds
            },
            response: request.response,
            error: request.error,
          };
        });
        setRequests(tempRequests2);
        setError(null);
      } catch (err) {
        setError('Failed to fetch requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle pagination changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle opening request details
  const handleOpenDetails = (requestId: string) => {
    const temp = requests.find(r => r._id === requestId);
    console.log('temp', temp);
    setSelectedRequest(temp);
    setDetailsOpen(true);
  };

  const ImageViewer: React.FC<{ imageBase64: string }> = ({ imageBase64 }) => {
    if (!imageBase64) return null;

    return (
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
          marginBottom: 2
        }}
        onClick={() => setIsFullscreen(!isFullscreen)}
      >
        <img
          src={`${imageBase64}`}
          alt="Generated content"
          style={{
            maxWidth: isFullscreen ? '90vw' : '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        {isFullscreen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setIsFullscreen(false)}
          >
            <img
              src={`${imageBase64}`}
              alt="Generated content fullscreen"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Prompts
      </Typography>

      {/* Requests Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request prompt</TableCell>
                <TableCell>Timestamp</TableCell>
                {/* <TableCell>User ID</TableCell> */}
                {/* <TableCell>Model</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Duration (s)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : requests?.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.prompt}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                  {/* <TableCell>{request.userId}</TableCell> */}
                  {/* <TableCell>{request.modelName}</TableCell> */}
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={request.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{request.result?.total_duration_in_seconds || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDetails(request._id)}
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
          count={requests.length}
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
          Request Details - {selectedRequest?._id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest?._id && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {selectedRequest?.imageBase64 && (
                  <>
                    <Typography variant="h6">Generated Image</Typography>
                    <ImageViewer imageBase64={selectedRequest?.imageBase64 || ''} />
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Prompt</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <ReactMarkdown>{selectedRequest?.prompt}</ReactMarkdown>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Response</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <ReactMarkdown>{selectedRequest?.response}</ReactMarkdown>

                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Result Details</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(selectedRequest?.result, null, 2)}
                  </pre>
                </Paper>
              </Grid>
              {selectedRequest?.error && (
                <Grid item xs={12}>
                  <Typography variant="h6" color="error">Error Message</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
                    <Typography color="error.contrastText">
                      {selectedRequest?.error}
                    </Typography>
                  </Paper>
                </Grid>
              )}
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
