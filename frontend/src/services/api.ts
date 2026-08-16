import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
    withCredentials: true, // Ensures cookies (JWT) are sent with every request
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
