import { createUserSession } from './session.service';
import { prisma } from '@stackschool/db';
import { generateToken } from '../lib/outils';

// Mocks
jest.mock('@stackschool/db', () => ({
  prisma: {
    session: {
      create: jest.fn(),
    },
  },
}));
jest.mock('../lib/outils');
jest.mock('../constant/config', () => ({
  SESSION_EXPIRES_DAY: 7,
}));

describe('Session Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer une session avec un token et une expiration', async () => {
    const userId = 'user-123';
    const mockToken = 'generated-token';
    const mockSession = { id: 'session-1', userId, sessionToken: mockToken };
    
    (generateToken as jest.Mock).mockReturnValue(mockToken);
    (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);

    const result = await createUserSession(userId);

    expect(generateToken).toHaveBeenCalledWith(16);
    expect(prisma.session.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId,
        sessionToken: mockToken,
      }),
    }));
    expect(result.refreshToken).toBe(mockToken);
    expect(result.session).toEqual(mockSession);
    expect(result.expires.getTime()).toBeGreaterThan(Date.now());
  });
});
