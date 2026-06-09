export type ApiErrorPayload = {
    status?: number | null;
    message: string;
    data?: any;
    ok: boolean;
};
export type ApiResponse<T> = {
    data: T;
    status: number;
    ok: boolean;
    message?: string;
    error?: string;
};
export declare class ServiceError extends Error {
    statusCode: number;
    details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
//# sourceMappingURL=api-response.type.d.ts.map