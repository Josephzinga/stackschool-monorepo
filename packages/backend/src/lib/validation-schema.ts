import { body } from "express-validator";
import { z } from "@stackschool/shared";

export const registerValidator = [
  body("username")
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Le nom d'utilisateur doit contenir entre 3 et 30 caractères."
    ),

  body("password")
    .isString()
    .matches(/[A-Z]/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule.")
    .matches(/[0-9]/)
    .withMessage("Le mot de passe doit contenir au moins un chiffre.")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Le mot de passe doit contenir au moins un caractère spécial.")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),

  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Adresse e-mail invalide."),

  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage("Numéro de téléphone invalide."),
];
export const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Le token de réinitialisation est requis")
    .isLength({ min: 16 })
    .withMessage("Token invalide"),
  body("password")
    .isString()
    .matches(/[A-Z]/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule.")
    .matches(/[0-9]/)
    .withMessage("Le mot de passe doit contenir au moins un chiffre.")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Le mot de passe doit contenir au moins un caractère spécial.")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
];

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "L'identifiant doit contenir au moins 3 caractères"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
