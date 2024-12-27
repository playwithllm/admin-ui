import { useEffect, useState, useMemo } from 'react';
import { Socket, io } from 'socket.io-client';
import { WebSocketContext } from '../hooks/useWebSocket';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string>('');

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:4001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('WebSocket connected', socketInstance.id);
      setIsConnected(true);
      setConnectionId(socketInstance?.id??'');
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setConnectionId('');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('inferenceResponse', (data) => {
      // Handle the inference response
      console.log('Received inference response:', data);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = useMemo(() => ({
    socket,
    isConnected,
    connectionId,
  }), [socket, isConnected, connectionId]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
