import { NextFunction, Request, Response } from 'express';
import { ServiceError, ZodError } from '@stackschool/shared';

export function sendApiResponse(
  res: Response,
  statusCode: number,
  data: any = {},

  ok: boolean = false,
) {
  return res.status(statusCode).json({
    ok,
    ...data,
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('Erreur dans le middleware', err);
  console.log("Message d'erreur dans le middleware handleError", err?.message);
  if (err instanceof ServiceError) {
    return sendApiResponse(res, err.satusCode, {
      message: err.message,
      details: err.details,
    });
  }

  sendApiResponse(res, 400, { error: err.message });

  if (err instanceof ZodError) {
    return sendApiResponse(res, 400, {
      message: "Données d'entrée non valides",
      issues: err.issues,
    });
  }

  return sendApiResponse(res, 500, { message: 'Erreur interne du serveur' });
}
