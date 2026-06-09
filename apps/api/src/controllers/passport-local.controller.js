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
exports.default = handleLocalAuth;
const bcrypt = __importStar(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const shared_1 = require("@stackschool/shared");
const validate_schema_util_1 = require("../utils/validate-schema.util");
const account_analysis_util_1 = require("../utils/account-analysis.util");
async function handleLocalAuth(identifier, password, done) {
    const { data, errors, success } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.loginFormSchema, {
        identifier,
        password,
    });
    if (!success) {
        return done(errors);
    }
    try {
        const input = data?.identifier;
        const validPassword = data?.password;
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                isActive: true,
                OR: [
                    { email: { equals: input, mode: 'insensitive' } },
                    { phoneNumber: input },
                    { username: { equals: input, mode: 'insensitive' } },
                ],
            },
            include: { profile: true, Account: true },
        });
        if (!user) {
            return done(null, false, { message: 'Identifiants invalides' });
        }
        const { hasLocalPassword, socialProviders, isSocialOnly } = (0, account_analysis_util_1.analyzeUserAccounts)(user);
        if (isSocialOnly) {
            return done(null, false, {
                message: `Ce compte utilise : ${socialProviders.join(', ')}. Veuillez vous connecter avec.`,
                isSocialOnly: true,
                providers: socialProviders,
            });
        }
        if (!hasLocalPassword) {
            return done(null, false, {
                message: 'Configuration du compte invalide (pas de mot de passe).',
            });
        }
        const match = await bcrypt.compare(validPassword, user.password);
        if (!match) {
            return done(null, false, { message: 'Identifiants invalides' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}
//# sourceMappingURL=passport-local.controller.js.map