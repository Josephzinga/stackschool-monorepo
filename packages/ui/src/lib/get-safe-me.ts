import { authService, parseAxiosError, UserInMe } from '@stackschool/shared';

export async function getSafeMe(): Promise<UserInMe | null> {
  try {
    const me = await authService.getMe();
    if (me.ok) {
      return me.user ?? null;
    }
  } catch (err: any) {
    const status = err.status ?? parseAxiosError(err).status;

    if (status === 401) {
      try {
        const refresh = await authService.refresh();
        if (refresh.ok) {
          const me2 = await authService.getMe();
          return me2.user ?? null;
        }
      } catch (refreshErr) {
        const error = parseAxiosError(refreshErr);
        console.log('Echec du refresh token:', error.message);
      }
    }
  }
  return null;
}
