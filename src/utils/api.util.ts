import axios from 'axios'

const api = axios.create({
    baseURL: process.env.SERVER_API_URL || 'http://localhost:5050',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default api;