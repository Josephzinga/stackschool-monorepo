import { api, parseAxiosError, setHeaders } from '@stackschool/shared';
export default async function CsrfProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const res = await api.get<any, { ok: true; csrfToken: string }>(
      '/api/auth/csrf-token',
    );
    if (res.ok) {
      api.defaults.headers.common['CSRF-Token'] = res.csrfToken;

      console.log('CSRF-Token', res.csrfToken);
    }
  } catch (err) {
    const { message, status } = parseAxiosError(err);
    console.log('Satus', status, message);
    console.error('Erreur csrf', err);
  }
  return <>{children}</>;
}
