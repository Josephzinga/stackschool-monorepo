import { api, getApiBaseUrl, setApiBaseUrl } from '../../lib/api';
import type { LoginFormType, RegisterFormType } from '../../auth/auth.schema';

export const authServices = {
  setBaseUrl: (url: string) => {
    setApiBaseUrl(url);
  },

  getApiBaseUrl: () => {
    return getApiBaseUrl();
  },

  // auth routes
  login: async (data: LoginFormType) => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterFormType) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },

  _logout: async () => {
    const res = await api.post('/api/auth/logout');
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },

  // password reset flow
  forgotPassword: async (identifier: string) => {
    const res = await api.post('/api/auth/forgot-password', { identifier });
    return res.data;
  },

  resendCode: async (tempToken?: string | null) => {
    const res = await api.post('/api/auth/resend-code', { tempToken });
    return res.data;
  },

  verifyCode: async (code: string, tempToken?: string | null) => {
    const res = await api.post('/api/auth/verify-code', { code, tempToken });
    return res.data;
  },

  resetPassword: async (
    token: string | null,
    password: string,
    confirm: string,
  ) => {
    const res = await api.post(`/api/auth/reset-password?token=${token}`, {
      password,
      confirm,
    });
    return res.data;
  },

  // profile
  updateProfile: async (data: any) => {
    const res = await api.put('/api/profile', data);
    return res.data;
  },

  // refresh token or get new session
  refresh: async () => {
    const res = await api.post('/api/auth/refresh');
    return res.data;
  },

  // social (get redirect url)
  socialRedirect: async (provider: string) => {
    const res = await api.get(`/api/auth/${provider}`);
    return res.data;
  },
  checkField: async (field: string, value: string) => {
    const res = await api.get('/validate/user-field', {
      params: {
        [field]: value,
      },
    });
    return res.data;
  },
  completeProfile: async (data: any) => {
    const res = await api.post('/complete-profile', data);
    return res.data;
  },
};
