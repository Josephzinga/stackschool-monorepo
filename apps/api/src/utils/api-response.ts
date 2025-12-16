import { ServiceError, type ApiResponse } from "@stackschool/shared/src/types";
import type { Response } from "express";

export function createApiResponse<T>(
  data: T,
  status: number,
  ok: boolean,
  message?: string,
  error?: string,
  res?: Response
): ApiResponse<T> {
  const payload: ApiResponse<T> = { data, status, ok, message, error };
  if (res) {
    res.status(status).json(payload);
  }
  return payload;
}

export function createServiceError(
  message: string,
  statusCode: number = 500,
  details?: any
): ServiceError {
  return new ServiceError(message, statusCode, details);
}
