import axios from "axios";
import { config } from "dotenv";

const URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: `${URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
});

export function setApiBaseUrl(baseUrl: string) {
  const cleaned = baseUrl.replace(/\/$/, "");
  api.defaults.baseURL = `${cleaned}/api`;
}

export type ApiErrorPayload = {
  status?: number | null;
  message: string;
  data?: any;
};

export class ApiError extends Error {
  status?: number | null;
  data?: any;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status ?? null;
    this.data = payload.data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function parseAxiosError(err: any): ApiError {
  // Axios error shape
  const status = err?.response?.status ?? null;
  const data = err?.response?.data ?? null;
  const message = data?.message || err?.message || "Erreur réseau";
  return new ApiError({ status, message, data });
}

// Interceptor: normalize errors so callers always receive ApiError
api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(parseAxiosError(err));
  }
);

export default api;
