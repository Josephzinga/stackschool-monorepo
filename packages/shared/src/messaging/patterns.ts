export const AUTH_PATTERNS = {
  VALIDATE_CREDENTIALS: 'auth.validate_credentials',
  FIND_FULL_USER: 'auth.find_full_user',
  CREATE_USER: 'auth.create_user',
  CREATE_USER_SESSION: 'auth.create_user_session',
  FORGOT_PASSWORD: 'auth.forgot_password',
  RESET_PASSWORD: 'auth.reset_password',
  REFRESH_TOKEN: 'auth.refresh_token',
} as const;

export const AUTH_EVENTS = {
  USER_UPDATED: 'auth.user_updated',
  SEND_WHATSAPP_CODE: 'auth.send_whatsapp_code',
  SEND_EMAIL_LINK: 'auth.send_email_link',
} as const;
