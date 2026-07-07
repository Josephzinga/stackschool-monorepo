export const AUTH_PATTERNS = {
  VALIDATE_CREDENTIALS: 'auth.validate_credentials',
  FIND_FULL_USER: 'auth.find_full_user',
  CREATE_USER: 'auth.create_user',
  CREATE_USER_SESSION: 'auth.create_user_session',
} as const;

export const AUTH_EVENTS = {
  USER_UPDATED: 'auth.user_updated',
} as const;
