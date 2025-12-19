import { Request, Response, NextFunction } from 'express'
import { ServiceError } from '@stackschool/shared'
import { ZodError } from '@stackschool/shared'

export function sendApiResponse(
  res: Response,
  statusCode: number,
  data: object,

  ok: boolean = false,
) {
  return res.status(statusCode).json({
    ok,
    ...data,
  })
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err)

  if (err instanceof ServiceError) {
    return sendApiResponse(res, err.satusCode, {
      message: err.message,
      details: err.details,
    })
  }

  if (err instanceof ZodError) {
    return sendApiResponse(res, 400, {
      message: "Données d'entrée non valides",
      issues: err.issues,
    })
  }

  return sendApiResponse(res, 500, { message: 'Erreur interne du serveur' })
}
