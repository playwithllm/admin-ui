import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4001',
  withCredentials: true,
});

export default api;
