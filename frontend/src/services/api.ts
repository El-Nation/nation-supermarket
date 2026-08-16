import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5002/api',
    withCredentials: true, // Ensures cookies (JWT) are sent with every request
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
