import { get } from "http";
import api, { getApiBaseUrl, setApiBaseUrl } from "../../lib/api";
import {
  LoginFormType,
  RegisterFormType,
  ProfileType,
} from "../../validation/auth-schema";

export const authService = {
  setBaseUrl: (url: string) => {
    setApiBaseUrl(url);
  },

  getApiBaseUrl: () => {
    return getApiBaseUrl();
  },

  // auth routes
  login: async (data: LoginFormType) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterFormType) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  // password reset flow
  forgotPassword: async (identifier: string) => {
    const res = await api.post("/auth/forgot-password", { identifier });
    return res.data;
  },

  resendCode: async (tempToken: string | null) => {
    const res = await api.post("/auth/resend-code", { tempToken });
    return res.data;
  },

  verifyCode: async (code: string, tempToken: string | null) => {
    const res = await api.post("/auth/verify-code", { code, tempToken });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await api.post("/auth/reset-password", { token, password });
    return res.data;
  },

  // profile
  updateProfile: async (data: ProfileType) => {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  // refresh token or get new session
  refresh: async () => {
    const res = await api.get("/auth/refresh");
    return res.data;
  },

  // social (get redirect url)
  socialRedirect: async (provider: string) => {
    const res = await api.get(`/auth/${provider}`);
    return res.data;
  },
  checkField: async (field: string, value: string) => {
    const res = await api.get("/validate/user-field", {
      params: {
        [field]: value,
      },
    });
    return res.data;
  },
  completeProfile: async (data: any) => {
    const res = await api.post("/complete-profile", data);
    return res.data;
  },
};

export default authService;
