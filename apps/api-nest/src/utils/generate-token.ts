import { randomBytes } from 'crypto';

export function generateToken(length = 32) {
  return randomBytes(length).toString('hex');
}
