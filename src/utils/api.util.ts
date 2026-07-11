import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const API_URL =
    process.env.NEXT_PUBLIC_SERVER_API_URL ||
    "http://localhost:5050";

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponse {
    accessToken?: string;
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window === "undefined") {
            return config;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const isUnauthorized = error.response?.status === 401;
        const isRefreshRequest =
            originalRequest.url?.includes("/auth/refresh");

        if (
            !isUnauthorized ||
            originalRequest._retry ||
            isRefreshRequest
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshApi
                    .post<RefreshResponse | string>("/auth/refresh")
                    .then((response) => {
                        const responseData = response.data;

                        const accessToken =
                            typeof responseData === "string"
                                ? responseData
                                : responseData.accessToken;

                        if (!accessToken) {
                            throw new Error(
                                "Refresh response does not contain accessToken",
                            );
                        }

                        if (typeof window !== "undefined") {
                            localStorage.setItem(
                                "accessToken",
                                accessToken,
                            );
                        }

                        api.defaults.headers.common.Authorization =
                            `Bearer ${accessToken}`;

                        return accessToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const accessToken = await refreshPromise;

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
            }

            console.error(
                "Refresh token invalid, need login",
                refreshError,
            );

            return Promise.reject(refreshError);
        }
    },
);

export default api;