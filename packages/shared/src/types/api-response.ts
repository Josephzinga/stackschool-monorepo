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

export class ServiceError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}
