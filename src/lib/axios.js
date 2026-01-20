import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Adjust base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
