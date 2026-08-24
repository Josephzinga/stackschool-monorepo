import { randomBytes } from 'node:crypto';

export function generateToken(length = 32) {
  return randomBytes(length).toString('hex');
}
