"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserFieldSchema = exports.resetPasswordApiSchema = void 0;
const shared_1 = require("@stackschool/shared");
exports.resetPasswordApiSchema = shared_1.z.object({
    token: shared_1.z.string().min(16, 'Token invalide').optional(),
    password: shared_1.z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
        .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.'),
});
exports.validateUserFieldSchema = shared_1.z.object({
    email: shared_1.z
        .string()
        .email({
        pattern: shared_1.z.regexes.email,
        message: "'Veuillez entrer un email valide.'",
    })
        .optional(),
    phoneNumber: shared_1.z
        .string()
        .trim()
        .transform((val) => val.replace(/\s+/g, ''))
        .refine((val) => /^\+?[0-9]{8,15}$/.test(val), {
        message: 'Numéro invalide (format international recommandé, ex: +223...)',
    })
        .optional(),
    selfCheck: shared_1.z.boolean().optional(),
});
//# sourceMappingURL=validation-schema.js.map