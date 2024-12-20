import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Sample data for the chart
const sampleData = [
  { date: 'Dec 01', tokens: 15000 },
  { date: 'Dec 06', tokens: 22000 },
  { date: 'Dec 11', tokens: 18500 },
  { date: 'Dec 16', tokens: 25000 },
  { date: 'Dec 21', tokens: 20000 },
  { date: 'Dec 26', tokens: 28000 },
  { date: 'Dec 31', tokens: 23500 },
];

export const UsagePage = () => {
  const [workspace, setWorkspace] = useState('All Workspaces');
  const [apiKey, setApiKey] = useState('All API keys');
  const [model, setModel] = useState('All Models');
  const [currentMonth, setCurrentMonth] = useState('Dec 2024');
  const [groupBy, setGroupBy] = useState('None');

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value);
  };

  const handleApiKeyChange = (event: SelectChangeEvent) => {
    setApiKey(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  const handleGroupByChange = (event: SelectChangeEvent) => {
    setGroupBy(event.target.value);
  };

  const handlePreviousMonth = () => {
    // Add logic to change to previous month
  };

  const handleNextMonth = () => {
    // Add logic to change to next month
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Usage
      </Typography>

      {/* Filters Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Workspace</InputLabel>
          <Select value={workspace} label="Workspace" onChange={handleWorkspaceChange}>
            <MenuItem value="All Workspaces">All Workspaces</MenuItem>
            {/* Add more workspaces here */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>API Key</InputLabel>
          <Select value={apiKey} label="API Key" onChange={handleApiKeyChange}>
            <MenuItem value="All API keys">All API keys</MenuItem>
            {/* Add more API keys here */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Model</InputLabel>
          <Select value={model} label="Model" onChange={handleModelChange}>
            <MenuItem value="All Models">All Models</MenuItem>
            {/* Add more models here */}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography>{currentMonth}</Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Group by</InputLabel>
            <Select value={groupBy} label="Group by" onChange={handleGroupByChange}>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Model">Model</MenuItem>
              <MenuItem value="API Key">API Key</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary">
            Export
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total tokens in
            </Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total tokens out
            </Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Usage Graph */}
      <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          Daily token usage
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Includes usage from both API and Console
        </Typography>
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tokens"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}; 
