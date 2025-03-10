import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Link as MuiLink,
} from '@mui/material';

import api from '../utils/api';

const billingData = {
  currentPlan: 'Free',  
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/inference/dashboard-data');
        console.log('Dashboard',response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      {/* Summary Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Free Tokens Remaining
            </Typography>
            <Typography variant="h4">{data.totalTokens??0} / 10000</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Requests Today
            </Typography>
            <Typography variant="h4">{data.requestCount??0}</Typography>
          </CardContent>
        </Card>
      </Grid>     
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total costs today
            </Typography>
            <Typography variant="h4">৳{data.totalCost??0}</Typography>
          </CardContent>
        </Card>
      </Grid>      

      {/* Remaining Quota */}
      <Grid item xs={12} sm={6} md={4}>  
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Remaining Quota</Typography>           
            <Typography>Tokens</Typography>
            <LinearProgress variant="determinate" value={(data.totalTokens / 10000) * 100} />
          </CardContent>
        </Card>
      </Grid>     

      {/* Billing Summary */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Billing Summary</Typography>
            <Typography>Current Plan: {billingData.currentPlan}</Typography>
            <Typography>Next Billing Date: N/A</Typography>            
          </CardContent>
        </Card>  
      </Grid>

      {/* API Key Management */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6">API Keys</Typography>  
            <Typography variant="h4">{data.activeKeys}</Typography>
            <Typography color="textSecondary">Active Keys</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/api-keys')}>
              Manage Keys
            </Button>
          </CardContent>
        </Card>
      </Grid>      

      {/* Documentation & Resources */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Documentation &amp; Resources</Typography>
            <MuiLink href="/documentation" target="_blank" rel="noopener">
              Quickstart Guide
            </MuiLink>
            <br />            
          </CardContent>  
        </Card>
      </Grid>      
    </Grid>
  );
}; 
