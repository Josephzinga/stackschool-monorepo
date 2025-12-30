import { createJwtForUser, verifyJwtForUser } from './jwt.service';
import jwt from 'jsonwebtoken';

// Mock jwt
jest.mock('jsonwebtoken');
jest.mock('../constant/config', () => ({
  JWT_SECRET: 'secret-key',
}));

describe('JWT Service', () => {
  const mockSign = jest.fn();
  const mockVerify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.sign as jest.Mock) = mockSign;
    (jwt.verify as jest.Mock) = mockVerify;
  });

  describe('createJwtForUser', () => {
    it('devrait créer un token avec le bon payload', () => {
      const user = { id: 1, email: 'test@example.com' };
      mockSign.mockReturnValue('signed-token');

      const token = createJwtForUser(user);

      expect(token).toBe('signed-token');
      expect(mockSign).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 1, email: 'test@example.com' }),
        'secret-key',
        expect.any(Object)
      );
    });
  });

  describe('verifyJwtForUser', () => {
    it('devrait vérifier et décoder le token', () => {
      const token = 'valid-token';
      const decoded = { userId: 1 };
      mockVerify.mockReturnValue(decoded);

      const result = verifyJwtForUser(token);

      expect(result).toEqual(decoded);
      expect(mockVerify).toHaveBeenCalledWith(token, 'secret-key');
    });

    it('devrait lancer une erreur si le token est invalide', () => {
      mockVerify.mockImplementation(() => { throw new Error('Invalid token'); });

      expect(() => verifyJwtForUser('invalid')).toThrow('Invalid token');
    });
  });
});
