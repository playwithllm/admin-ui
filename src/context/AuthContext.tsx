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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  socketId: string | undefined;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading
  const [user, setUser] = useState<User | null>(null);
  const { initializeSocket, socket } = useWebSocket();
  const [socketId, setSocketId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
        console.log('Fetch user response:', response.data);
        setUser(response.data);
        setIsAuthenticated(true);
        // if (response.data._id) {
        //   initializeSocket(response.data._id); // Initialize WebSocket with user ID
        // }
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
    if (socket) {
      setSocketId(socket.id);
    }
  }, [socket]);

  useEffect(() => {
    if (user?._id) {
      console.log('Initializing socket for user:', user._id);
      initializeSocket(user._id);
    }
  }, [user?._id]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post(
        '/api/auth/login',
        { email, password }
      );
      console.log('Login response:', response.data);
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    window.location.href = `${api.getUri()}/api/auth/logout`;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, socketId }}>
      {children}
    </AuthContext.Provider>
  );
};
