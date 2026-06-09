import { authServices, parseAxiosError, UserInMe } from '@stackschool/shared';

export async function getSafeMe(): Promise<UserInMe | null> {
  try {
    const me = await authServices.getMe();
    if (me.ok) {
      return me.user ?? null;
    }
  } catch (err: any) {
    const status = err.status ?? parseAxiosError(err).status;

    if (status === 401) {
      try {
        const refresh = await authServices.refresh();
        if (refresh.ok) {
          const me2 = await authServices.getMe();
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
