import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Request } from "express";

const verifiCodeLimiter = new RateLimiterMemory({
  points: 4,
  duration: 900,
});

export const consumeCode = (req: Request) => {
  const ip = req.ip;
  if (!ip) return Promise.reject(new Error("IP manquants"));
  return verifiCodeLimiter.consume(ip);
};

const rateLimiter = new RateLimiterMemory({
  points: 3, // 3 tentatives
  duration: 900, // 15 minutes
});

export const consumeIp = (req: Request) => {
  const ip = req.ip;
  if (!ip) return Promise.reject(new Error("Missing IP"));
  return rateLimiter.consume(ip);
};
// Rate limiting par identifiant
const identifierLimiter = new RateLimiterMemory({
  points: 4, // 4 tentatives
  duration: 600, // 10 minutes
});

export const consumeIdentifier = (req: Request) => {
  const identifier = req.body?.identifier;
  if (!identifier) return Promise.reject(new Error("Missing identifier"));
  return identifierLimiter.consume(identifier);
};
