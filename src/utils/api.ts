import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.playwithllm.com',
  withCredentials: true,
});

export default api;
