import React, { useState, useEffect } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Button, TextField, Typography, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { Card, CardContent, Divider } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';

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
  const [refetch, setRefetch] = useState<boolean>(false);
  const [curlCommand, setCurlCommand] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

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
  }, [refetch]);

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleNewPrompt = () => {
    setSelectedPrompt(null);
    setPromptText('');
    setResponse('');
    setError(null);
    setApiKey('');
    setCurlCommand('');
    setRefetch(prev => !prev);
  };

  const generateCurlCommand = (promptText: string, apiKey: string): string => {
    const baseUrl = import.meta.env.REACT_APP_API_URL || 'https://api.playwithllm.com';
    return `curl --location '${baseUrl}/api/generate' \\
--header 'x-api-key: ${apiKey}' \\
--header 'Content-Type: application/json' \\
--data '{
    "prompt": "${promptText.replace(/"/g, '\\"')}"
}'`;
  };

  const handleSubmit = async () => {
    setResponse('');
    setError(null);
    // Generate and set curl command
    setCurlCommand(generateCurlCommand(promptText, apiKey));
  
    try {
      await api.post('/api/generate', 
        { prompt: promptText }, 
        { 
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
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
      setResponse(prev => prev);
    } finally {
      console.log('Request completed.');
      setRefetch(prev => !prev);
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
                <TextField
                  label="Enter your API key"
                  variant="outlined"
                  fullWidth
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth style={{ marginTop: '10px' }} disabled={!promptText || !apiKey || response}>
                  Submit
                </Button>
                
                {curlCommand && (
                  <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
                      Equivalent cURL command:
                      <IconButton
                        aria-label="copy"
                        size="small"
                        onClick={() => navigator.clipboard.writeText(curlCommand)}
                        style={{ marginLeft: '8px' }}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Typography>
                    <Typography 
                      component="pre" 
                      style={{ 
                        overflowX: 'auto', 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-all',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      {curlCommand}
                    </Typography>
                  </Box>
                )}

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
