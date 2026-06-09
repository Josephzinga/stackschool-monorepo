"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const api_1 = require("../../lib/api");
exports.authServices = {
    setBaseUrl: (url) => {
        (0, api_1.setApiBaseUrl)(url);
    },
    getApiBaseUrl: () => {
        return (0, api_1.getApiBaseUrl)();
    },
    login: async (data) => {
        const res = await api_1.api.post('/api/auth/login', data);
        return res.data;
    },
    register: async (data) => {
        const res = await api_1.api.post('/api/auth/register', data);
        return res.data;
    },
    _logout: async () => {
        const res = await api_1.api.post('/api/auth/logout');
        return res.data;
    },
    getMe: async () => {
        const res = await api_1.api.get('/api/auth/me');
        return res.data;
    },
    forgotPassword: async (identifier) => {
        const res = await api_1.api.post('/api/auth/forgot-password', { identifier });
        return res.data;
    },
    resendCode: async (tempToken) => {
        const res = await api_1.api.post('/api/auth/resend-code', { tempToken });
        return res.data;
    },
    verifyCode: async (code, tempToken) => {
        const res = await api_1.api.post('/api/auth/verify-code', { code, tempToken });
        return res.data;
    },
    resetPassword: async (token, password, confirm) => {
        const res = await api_1.api.post('/api/auth/reset-password', {
            token,
            password,
            confirm,
        });
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await api_1.api.put('/api/profile', data);
        return res.data;
    },
    refresh: async () => {
        const res = await api_1.api.post('/api/auth/refresh');
        return res.data;
    },
    socialRedirect: async (provider) => {
        const res = await api_1.api.get(`/api/auth/${provider}`);
        return res.data;
    },
    checkField: async (field, value) => {
        const res = await api_1.api.get('/validate/user-field', {
            params: {
                [field]: value,
            },
        });
        return res.data;
    },
    completeProfile: async (data) => {
        const res = await api_1.api.post('/complete-profile', data);
        return res.data;
    },
};
//# sourceMappingURL=authServices.js.map