import {
  consumeCode,
  consumeIdentifier,
  consumeIp,
  consumeResendCode,
} from './limiter';
import { Request } from 'express';

describe('Rate Limiter Utils', () => {
  // Note: RateLimiterMemory garde l'état en mémoire.
  // Pour des tests isolés, il faudrait idéalement pouvoir resetter les limiteurs,
  // mais ils ne sont pas exportés. On teste donc le comportement de base.

  describe('consumeIp', () => {
    it("devrait rejeter si l'IP est manquante", async () => {
      const req = { ip: undefined } as unknown as Request;
      await expect(consumeIp(req)).rejects.toThrow('Missing IP');
    });

    it('devrait consommer des points pour une IP valide', async () => {
      const req = { ip: '127.0.0.1' } as unknown as Request;
      // Première tentative devrait passer
      await expect(consumeIp(req)).resolves.toBeDefined();
    });
  });

  describe('consumeIdentifier', () => {
    it("devrait rejeter si l'identifiant est manquant", async () => {
      const req = { body: {} } as unknown as Request;
      await expect(consumeIdentifier(req)).rejects.toThrow(
        'Missing identifier',
      );
    });

    it('devrait consommer des points pour un identifiant valide', async () => {
      const req = { body: { identifier: 'tests-user' } } as unknown as Request;
      await expect(consumeIdentifier(req)).resolves.toBeDefined();
    });
  });

  describe('consumeCode', () => {
    it("devrait rejeter si l'IP est manquante", async () => {
      const req = { ip: undefined } as unknown as Request;
      await expect(consumeCode(req)).rejects.toThrow('IP manquants');
    });
  });

  describe('consumeResendCode', () => {
    it("devrait rejeter si l'IP est manquante", async () => {
      const req = { ip: undefined } as unknown as Request;
      await expect(consumeResendCode(req)).rejects.toThrow(
        'IP manquants dans resend_code',
      );
    });
  });
});
