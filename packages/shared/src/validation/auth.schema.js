"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.VerifyCodeSchema = exports.registerFormSchema = exports.loginFormSchema = exports.GenderEnum = void 0;
const z = __importStar(require("zod"));
z.config(z.locales.fr());
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["Female"] = "FEMALE";
    GenderEnum["Male"] = "MALE";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
exports.loginFormSchema = z.object({
    identifier: z
        .string()
        .min(3, "L'identifiant est requis")
        .refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value))
            return true;
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (phoneRegex.test(value.replace(/\s/g, '')))
            return true;
        const usernameRegex = /^[a-zA-Z 0-9_]{3,20}$/;
        return usernameRegex.test(value);
    }, "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)"),
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
        .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.'),
});
exports.registerFormSchema = z
    .object({
    username: z
        .string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
        .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères.")
        .refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value))
            return true;
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (phoneRegex.test(value.replace(/\s/g, '')))
            return true;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(value);
    }, "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)"),
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
        .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.'),
    email: z
        .email({
        pattern: z.regexes.email,
        message: 'Veuillez entrer un email valide.',
    })
        .optional()
        .or(z.literal('')),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{8,15}$/, 'Numéro invalide (format international recommandé, ex: +223...)')
        .optional()
        .or(z.literal('')),
    confirm: z.string(),
})
    .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
        ctx.addIssue({
            path: ['confirm'],
            code: 'invalid_value',
            message: 'Les mots de passe ne correspondent pas.',
            values: [data.password, data.confirm],
        });
    }
    const hasEmail = data.email && data.email.trim() !== '';
    const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== '';
    if (!hasEmail && !hasPhone) {
        ctx.addIssue({
            code: 'invalid_value',
            path: ['email'],
            message: 'Veuillez fournir un email ou un numéro de téléphone.',
            values: [data.email, data.phoneNumber],
        });
        ctx.addIssue({
            code: 'invalid_value',
            path: ['phoneNumber'],
            message: 'Veuillez fournir un email ou un numéro de téléphone.',
            values: [data.email, data.phoneNumber],
        });
    }
});
exports.VerifyCodeSchema = z.object({
    code: z
        .string('Le code de vérification est requis.')
        .min(6, 'Le code doit contenir 6 chiffres.')
        .max(6, 'Le code doit contenir 6 chiffres.'),
});
exports.forgotPasswordSchema = z.object({
    identifier: z
        .string()
        .min(1, "L'identifiant est requis")
        .refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value))
            return true;
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (phoneRegex.test(value.replace(/\s/g, '')))
            return true;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (usernameRegex.test(value))
            return true;
        return false;
    }, "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)"),
});
exports.resetPasswordSchema = z
    .object({
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
        .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.'),
    confirm: z.string(),
})
    .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirm'],
            message: 'Les mots de passe ne correspondent pas.',
        });
    }
});
exports.profileSchema = z
    .object({
    firstname: z
        .string()
        .min(3, 'Le prénom doit contenir au moins 3 caractères.')
        .max(30, 'Le prénom ne peut pas dépasser 30 caractères.'),
    lastname: z
        .string()
        .min(3, 'Le nom doit contenir au moins 3 caractères')
        .max(30, 'Le nom  ne peut pas dépasser 30 caractères.'),
    gender: z.enum(GenderEnum, 'Veuillez sélectionner un genre valid. MALE ou FEMALE'),
    photo: z.string().nullish(),
    address: z
        .string()
        .min(5, "L'adresse doit être plus précise")
        .max(200, "L'adresse est trop longue"),
    email: z
        .email({
        pattern: z.regexes.email,
        message: 'Veuillez entrer un email valide.',
    })
        .optional()
        .or(z.literal('')),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{8,15}$/, 'Numéro invalide (format international recommandé, ex: +223...)')
        .optional()
        .or(z.literal('')),
})
    .superRefine((data, ctx) => {
    const hasEmail = data.email && data.email.trim() !== '';
    const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== '';
    if (!hasEmail && !hasPhone) {
        ctx.addIssue({
            code: 'custom',
            path: ['email'],
            message: 'Veuillez fournir un email ou un numéro de téléphone.',
        });
        ctx.addIssue({
            code: 'custom',
            path: ['phoneNumber'],
            message: 'Veuillez fournir un email ou un numéro de téléphone.',
        });
    }
});
//# sourceMappingURL=auth.schema.js.map