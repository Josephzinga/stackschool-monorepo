import { Request, Response, NextFunction } from "express";

import { uploadedImageSchema } from "../validations/upload-profile-picture";
import { createServiceError } from "../utils/api-response";
export function validateUploadedImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    return res
      .status(400)
      .json({ ok: false, message: "Aucun fichier uploadé" });
  }

  const result = uploadedImageSchema.safeParse(req.file);
  if (!result.success) {
    createServiceError(result.error.message, 401, result.error.issues);
  }

  next();
}
