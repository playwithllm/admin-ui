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
import imageCompression from 'browser-image-compression';

import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../hooks/useAuth';

interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
  attachment?: {
    url: string;
    type: string;
  };
}

export const SupportPage = () => {
  const { user } = useAuth();
  const { socket } = useWebSocket();
  // console.log('SupportPage:', {socket, user});
  const connectionId = socket?.id;
  const isConnected = socket?.connected;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [disableMessage, setDisableMessage] = useState('');
  const messageBuffer = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

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

    console.log('Setting up socket event listeners...');

    const handleSocketMessage = (data: any) => {
      try {
        console.log('Received websocket data:', data);
        

        // OLLAMA responses
        // if (data.type === 'chunk' && data.result?.message?.content) {          
        //   // Only append new content if it's not already in the buffer
        //   const newContent = data.result.message.content;
        //   if (!messageBuffer.current.endsWith(newContent)) {
        //     messageBuffer.current += newContent;
        //     setCurrentStreamingMessage(messageBuffer.current);
        //   }
        // }
        // else if (data.type === 'end' && messageBuffer.current) {
        //   // Message complete, add to messages list
        //   const completedMessage: ChatMessage = {
        //     id: Date.now(),
        //     sender: 'support',
        //     message: messageBuffer.current,
        //     timestamp: new Date().toISOString(),
        //     read: true,
        //   };
          
        //   setMessages(prev => [...prev, completedMessage]);
        //   messageBuffer.current = '';
        //   setCurrentStreamingMessage('');
        //   setIsTyping(false);
        // }
        // else if (data.type === 'disable') {
        //   setIsChatDisabled(true);
        //   setDisableMessage(data.message);
        //   setIsTyping(false);
        //   return;
        // }

        // OPENAI responses
         // Handle OpenAI responses
      if (data.type === 'chunk' && data.result?.choices?.[0]?.delta?.content) {
        // Extract content from OpenAI format
        const newContent = data.result.choices[0].delta.content;
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
        else if (data.type === 'disable') {
          setIsChatDisabled(true);
        setDisableMessage(data.message);
        setIsTyping(false);
          return;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    // Set up event listeners
    socket.on('disableChat', (data) => handleSocketMessage({ type: 'disable', ...data }));
    socket.on('inferenceResponseChunk', (data) => handleSocketMessage({ type: 'chunk', ...data }));
    socket.on('inferenceResponseEnd', () => handleSocketMessage({ type: 'end' }));

    return () => {
      socket.off('disableChat');
      socket.off('inferenceResponseChunk');
      socket.off('inferenceResponseEnd');
    };
  }, [socket?.id]);

  const sendMessage = (msg: string, img: string | null) => {
    console.log('Sending message:', msg, 'with image:', img);
    if (socket && isConnected) {
      socket.emit('inferenceRequest', { message: msg, imageBase64: img });
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
    sendMessage(newMessage, imageBase64);
    setNewMessage('');
    setImageBase64(null);
    setIsTyping(true);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      // Compress the image
      const options = {
        maxSizeMB: 0.5,              // Max file size in MB
        maxWidthOrHeight: 512,    // Compress to this resolution
        useWebWorker: true,        // Use web worker for better performance
        fileType: file.type,       // Maintain original file type
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');

      // Convert compressed image to base64
      const base64Data = await convertImageToBase64(compressedFile);
      setImageBase64(base64Data);

      // Create preview URL from compressed file
      const imageUrl = URL.createObjectURL(compressedFile);

      // Create message with attachment
      const imageMessage: ChatMessage = {
        id: Date.now(),
        sender: 'user',
        message: '',
        timestamp: new Date().toISOString(),
        read: true,
        attachment: {
          url: imageUrl,
          type: file.type,
        },
      };

      setMessages(prev => [...prev, imageMessage]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = (message: ChatMessage) => {
    if (message.attachment) {
      return (
        <Box>
          <img 
            src={message.attachment.url} 
            alt="Attached image"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              borderRadius: '4px' 
            }} 
          />
          {message.message && (
            <Typography sx={{ mt: 1 }}>
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </Typography>
          )}
        </Box>
      );
    }
    return <ReactMarkdown>{message.message}</ReactMarkdown>;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 140px)' }}>
      <Alert severity="warning" sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 1000 }}>
        The chat messages are unencrypted and stored in database. Also the images are stored in server and will be deleted after 24 hours. So please do not share any sensitive information.
      </Alert>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">
            Support Chat ID: {connectionId}
          </Typography>
          <Typography variant="body2" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            mt: 1,
            width: 'fit-content'
          }}>
            🤖 You are chatting with an LLM model: <Typography variant="body1" sx={{ fontWeight: 'bold' }}>InternVL2_5-1B</Typography>
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
                    {message.sender === 'user' ? user?.displayName : 'S'}
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
                    {renderMessageContent(message)}
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

            {/* Chat Disabled Message */}
            {isChatDisabled && (
              <ListItem>
                <Typography variant="body2" color="error">
                  {disableMessage}
                </Typography>
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
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
              disabled={isChatDisabled}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={isChatDisabled || !newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};
