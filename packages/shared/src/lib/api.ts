import axios from 'axios';
import { ApiErrorPayload } from '../types/api-response.type';

const URL = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${URL.replace(/\/$/, '')}`,
  withCredentials: true,
});

export function setApiBaseUrl(baseUrl: string) {
  const cleaned = baseUrl.replace(/\/$/, '');
  api.defaults.baseURL = `${cleaned}`;
}
export function getApiBaseUrl() {
  return api.defaults.baseURL;
}

export class ApiError extends Error {
  status?: number | null;
  data?: any;
  ok: boolean;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status ?? null;
    this.data = payload.data;
    this.ok = payload.ok ?? false;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function parseAxiosError(err: any): ApiError {
  // Axios error shape
  const status = err?.response?.status ?? null;
  const data = err?.response?.data ?? null;
  const message = data?.message || err?.message || 'Erreur réseau';
  return new ApiError({ status, message, data, ok: false });
}

// --- Logique de Refresh Token ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor: normalize errors so callers always receive ApiError
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Si erreur 401 et qu'on n'a pas déjà essayé de refresh
    // On exclut aussi la route de refresh elle-même pour éviter une boucle infinie

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, on met la requête en file d'attente
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(parseAxiosError(err));
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Appel à la route de refresh
        // Note: Assurez-vous que cette route existe et fonctionne avec les cookies httpOnly
        await api.post('/api/auth/refresh');

        processQueue(null);
        isRefreshing = false;

        // On rejoue la requête initiale
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Si le refresh échoue, on redirige vers le login (si on est dans un navigateur)
        if (typeof window !== 'undefined' && window.location) {
          // On peut ajouter un paramètre pour rediriger après login
          // window.location.href = '/auth/login';
          // Pour l'instant on laisse l'app gérer la redirection via l'état global (user null)
        }

        return Promise.reject(parseAxiosError(refreshError));
      }
    }

    return Promise.reject(parseAxiosError(err));
  },
);

export default api;
