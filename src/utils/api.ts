import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.playwithllm.com',
  withCredentials: true,
});

export default api;
