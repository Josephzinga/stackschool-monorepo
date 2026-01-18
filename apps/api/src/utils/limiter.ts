import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import type { Request } from 'express';

const resendCodeLimiter = new RateLimiterMemory({
  points: 5,
  duration: 900,
});

/**
 * Consomme un point de limite pour le renvoi de code de vérification.
 * Limite : 5 tentatives par 15 minutes par IP.
 *
 * @param {Request} req - La requête Express contenant l'IP.
 * @returns {Promise<RateLimiterRes>} Promesse résolue si autorisé, rejetée si limite atteinte ou IP manquante.
 */
export const consumeResendCode = (req: Request) => {
  const ip = req.ip;
  if (!ip) return Promise.reject(new Error('IP manquants dans resend_code'));

  return resendCodeLimiter.consume(ip);
};

const verifyCodeLimiter = new RateLimiterMemory({
  points: 4,
  duration: 600,
});

/**
 * Consomme un point de limite pour la vérification de code.
 * Limite : 4 tentatives par 10 minutes par IP.
 *
 * @param {Request} req - La requête Express contenant l'IP.
 * @returns {Promise<RateLimiterRes>} Promesse résolue si autorisé, rejetée si limite atteinte ou IP manquante.
 */
export const consumeCode = (req: Request): Promise<RateLimiterRes> => {
  const ip = req.ip;
  if (!ip) return Promise.reject(new Error('IP manquants'));
  return verifyCodeLimiter.consume(ip);
};

/**
 * Réinitialise le compteur de tentatives de vérification de code pour une IP.
 * À utiliser lors de l'envoi d'un nouveau code (resend).
 *
 * @param {Request} req - La requête Express contenant l'IP.
 */
export const resetVerifyCodeLimit = (req: Request): Promise<boolean> => {
  const ip = req.ip;
  if (!ip) return Promise.resolve(false);
  return verifyCodeLimiter.delete(ip);
};

const rateLimiter = new RateLimiterMemory({
  points: 3, // 3 tentatives
  duration: 900, // 15 minutes
});

/**
 * Consomme un point de limite générique par IP (ex: login).
 * Limite : 3 tentatives par 15 minutes par IP.
 *
 * @param {Request} req - La requête Express contenant l'IP.
 * @returns {Promise<RateLimiterRes>} Promesse résolue si autorisé, rejetée si limite atteinte ou IP manquante.
 */
export const consumeIp = (req: Request): Promise<RateLimiterRes> => {
  const ip = req.ip;
  if (!ip) return Promise.reject(new Error('Missing IP address'));
  return rateLimiter.consume(ip);
};

// Rate limiting par identifiant
const identifierLimiter = new RateLimiterMemory({
  points: 8, // 8 tentatives par 10 minutes
  duration: 600, // 10 minutes
});

/**
 * Consomme un point de limite par identifiant (ex: email ou username dans le body).
 * Limite : 8 tentatives par 10 minutes par identifiant.
 *
 * @param {Request} req - La requête Express contenant l'identifiant dans le body.
 * @returns {Promise<RateLimiterRes>} Promesse résolue si autorisé, rejetée si limite atteinte ou identifiant manquant.
 */
export const consumeIdentifier = (req: Request): Promise<RateLimiterRes> => {
  const identifier = req.body?.identifier;
  if (!identifier) return Promise.reject(new Error('Missing identifier'));
  return identifierLimiter.consume(identifier);
};
