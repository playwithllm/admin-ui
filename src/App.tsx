import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { APIKeysPage } from './pages/APIKeysPage';
import { RequestsMonitoringPage } from './pages/RequestsMonitoringPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { BillingPage } from './pages/BillingPage';
import { UsagePage } from './pages/UsagePage';
import { CostPage } from './pages/CostPage';
import { DashboardLayout } from './components/DashboardLayout';
import { PrivateRoute } from './components/PrivateRoute';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Analytics />
      <CssBaseline />
      <AuthProvider>
        <WebSocketProvider>
          <Router>          
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="api-keys" element={<APIKeysPage />} />
                <Route path="requests" element={<RequestsMonitoringPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="usage" element={<UsagePage />} />
                <Route path="cost" element={<CostPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>
              <Route path="/" element={<Navigate to="/signin" replace />} />
            </Routes>
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
