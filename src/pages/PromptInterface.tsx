import React, { useState, useEffect } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Button, TextField, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { Card, CardContent, CircularProgress, Divider } from '@mui/material';

interface Prompt {
  _id: string;
  prompt: string;
  status: string;
  result: string | null;
  error: string | null;
  modelName: string;
  inputTime: string;
  isChatMessage: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  response: string;
  userId: string;
  websocketId: string;
  clientIp: string;  
}

export const PromptInterface: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [response, setResponse] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [error, setError] = useState<any | null>(null);

  // load prompts from the server
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await api.get('/api/v1/inference/search');
        setPrompts(response.data);
      } catch (error) {
        console.error('Error loading prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    // ...existing code to load prompt details...
  };

  const handleNewPrompt = () => {
    setSelectedPrompt(null);
    setPromptText('');
    setResponse('');
  };


  const handleSubmit = async () => {
    setResponse('');
  
    try {
      await api.post('/api/v1/inference/create', 
        { prompt: promptText }, 
        { 
          responseType: 'text',
          onDownloadProgress: (progressEvent) => {            
            const chunk = progressEvent.event.currentTarget.response;
            console.log('Progress:', {
              loaded: progressEvent.loaded,
              chunk: chunk,
              response,
            });
            if (chunk) {
              setResponse(chunk);
            }
          }
        }
      );
      
    } catch (axiosError: any) {
      console.error('Error during streaming:', axiosError);
      setError(JSON.parse(axiosError.response.data));
      setResponse(prev => prev + '\nError occurred while processing request.');
    } finally {
      console.log('Request completed.');
      // setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Button variant="contained" onClick={handleNewPrompt} fullWidth style={{ marginBottom: '20px' }}>
            New Prompt
          </Button>
          <Box style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <List>
              {prompts.map((prompt, index) => (
                <React.Fragment key={prompt._id}>
                  <ListItem 
                    button 
                    onClick={() => handleSelectPrompt(prompt)} 
                    selected={selectedPrompt?._id === prompt._id}
                    sx={{
                      bgcolor: selectedPrompt?._id === prompt._id ? 'action.selected' : 'transparent',
                    }}
                  >
                    <ListItemText primary={prompt.prompt} />
                  </ListItem>
                  {index < prompts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
         {
          selectedPrompt ? (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>{selectedPrompt.prompt}</Typography>
                <Typography variant="subtitle1">Response:</Typography>
                <ReactMarkdown>
                  {selectedPrompt.response}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <TextField
                  label="Enter your prompt"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth style={{ marginTop: '10px' }}>
                  Submit
                </Button>
                <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                  Response:
                </Typography>
                <ReactMarkdown>
                  {response}
                </ReactMarkdown>
                {error && (
                  <Typography variant="subtitle1" color="error">
                    <pre>{error.errorMessage}</pre>
                  </Typography>
                )}
              </CardContent>
            </Card>
          )
         }
        </Grid>
      </Grid>
    </Box>
  );
};
