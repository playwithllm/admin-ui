import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  LinearProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Dummy data for the chart
const chartData = [
  { name: 'Mon', requests: 400 },
  { name: 'Tue', requests: 300 },
  { name: 'Wed', requests: 600 },
  { name: 'Thu', requests: 800 },
  { name: 'Fri', requests: 500 },
  { name: 'Sat', requests: 200 },
  { name: 'Sun', requests: 300 },
];

const apiUsageData = {
  totalRequests: 12456,
  totalTokens: 5789,
};

const quotaData = {
  requestsRemaining: 7544,
  tokensRemaining: 4211,
};

const recentActivity = [
  { id: 1, timestamp: '2023-05-01T10:30:00Z', endpoint: '/api/classify', status: 'Success' },
  { id: 2, timestamp: '2023-05-01T11:15:00Z', endpoint: '/api/summarize', status: 'Error' },
];

const billingData = {
  currentPlan: 'Pro',
  nextBillingDate: '2023-06-01',
  recentInvoices: [
    { id: 1, amount: 99.99, status: 'Paid' },
  ],
};

const apiKeys = {
  active: 5,
};

const supportTickets = {
  open: 2,
  recentTickets: [
    { id: 1, subject: 'API Integration Help', lastUpdated: '2023-04-28' },
  ],
};

const featureRequests = [
  { id: 1, title: 'Add GraphQL Support', status: 'Under Review' },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={4}>
      {/* Summary Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Tokens Remaining
            </Typography>
            <Typography variant="h4">5,000</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Requests Today
            </Typography>
            <Typography variant="h4">247</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">18</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total API Calls
            </Typography>
            <Typography variant="h4">12,456</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Requests per Day
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#1976d2"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* API Usage Overview */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Usage Overview 
            </Typography>
            <Typography variant="h4">{apiUsageData.totalRequests}</Typography>
            <Typography color="textSecondary">Total Requests</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4">{apiUsageData.totalTokens}</Typography>
            <Typography color="textSecondary">Total Tokens</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Remaining Quota */}
      <Grid item xs={12} sm={6} md={4}>  
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Remaining Quota</Typography>
            <Typography>Requests</Typography>
            <LinearProgress variant="determinate" value={(quotaData.requestsRemaining / 10000) * 100} />
            <Typography>Tokens</Typography>
            <LinearProgress variant="determinate" value={(quotaData.tokensRemaining / 10000) * 100} />
          </CardContent>
        </Card>
      </Grid>

      {/* Recent API Activity */} 
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent API Activity</Typography>  
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.timestamp}</TableCell>  
                      <TableCell>{row.endpoint}</TableCell>
                      <TableCell>
                        <Chip label={row.status} color={row.status === 'Success' ? 'success' : 'error'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Billing Summary */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Billing Summary</Typography>
            <Typography>Current Plan: {billingData.currentPlan}</Typography>
            <Typography>Next Billing Date: {billingData.nextBillingDate}</Typography>
            <Typography variant="h6" sx={{ mt: 3 }}>Recent Invoices</Typography>
            {billingData.recentInvoices.map((invoice) => (
              <Alert key={invoice.id} severity={invoice.status === 'Paid' ? 'success' : 'warning'} sx={{ my: 1 }}>
                Invoice #{invoice.id} - ${invoice.amount} - {invoice.status}
              </Alert>
            ))}
          </CardContent>
        </Card>  
      </Grid>

      {/* API Key Management */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">API Keys</Typography>  
            <Typography variant="h4">{apiKeys.active}</Typography>
            <Typography color="textSecondary">Active Keys</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard/api-keys')}>
              Manage Keys
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Support Tickets */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Support Tickets</Typography>
            <Typography variant="h4">{supportTickets.open}</Typography>  
            <Typography color="textSecondary">Open Tickets</Typography>
            <Typography variant="h6" sx={{ mt: 3 }}>Recent Tickets</Typography>
            <Timeline>
              {supportTickets.recentTickets.map((ticket) => (
                <TimelineItem key={ticket.id}>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2">{ticket.subject}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Last Updated: {ticket.lastUpdated}  
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </Grid>

      {/* Documentation & Resources */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Documentation &amp; Resources</Typography>
            <MuiLink href="/docs/quickstart" target="_blank" rel="noopener">
              Quickstart Guide
            </MuiLink>
            <br />
            <MuiLink href="/docs/api-reference" target="_blank" rel="noopener">
              API Reference
            </MuiLink>
            <br />  
            <MuiLink href="/docs/tutorials" target="_blank" rel="noopener">
              Tutorials
            </MuiLink>
            <br />
            <MuiLink href="/docs/faq" target="_blank" rel="noopener">
              FAQ
            </MuiLink>
          </CardContent>  
        </Card>
      </Grid>

      {/* Usage Trends */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Usage Trends</Typography>
            {/* Add usage trend chart here */}
          </CardContent>
        </Card>
      </Grid>

      {/* Feature Requests */}  
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Feature Requests</Typography>
            {featureRequests.map((request) => (
              <Box key={request.id} sx={{ mb: 2 }}>
                <Typography>{request.title}</Typography>
                <Chip label={request.status} size="small" />
              </Box>
            ))}
            <Button variant="outlined" size="small" sx={{ mt: 1 }}>
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Notifications */}
      <Grid item xs={12} md={6}>  
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            {/* Add notification list/alerts here */}  
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}; 
