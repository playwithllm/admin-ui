import { createContext, ReactNode, useState, useEffect } from 'react';
import api from '../utils/api';
// import { useWebSocket } from '../hooks/useWebSocket';
import { useWebSocket } from '../context/WebSocketContext';

interface User {
  _id: string;
  name: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // Added isLoading
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string, reason?: string }>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading
  const [user, setUser] = useState<User | null>(null);
  const { initializeSocket } = useWebSocket();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
        console.log('Fetch user response:', response.data);
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Fetch user failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Update isLoading
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      console.log('Initializing socket for user:', user._id);
      initializeSocket(user._id);
    }
  }, [user?._id]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string, reason?: string }> => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      // Check status code
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message || 'Login successful' };
      }
      return { success: false, message: response.data.errorMessage || 'Login failed' };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed', reason: error.response?.data?.reason || 'Unknown reason' };
    }
  };

  const logout = () => {
    window.location.href = `${api.getUri()}/api/auth/logout`;
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      console.log('Register response:', response.data);
      // check status code 
      if (response.status === 201) {        
        return { success: true, message: response.data.message || 'Registration successful' };
      }
      return { success: false, message: response.data.errorMessage || 'Registration failed' };
    } catch (error: any) {
      console.error('Register failed:', error);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
