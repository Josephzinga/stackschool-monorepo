import type { Request, Response, NextFunction } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res
    .status(401)
    .json({
      ok: false,
      message: "Utilisateur non authentifié veillez vous connécter",
    });
}
