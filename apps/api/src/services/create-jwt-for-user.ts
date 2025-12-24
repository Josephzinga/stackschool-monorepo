import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constant/config';

export function createJwtForUser(user: any) {
  const token = jwt.sign({ userId: user.id, email: user?.email }, JWT_SECRET);
  return token;
}

export function verifyJwtForUser(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
}
