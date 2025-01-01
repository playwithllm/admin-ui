import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { useState, useEffect } from 'react';
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
import { UsageData } from '../Usage/UsagePage';


interface UsageData {
  date: string;
  totalCost: number;
  evalCost: number;
  promptEvalCost: number;
}


export const CostPage = () => {
  const [groupBy, setGroupBy] = useState('None');
  const [workspace, setWorkspace] = useState('All Workspaces');
  const [apiKey, setApiKey] = useState('All API keys');
  const [model, setModel] = useState('All Models');
  const [currentMonth] = useState('Dec 2024');

   const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEvalCost, setTotalEvalCost] = useState(0);
  const [totalPromptEvalCost, setTotalPromptEvalCost] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    api.get<UsageData[]>('/api/v1/inference/grouped-evaluation-counts').then((response) => {
      setUsageData(response.data);
      // Calculate totals
      const totalCost = response.data.reduce((sum, item) => sum + item.totalCost, 0);
      setTotalCost(totalCost);

      const promptTotal = response.data.reduce((sum, item) => sum + item.promptEvalCost, 0);
      setTotalPromptEvalCost(promptTotal);
      const evalCostTotal   = response.data.reduce((sum, item) => sum + item.evalCost, 0);
      setTotalEvalCost(evalCostTotal);
    });
  }, []);

  const handleGroupByChange = (event: SelectChangeEvent) => {
    setGroupBy(event.target.value);
  };

  const handleWorkspaceChange = (event: SelectChangeEvent) => {
    setWorkspace(event.target.value);
  };

  const handleApiKeyChange = (event: SelectChangeEvent) => {
    setApiKey(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  const handlePreviousMonth = () => {
    // Add logic to change to previous month
  };

  const handleNextMonth = () => {
    // Add logic to change to next month
  };

  const formatYAxis = (value: number) => {
    return `$${value.toFixed(1)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* <Typography variant="h4" gutterBottom>
        Cost
      </Typography> */}

      {/* Filters Row */}
      {/* <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Group by</InputLabel>
          <Select value={groupBy} label="Group by" onChange={handleGroupByChange}>
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Model">Model</MenuItem>
            <MenuItem value="API Key">API Key</MenuItem>
          </Select>
        </FormControl>

        <Typography sx={{ mx: 2 }}>|</Typography>

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

        <Box sx={{ ml: 'auto' }}>
          <Button variant="contained" color="primary">
            Export
          </Button>
        </Box>
      </Box> */}

      {/* Total Cost Display */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Total cost
        </Typography>
        <Typography variant="h3" component="div" sx={{ mt: 1 }}>
          BDT৳ {totalCost}
        </Typography>
      </Box>

      {/* Cost Graph */}
      <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          Daily cost
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Includes usage from both API and Console
        </Typography>
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
              
              />
              <YAxis/>       
              <Tooltip />      
              <Line
                type="monotone"
                name='Total Cost'
                dataKey="totalCost"
                stroke="#ff0000"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                name='Eval Cost'
                dataKey="evalCost"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                name='Prompt Eval Cost'
                dataKey="promptEvalCost"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}; 
