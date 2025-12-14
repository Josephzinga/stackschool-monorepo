import crypto from "crypto";

export function generateToken(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generate6Code() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // "123456"
}

export function hashCode(code: string) {
  return hashToken(code); // reuse sha256
}
