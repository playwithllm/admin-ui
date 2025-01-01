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
import { useEffect, useState } from 'react';
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

import api from '../../utils/api';

export interface UsageData {
  date: string;
  promptEvalCount: number;
  evalCount: number;
}

export const UsagePage = () => {
  const [workspace, setWorkspace] = useState('All Workspaces');
  const [apiKey, setApiKey] = useState('All API keys');
  const [model, setModel] = useState('All Models');
  const [currentMonth] = useState('Dec 2024');
  const [groupBy, setGroupBy] = useState('None');
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    api.get<UsageData[]>('/api/v1/inference/grouped-evaluation-counts').then((response) => {
      setUsageData(response.data);
      // Calculate totals
      const promptTotal = response.data.reduce((sum, item) => sum + item.promptEvalCount, 0);
      const completionTotal = response.data.reduce((sum, item) => sum + item.evalCount, 0);
      setTotalPromptTokens(promptTotal);
      setTotalCompletionTokens(completionTotal);
    });
  }, []);

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
      {/* <Typography variant="h4" gutterBottom>
        Usage
      </Typography> */}

      {/* Filters Row */}
      {/* <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Workspace</InputLabel>
          <Select value={workspace} label="Workspace" onChange={handleWorkspaceChange}>
            <MenuItem value="All Workspaces">All Workspaces</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>API Key</InputLabel>
          <Select value={apiKey} label="API Key" onChange={handleApiKeyChange}>
            <MenuItem value="All API keys">All API keys</MenuItem>
         
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Model</InputLabel>
          <Select value={model} label="Model" onChange={handleModelChange}>
            <MenuItem value="All Models">All Models</MenuItem>
         
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
      </Box> */}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total tokens in
            </Typography>
            <Typography variant="h3">{totalPromptTokens.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total tokens out
            </Typography>
            <Typography variant="h3">{totalCompletionTokens.toLocaleString()}</Typography>
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
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                name="Prompt Tokens"
                dataKey="promptEvalCount"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                name="Completion Tokens"
                dataKey="evalCount"
                stroke="#82ca9d"
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
