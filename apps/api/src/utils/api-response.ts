import { ServiceError, type ApiResponse } from "@stackschool/shared/src/types";
import type { Response } from "express";

export function createServiceError(
  message: string,
  statusCode: number = 500,
  details?: any
): ServiceError {
  return new ServiceError(message, statusCode, details);
}
