export const JWT_SECRET = process.env.JWT_SECRET!;
export const TEMP_TOKEN_EXP = '30m' as const; // token temporaire après forgot-password
export const RESET_TOKEN_EXP_MINUTES = 15 as const; // resetToken validation par minute
export const CODE_EXPIRES_MINUTES = 20 as const; // expiration du code
export const RESEND_COOLDOWN_SECONDS = 60 as const; // temps de renvoi de code en second
export const MAX_CODE_ATTEMPTS = 5 as const; // nombre maximum du code à envoyer
export const SESSION_EXPIRES_DAY = 25 as const; // nombre de jours de l'expiration de la session
