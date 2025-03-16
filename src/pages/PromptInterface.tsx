import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Button, TextField, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { Card, CardContent, Divider } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import imageCompression from 'browser-image-compression';

// API URL Constants
const API_URLS = {
  MODELS: '/api/v1/models/available',
  PROMPTS: '/api/v1/inference/search',
  GENERATE: '/api/v1/inference/generate',
  DEFAULT_BASE_URL: 'https://api.playwithllm.com',
};

// Content type constants
const CONTENT_TYPES = {
  JSON: 'Content-Type: application/json',
  JPEG_BASE64_PREFIX: 'data:image/jpeg;base64,',
};

// Header Keys
const HEADER_KEYS = {
  CONTENT_TYPE: 'Content-Type',
  API_KEY: 'x-api-key',
};

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
  multimodal?: boolean;
  enabled?: boolean;
  capabilities?: Record<string, number>;
}

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
  imageBase64?: string;
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
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<ModelConfig[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [useDefaultApiKey, setUseDefaultApiKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load available models from the API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        const response = await api.get(API_URLS.MODELS);
        const models = response.data;

        setAvailableModels(models);

        // Set default model if one isn't already selected
        if (!selectedModel && models.length > 0) {
          setSelectedModel(models[0].id);
        }
      } catch (error) {
        console.error('Error loading available models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  // load prompts from the server
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await api.get(API_URLS.PROMPTS);
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
    setUseDefaultApiKey(false);
    // Reset to first available model or keep existing selection
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    }
    setRefetch(prev => !prev);
    setIsSubmitting(false);
  };

  const generateCurlCommand = (promptText: string, apiKey: string, model: string, useDefaultKey: boolean, imageBase64: string | null): string => {
    const baseUrl = import.meta.env.VITE_API_URL || API_URLS.DEFAULT_BASE_URL;
    
    // Create message content based on whether an image is attached
    let messageContent;
    if (imageBase64) {
      // For multimodal models, include both text and image
      messageContent = `[
        {
          "type": "text",
          "text": "${promptText.replace(/"/g, '\\"')}"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,${imageBase64}"
          }
        }
      ]`;
    } else {
      // For text-only prompts
      messageContent = `"${promptText.replace(/"/g, '\\"')}"`;
    }
  
    if (useDefaultKey) {
      return `curl ${baseUrl}${API_URLS.GENERATE} \\
    -H "${CONTENT_TYPES.JSON}" \\
    -d '{
    "model": "${model}",
    "messages": [
      {
        "role": "user",
        "content": ${messageContent}
      }
    ],
    "stream": true,
    "useDefaultApiKey": true
  }'`;
    }
  
    return `curl ${baseUrl}${API_URLS.GENERATE} \\
    -H "${CONTENT_TYPES.JSON}" \\
    -H "${HEADER_KEYS.API_KEY}: ${apiKey}" \\
    -d '{
    "model": "${model}",
    "messages": [
      {
        "role": "user",
        "content": ${messageContent}
      }
    ],
    "stream": true
  }'`;
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: file.type,
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');

      const base64Data = await convertImageToBase64(compressedFile);
      setAttachedImage(base64Data);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setResponse('');
    setError(null);
    setIsSubmitting(true);
    // Generate and set curl command
    setCurlCommand(generateCurlCommand(promptText, apiKey, selectedModel, useDefaultApiKey, attachedImage));

    try {
      const headers: Record<string, string> = {
        [HEADER_KEYS.CONTENT_TYPE]: 'application/json'
      };

      // Only include API key in headers if not using default
      if (!useDefaultApiKey && apiKey) {
        headers[HEADER_KEYS.API_KEY] = apiKey;
      }

      await api.post(
        API_URLS.GENERATE,
        {
          prompt: promptText,
          model: selectedModel,
          useDefaultApiKey: useDefaultApiKey,
          image: `data:image/jpeg;base64,${attachedImage}`,
        },
        {
          headers,
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

      // Clear the attached image after successful submission
      setAttachedImage(null);
    } catch (axiosError: any) {
      console.error('Error during streaming:', axiosError);
      setError(JSON.parse(axiosError.response.data));
      setResponse(prev => prev);
    } finally {
      console.log('Request completed.');
      setRefetch(prev => !prev);
      setIsSubmitting(false);
    }
  };

  const ImageViewer: React.FC<{ imageBase64: string }> = ({ imageBase64 }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!imageBase64) return null;
    
    return (
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
          marginBottom: 2
        }}
        onClick={() => setIsFullscreen(!isFullscreen)}
      >
        <img
          src={`${imageBase64}`}
          alt="Generated content"
          style={{
            maxWidth: isFullscreen ? '90vw' : '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        {isFullscreen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setIsFullscreen(false)}
          >
            <img
              src={imageBase64}
              alt="Generated content fullscreen"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Box>
    );
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
                    onClick={() => handleSelectPrompt(prompt)}
                    sx={{
                      bgcolor: selectedPrompt?._id === prompt._id ? 'action.selected' : 'transparent',
                      cursor: 'pointer',
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
                  {selectedPrompt.imageBase64 && (
                    <ImageViewer imageBase64={selectedPrompt.imageBase64} />
                  )}
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

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => fileInputRef.current?.click()}
                      title="Attach image"
                    >
                      <AttachFileIcon />
                    </IconButton>
                    {attachedImage && (
                      <Typography variant="body2" color="primary">
                        Image attached
                      </Typography>
                    )}
                  </Box>

                  <FormControl fullWidth style={{ marginTop: '10px' }}>
                    <InputLabel id="model-select-label">Select Model</InputLabel>
                    <Select
                      labelId="model-select-label"
                      id="model-select"
                      value={selectedModel}
                      label="Select Model"
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={isLoadingModels}
                    >
                      {availableModels.map((model) => (
                        <MenuItem key={model.id} value={model.id}>
                          {model.name} {model.multimodal ? '(multimodal)' : ''}
                          {model.description && (
                            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                              - {model.description}
                            </Typography>
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useDefaultApiKey}
                        onChange={(e) => setUseDefaultApiKey(e.target.checked)}
                      />
                    }
                    label="Use Default API Key"
                    style={{ marginTop: '10px', display: 'block' }}
                  />

                  <TextField
                    label="Enter your API key"
                    variant="outlined"
                    fullWidth
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ marginTop: '10px' }}
                    disabled={useDefaultApiKey}
                    helperText={useDefaultApiKey ? "Using server's default API key" : ""}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    style={{ marginTop: '10px' }}
                    disabled={
                      isSubmitting ||
                      !promptText ||
                      (!apiKey && !useDefaultApiKey) ||
                      Boolean(response) ||
                      isLoadingModels ||
                      !selectedModel
                    }
                  >
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

                  {attachedImage && (
                    <Box mt={2}>
                      <img
                        src={`data:image/jpeg;base64,${attachedImage}`}
                        alt="Attached image"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => setAttachedImage(null)}
                        sx={{ mt: 1 }}
                      >
                        Remove Image
                      </Button>
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
