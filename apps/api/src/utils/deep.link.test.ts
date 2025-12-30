import { getPlateForm, parseState } from './deep.link';
import { Request } from 'express';

describe('Deep Link Utils', () => {
  describe('getPlateForm', () => {
    it('devrait retourner un state avec plateform="mobile" si query.plateform est "mobile"', () => {
      const req = { query: { plateform: 'mobile' } } as unknown as Request;
      const state = getPlateForm(req);
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      expect(decoded).toEqual({ plateform: 'mobile' });
    });

    it('devrait retourner un state avec plateform="web" par défaut', () => {
      const req = { query: {} } as unknown as Request;
      const state = getPlateForm(req);
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      expect(decoded).toEqual({ plateform: 'web' });
    });
  });

  describe('parseState', () => {
    it('devrait décoder correctement un state valide', () => {
      const payload = JSON.stringify({ plateform: 'mobile' });
      const state = Buffer.from(payload).toString('base64');
      const result = parseState(state);
      expect(result).toEqual({ plateform: 'mobile' });
    });

    it('devrait retourner { platform: "web" } si le state est vide', () => {
      expect(parseState(undefined)).toEqual({ platform: 'web' });
      expect(parseState('')).toEqual({ platform: 'web' });
    });

    it('devrait retourner { platform: "web" } si le state est invalide', () => {
      expect(parseState('invalid-base64')).toEqual({ platform: 'web' });
    });
  });
});
