import { createContext, ReactNode, useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: string;
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
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post(
        '/api/auth/login',
        { email, password }
      );
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

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
