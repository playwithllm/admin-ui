import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </WebSocketProvider>
  </StrictMode>,
)
