import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
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

interface UsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  date: string;
  requestCount: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
  totalDurationInMs: number;
}

export const UsagePage = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  // Add state for totalTokens
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    api
      .get<UsageData[]>('/api/v1/inference/grouped-evaluation-counts')
      .then((response) => {
        setUsageData(response.data);
        // Calculate totals
        const promptTotal = response.data.reduce(
          (sum, item) => sum + item.promptTokens,
          0
        );
        const completionTotal = response.data.reduce(
          (sum, item) => sum + item.completionTokens,
          0
        );
        // Calculate totalTokens
        const tokensTotal = response.data.reduce(
          (sum, item) => sum + item.totalTokens,
          0
        );
        setTotalPromptTokens(promptTotal);
        setTotalCompletionTokens(completionTotal);
        setTotalTokens(tokensTotal);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total Prompt Tokens
            </Typography>
            <Typography variant="h3">
              {totalPromptTokens.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total Completion Tokens
            </Typography>
            <Typography variant="h3">
              {totalCompletionTokens.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Total Tokens
            </Typography>
            <Typography variant="h3">
              {totalTokens.toLocaleString()}
            </Typography>
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
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              {/* requestCount */}
              <Line
                yAxisId="left"
                type="monotone"
                name="Requests"
                dataKey="requestCount"
                stroke="#ff0000"
                strokeWidth={2}
                dot={false}
              />
              {/* cost */}
              <Line
                yAxisId="right"
                type="monotone"
                name="Tokens"
                dataKey="totalTokens"
                stroke="#0000ff"
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
