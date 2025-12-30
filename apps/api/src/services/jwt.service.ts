import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constant/config';

export function createJwtForUser(user: any) {
  return jwt.sign({ userId: user.id, email: user?.email }, JWT_SECRET);
}

export function verifyJwtForUser(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
