import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Login } from './pages/Login';
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
import { ResendVerification } from './pages/ResendVerification';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { LoginSuccess } from './pages/LoginSuccess';
import { PromptInterface} from './pages/PromptInterface';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebSocketProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index path="dashboard" element={<Dashboard />} />
                <Route path="api-keys" element={<APIKeysPage />} />
                <Route path="requests" element={<RequestsMonitoringPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="usage" element={<UsagePage />} />
                <Route path="cost" element={<CostPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="prompt" element={<PromptInterface />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
