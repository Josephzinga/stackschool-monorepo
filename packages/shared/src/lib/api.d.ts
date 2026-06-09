import axios from 'axios';
import { ApiErrorPayload } from '../types/api-response.type';
export declare const api: axios.AxiosInstance;
export declare function setApiBaseUrl(baseUrl: string): void;
export declare function getApiBaseUrl(): string | undefined;
export declare function setHeaders(headers: any): void;
export declare class ApiError extends Error {
    status?: number | null;
    data?: any;
    ok: boolean;
    constructor(payload: ApiErrorPayload);
}
export declare function parseAxiosError(err: any): ApiError;
export default api;
//# sourceMappingURL=api.d.ts.map