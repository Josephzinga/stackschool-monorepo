export interface JwtPayload {
  email?: string | null;
  sub: string;
  username: string;
  phoneNumber: string | null;
}
