import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  initializeSocket: (userId: string) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initializeSocket = (userId: string) => {
    console.log('Initializing WebSocket with user ID:', userId);
    if (socket) {
      socket.disconnect(); // Disconnect any existing socket before creating a new one
    }
    const newSocket = io(import.meta.env.VITE_WS_URL ?? 'http://localhost:4001', {
      transports: ['websocket'],
      query: { userId },
      autoConnect: true,
    });
    newSocket.on('connect', () => console.log('Socket connected:', newSocket.id));
    newSocket.on('disconnect', () => console.log('Socket disconnected'));
    setSocket(newSocket);
  };

  useEffect(() => {
    return () => {
      console.log('WebSocketProvider unmounted, cleaning up socket...');
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, initializeSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
