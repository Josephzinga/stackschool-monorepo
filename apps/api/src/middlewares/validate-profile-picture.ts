import { NextFunction, Request, Response } from 'express';

import { uploadedImageSchema } from '../validations/upload-profile-picture';
import { createServiceError } from '../utils/api-errors';
import { safeValidateSchema } from '../utils/validate-schema.util';

export function validateUploadedImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('File', req?.file);
  if (!req.file) {
    return res
      .status(400)
      .json({ ok: false, message: 'Aucun fichier à uploadé' });
  }

  const { success, errors, data } = safeValidateSchema(uploadedImageSchema, {
    file: req.file,
    body: req.body,
  });
  if (!success) {
    createServiceError(
      errors?.[0]?.message || "Erreur de validation de l'image",
      401,
      errors,
    );
  }

  next();
}
