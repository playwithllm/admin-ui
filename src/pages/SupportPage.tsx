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
import ReactMarkdown from 'react-markdown';


import { useWebSocket } from '../hooks/useWebSocket';

interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const SupportPage = () => {
  const { socket, isConnected, connectionId } = useWebSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messageBuffer = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  // Handle incoming message chunks with buffer pattern
  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (data: any) => {
      try {
        console.log('Received websocket data:', data);
        
         if (data.type === 'chunk' && data.result?.message?.content) {          
          // Only append new content if it's not already in the buffer
          const newContent = data.result.message.content;
          if (!messageBuffer.current.endsWith(newContent)) {
            messageBuffer.current += newContent;
            setCurrentStreamingMessage(messageBuffer.current);
          }
        }
        else if (data.type === 'end' && messageBuffer.current) {
          // Message complete, add to messages list
          const completedMessage: ChatMessage = {
            id: Date.now(),
            sender: 'support',
            message: messageBuffer.current,
            timestamp: new Date().toISOString(),
            read: true,
          };
          
          setMessages(prev => [...prev, completedMessage]);
          messageBuffer.current = '';
          setCurrentStreamingMessage('');
          setIsTyping(false);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    // Set up event listeners
    // socket.on('inferenceResponseStart', () => handleSocketMessage({ type: 'start' }));
    socket.on('inferenceResponseChunk', (data) => handleSocketMessage({ type: 'chunk', ...data }));
    socket.on('inferenceResponseEnd', () => handleSocketMessage({ type: 'end' }));

    return () => {
      socket.off('inferenceResponseStart');
      socket.off('inferenceResponseChunk');
      socket.off('inferenceResponseEnd');
    };
  }, [socket]);

  const sendMessage = (msg: string) => {
    if (socket && isConnected) {
      socket.emit('inferenceRequest', { message: msg });
    } else {
      console.warn('Socket is not connected.');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage(newMessage);
    setNewMessage('');
    setIsTyping(true);
  };

  const handleAttachment = () => {
    console.log('File attachment clicked');
  };

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
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">
            Support Chat ID: {connectionId}
          </Typography>
          <Typography variant="body2">
            We typically respond within a few minutes
          </Typography>
        </Box>
        <Divider />

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
                      maxWidth: '80%',
                      bgcolor: message.sender === 'user' ? 'primary.light' : 'white',
                      color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <ReactMarkdown>
                      {message.message}
                    </ReactMarkdown>
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
            
            {/* Streaming message */}
            {currentStreamingMessage && (
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: 1,
                }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>S</Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: 'white',
                      borderRadius: 2,
                    }}
                  >
                    <ReactMarkdown>
                      {currentStreamingMessage}
                    </ReactMarkdown>
                  </Paper>
                </Box>
              </ListItem>
            )}
          </List>
          
          {isTyping && !currentStreamingMessage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Support is typing...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

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
              inputProps={{ maxLength: 200 }}
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
