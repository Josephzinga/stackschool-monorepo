"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.api = void 0;
exports.setApiBaseUrl = setApiBaseUrl;
exports.getApiBaseUrl = getApiBaseUrl;
exports.setHeaders = setHeaders;
exports.parseAxiosError = parseAxiosError;
const axios_1 = __importDefault(require("axios"));
const URL = process.env.NEXT_PUBLIC_API_URL || 'http://api/4000';
exports.api = axios_1.default.create({
    baseURL: `${URL.replace(/\/$/, '')}`,
    withCredentials: true,
});
function setApiBaseUrl(baseUrl) {
    const cleaned = baseUrl.replace(/\/$/, '');
    exports.api.defaults.baseURL = `${cleaned}`;
}
function getApiBaseUrl() {
    return exports.api.defaults.baseURL;
}
function setHeaders(headers) {
    exports.api.defaults.headers = headers;
}
class ApiError extends Error {
    status;
    data;
    ok;
    constructor(payload) {
        super(payload.message);
        this.name = 'ApiError';
        this.status = payload.status ?? null;
        this.data = payload.data;
        this.ok = payload.ok ?? false;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
function parseAxiosError(err) {
    const status = err?.response?.status ?? null;
    const data = err?.response?.data ?? null;
    const message = data?.message || err?.message || 'Erreur réseau';
    return new ApiError({ status, message, data, ok: false });
}
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        }
        else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
exports.api.interceptors.response.use((res) => res, async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/api/auth/refresh')) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                return (0, exports.api)(originalRequest);
            })
                .catch((err) => {
                return Promise.reject(parseAxiosError(err));
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            await exports.api.post('/api/auth/refresh');
            processQueue(null);
            isRefreshing = false;
            return (0, exports.api)(originalRequest);
        }
        catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;
            if (typeof window !== 'undefined' && window.location) {
            }
            return Promise.reject(parseAxiosError(refreshError));
        }
    }
    return Promise.reject(parseAxiosError(err));
});
exports.default = exports.api;
//# sourceMappingURL=api.js.map