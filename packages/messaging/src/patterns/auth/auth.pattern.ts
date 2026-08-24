export const AUTH_PATTERNS = {
  VALIDATE_CREDENTIALS: 'auth.validate_credentials',
  FIND_FULL_USER: 'auth.find_full_user',
  CREATE_USER: 'auth.create_user',
  CREATE_USER_SESSION: 'auth.create_user_session',
  FORGOT_PASSWORD: 'auth.forgot_password',
  RESET_PASSWORD: 'auth.reset_password',
  REFRESH_TOKEN: 'auth.refresh_token',
  VERIFY_CODE: 'auth.verify_code',
  RESEND_CODE: 'auth.resend_code',
  VALIDATE_OAUTH_USER: 'auth.validate_oauth_user',
  VALIDATE_USER_FIELD: 'auth.validate_user_field',
  UPDATE_AVATAR: 'auth.update_avatar',
  UPDATE_PROFILE: 'auth.update_profile',
  PROFILE_UPDATED: 'auth.profile_updated',
  GET_PROFILE: 'auth.get_profile',
  UPDATE_USER_PROFILE : 'auth.update_user_profile',
  UPDATE_USER_AFTER_PROFILE_COMPLETED: "auth.update_user_after_profile_completed",
} as const;

export const AUTH_EVENTS = {
  USER_UPDATED: 'auth.user_updated',
  SEND_WHATSAPP_CODE: 'auth.send_whatsapp_code',
  SEND_EMAIL_LINK: 'auth.send_email_link',
} as const;
