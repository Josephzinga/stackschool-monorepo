import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ServiceError } from '@stackschool/shared';

export function sendApiResponse(
  res: Response,
  statusCode: number,
  data: any = {},
  ok: boolean = false,
) {
  // Évite d'envoyer deux fois la réponse
  if (res.headersSent) {
    return;
  }
  return res.status(statusCode).json({
    ok,
    ...data,
  });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log de l'erreur côté serveur pour le débogage (toujours utile)
  console.error('🔥 Erreur capturée :', err);

  // 1. Gestion des erreurs ServiceError (erreurs métier explicites)
  // On considère que le message d'une ServiceError est sûr à afficher au client
  if (err instanceof ServiceError) {
    return sendApiResponse(res, err.statusCode, {
      message: err.message,
      details: err.details,
    });
  }

  // 2. Gestion des erreurs Zod brutes
  if (err instanceof ZodError) {
    return sendApiResponse(res, 400, {
      message: "Données d'entrée non valides",
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // 3. Gestion des erreurs de validation personnalisées (tableau)
  if (Array.isArray(err) && err.length > 0 && err[0].field && err[0].message) {
    return sendApiResponse(res, 400, {
      message: 'Erreur de validation',
      issues: err,
    });
  }

  // 4. Gestion des erreurs Passport ou erreurs avec message explicite mais sans statusCode
  // Attention : certaines erreurs système peuvent avoir un message sensible.
  // On filtre ici pour ne laisser passer que ce qui ressemble à une erreur fonctionnelle.
  if (err.message && !err.statusCode && (err.name === 'AuthenticationError' || err.type === 'auth')) {
     return sendApiResponse(res, 401, { message: err.message });
  }

  // 5. Erreur par défaut (500) - Erreur interne inattendue
  // EN PRODUCTION : On ne renvoie JAMAIS les détails de l'erreur technique
  // EN DEV : On peut renvoyer les détails pour aider au débogage
  const isProduction = process.env.NODE_ENV === 'production';
  
  return sendApiResponse(res, 500, {
    message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    // En dev, on ajoute l'erreur originale pour debug facile côté client
    ...(isProduction ? {} : { originalError: err.message, stack: err.stack }),
  });
}
