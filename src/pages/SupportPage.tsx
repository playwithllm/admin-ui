import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Card,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

import { useWebSocket } from '../hooks/useWebSocket';

// Add this interface near the top of the file
interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const SupportPage = () => {
  const { socket, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

// Listen for events
useEffect(() => {
  if (!socket) return;

  socket.on('inferenceResponse', (data) => {
    console.log('Received:', data);
    const responseMsg = data.result.content;
    setMessages(prev => [...prev, {
      id: messages.length + 1,
      sender: 'support',
      message: responseMsg,
      timestamp: new Date().toISOString(),
      read: false,
    }]);
    setIsTyping(false);
  });

  // Cleanup
  return () => {
    socket.off('inferenceResponse');
  };
}, [socket]);

 // Send events
  const sendMessage = (msg: string) => {
  if (socket) {
    socket.emit('inferenceRequest', { message: msg });
  }
};

  // Handle sending new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Clear previous messages
    setMessages([]);

    // Send events
    sendMessage(newMessage);

    // Add only the new user message
    const userMessage = {
      id: 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages([userMessage]);
    setNewMessage('');

    // Simulate support agent typing
    setIsTyping(true);
  };

  // Handle file attachment
  const handleAttachment = () => {
    // Here you would typically implement file upload functionality
    console.log('File attachment clicked');
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 140px)' }}>
      <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 1000 }}>
        This chat is for demonstration purposes only. Messages are not stored and will be cleared after each interaction.
      </Alert>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">
            Support Chat
          </Typography>
          <Typography variant="body2">
            We typically respond within a few minutes
          </Typography>
        </Box>
        <Divider />

        {/* Messages Area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.timestamp}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  gap: 1,
                }}>
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {message.sender === 'user' ? 'U' : 'S'}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? 'primary.light' : 'white',
                      color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1">
                      {message.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        color: message.sender === 'user' ? 'primary.contrastText' : 'text.secondary',
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}
          </List>
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Support is typing...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input Area */}
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              onClick={handleAttachment}
            >
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={4}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}; 
