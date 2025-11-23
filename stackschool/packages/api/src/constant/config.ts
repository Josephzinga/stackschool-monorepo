export const JWT_SECRET = process.env.JWT_SECRET!;
export const TEMP_TOKEN_EXP = "10m"; // token temporaire après forgot-password
export const RESET_TOKEN_EXP_MINUTES = 15; // resetToken validation par munite
export const CODE_EXPIRES_MINUTES = 20; // expiration du code
export const RESEND_COOLDOWN_SECONDS = 60; // temps de renvoie de code en second
export const MAX_CODE_ATTEMPTS = 5; // nombre maximum du code à envoyer
