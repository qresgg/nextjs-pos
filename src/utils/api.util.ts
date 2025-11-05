import axios from 'axios'

const api = axios.create({
    baseURL: process.env.SERVER_API_URL || 'http://localhost:5050',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})
api.interceptors.request.use(async (config) => {if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/auth/refresh');
                localStorage.setItem('accessToken', data);
                originalRequest.headers['Authorization'] = `Bearer ${data}`;
                return api(originalRequest);
            } catch (err) {
                console.error('Refresh token invalid, need login');
            }
        }

        return Promise.reject(error);
    }
);
export default api;