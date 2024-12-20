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
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

// Dummy data for chat messages
const dummyMessages = [
  {
    id: 1,
    sender: 'user',
    message: 'Hi, I need help with API integration',
    timestamp: '2024-01-20T10:30:00Z',
    read: true,
  },
  {
    id: 2,
    sender: 'support',
    message: 'Hello! I\'d be happy to help you with the API integration. Could you please specify which part you\'re having trouble with?',
    timestamp: '2024-01-20T10:31:00Z',
    read: true,
  },
  {
    id: 3,
    sender: 'user',
    message: 'I\'m getting a rate limit error when making multiple requests',
    timestamp: '2024-01-20T10:32:00Z',
    read: true,
  },
  {
    id: 4,
    sender: 'support',
    message: 'I see. The default rate limit is 100 requests per minute. You can increase this by upgrading your plan or implementing request queuing in your application. Would you like me to explain how to implement request queuing?',
    timestamp: '2024-01-20T10:33:00Z',
    read: true,
  },
];

export const SupportPage = () => {
  const [messages, setMessages] = useState(dummyMessages);
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

  // Handle sending new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support agent typing
    setIsTyping(true);
    setTimeout(() => {
      // Add support response
      const supportMessage = {
        id: messages.length + 2,
        sender: 'support',
        message: 'Thank you for your message. A support agent will respond shortly.',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
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
                key={message.id}
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
