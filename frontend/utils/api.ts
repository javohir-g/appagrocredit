import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth role to requests (v1.0: No Auth)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const role = localStorage.getItem('userRole');
        if (role) {
            config.headers['X-Role'] = role;
        }
    }
    return config;
});

export default api;
