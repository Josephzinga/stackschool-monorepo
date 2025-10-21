import { body } from "express-validator";

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
