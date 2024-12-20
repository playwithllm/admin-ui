import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';

// Sample invoice data
const invoices = [
  {
    period: 'Dec 01, 2024 - Jan 01, 2025 (UTC)',
    amount: '$0.00 USD',
    status: 'PENDING'
  },
  {
    period: 'Nov 01 - Dec 01, 2024 (UTC)',
    amount: '$0.00 USD',
    status: 'FINALIZED'
  },
  {
    period: 'Nov 16, 2024 (UTC)',
    amount: '$10.00 USD',
    status: 'ISSUED'
  },
  {
    period: 'Oct 09 - Nov 01, 2024 (UTC)',
    amount: '$0.00 USD',
    status: 'FINALIZED'
  },
  {
    period: 'Oct 9, 2024 (UTC)',
    amount: '$10.00 USD',
    status: 'ISSUED'
  }
];

// Sample usage data for the current invoice
const currentInvoiceDetails = [
  {
    model: 'Claude Instant Usage',
    details: 'No charges with usage for this product'
  },
  {
    model: 'Claude 2 Usage',
    details: 'No charges with usage for this product'
  },
  {
    model: 'Claude 3 Haiku Usage',
    rows: [
      {
        description: 'Million Input Tokens',
        quantity: '0.012',
        unitPrice: '$0.25 USD',
        total: '$0.003'
      },
      {
        description: 'Million Output Tokens',
        quantity: '0.0042',
        unitPrice: '$1.25 USD',
        total: '$0.0053'
      }
    ]
  },
  {
    model: 'Claude 3 Sonnet Usage',
    details: 'No charges with usage for this product'
  },
  {
    model: 'Claude 3 Opus Usage',
    rows: [
      {
        description: 'Million Input Tokens',
        quantity: '0.087',
        unitPrice: '$15.00 USD',
        total: '$1.31'
      },
      {
        description: 'Million Output Tokens',
        quantity: '0.022',
        unitPrice: '$75.00 USD',
        total: '$1.68'
      }
    ]
  }
];

export const BillingPage = () => {
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [totalLimit, setTotalLimit] = useState(10);
  const [notificationAmount, setNotificationAmount] = useState('$10');
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  
  const getStatusChip = (status: string) => {
    let color: "default" | "primary" | "success" | "warning" = "default";
    switch (status) {
      case 'FINALIZED':
        color = "success";
        break;
      case 'ISSUED':
        color = "primary";
        break;
      case 'PENDING':
        color = "warning";
        break;
    }
    return <Chip label={status} color={color} size="small" />;
  };

  const handleChangeLimit = () => {
    setIsLimitDialogOpen(true);
  };

  const handleCloseLimitDialog = () => {
    setIsLimitDialogOpen(false);
    setNewLimit('');
  };

  const handleSaveLimit = () => {
    const limit = parseFloat(newLimit);
    if (!isNaN(limit) && limit >= 0) {
      setMonthlyLimit(limit);
      handleCloseLimitDialog();
    }
  };

  const handleAddNotification = () => {
    // Add logic to add notification
  };

  const handleDeleteNotification = () => {
    setNotificationAmount('');
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {/* Credit Balance Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" gutterBottom>
          Pay as you go
        </Typography>
        <Typography variant="h3" sx={{ my: 2 }}>
          $9.95
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Current Credit Balance
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRecharge}
                onChange={(e) => setAutoRecharge(e.target.checked)}
              />
            }
            label="Auto recharge"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            When your credit balance reaches $0, your API requests will stop working. 
            Enable automatic recharge to automatically keep your credit balance topped up.
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Credits
          </Button>
        </Box>
      </Paper>

      {/* Spend Limits Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" gutterBottom>
          Spend limits
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          You can manage your spend by setting monthly spend limits.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Monthly Limit Card */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                Monthly limit
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="h4" component="span">
                  ${monthlyLimit}
                </Typography>
                <Typography color="text.secondary">
                  of ${totalLimit}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                onClick={handleChangeLimit}
                sx={{ mt: 2 }}
              >
                Change Limit
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Resets on 1 Jan 2025
              </Typography>
            </Paper>
          </Grid>

          {/* Email Notification Card */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                Email notification
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Notify all admins when monthly spend reaches:
              </Typography>
              
              {notificationAmount ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Typography>{notificationAmount}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={handleDeleteNotification}
                    sx={{ color: 'text.secondary' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    size="small"
                    placeholder="$10"
                    sx={{ width: '120px' }}
                  />
                  <Button 
                    variant="outlined"
                    onClick={handleAddNotification}
                  >
                    Add notification
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoice History Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice History
        </Typography>
        <List>
          {invoices.map((invoice, index) => (
            <Box key={index}>
              <ListItem 
                button 
                onClick={() => setSelectedInvoice(invoice)}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  bgcolor: selectedInvoice === invoice ? 'action.selected' : 'transparent'
                }}
              >
                <ListItemText primary={invoice.period} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>{invoice.amount}</Typography>
                  {getStatusChip(invoice.status)}
                </Box>
              </ListItem>
              {index < invoices.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>

      {/* Selected Invoice Details */}
      {selectedInvoice && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {selectedInvoice.period}
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">START</Typography>
                <Typography>Nov 1, 2024 12:00 AM (UTC)</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">END</Typography>
                <Typography>Dec 1, 2024 12:00 AM (UTC)</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">ISSUED</Typography>
                <Typography>Dec 1, 2024 12:00 PM (UTC)</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Usage Details */}
          {currentInvoiceDetails.map((section, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ bgcolor: 'background.default', p: 2 }}>
                {section.model}
              </Typography>
              
              {section.details ? (
                <Typography sx={{ p: 2, textAlign: 'center' }}>
                  {section.details}
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.rows?.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell>{row.description}</TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                          <TableCell align="right">{row.unitPrice}</TableCell>
                          <TableCell align="right">{row.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Change Limit Dialog */}
      <Dialog open={isLimitDialogOpen} onClose={handleCloseLimitDialog}>
        <DialogTitle>Change Monthly Spend Limit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Monthly Limit"
            type="number"
            fullWidth
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLimitDialog}>Cancel</Button>
          <Button onClick={handleSaveLimit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 
