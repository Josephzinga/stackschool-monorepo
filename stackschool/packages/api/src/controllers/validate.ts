import {
  loginFormSchema,
  LoginFormType,
  z,
  ZodSchema,
} from "@stackschool/shared";
import type { Response, Request, NextFunction } from "express";

export const validateBody = (schemas: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schemas.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        ok: false,
        message: "Erreur de validation",
        errors,
      });
    }

    req.body = result.data;
    next();
  };
};

export const validateLogin = (data: LoginFormType) => {
  const result = loginFormSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error?.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return errors;
  }
};
