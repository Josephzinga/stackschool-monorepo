import { handleSocialWebCallback } from './social-web.controller';
import { createUserSession } from '../services/session.service';
import { Request, Response } from 'express';

// Mocks
jest.mock('../services/session.service');
jest.mock('../utils/api-errors');

describe('handleSocialWebCallback', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const provider = 'google';
  const frontendUrl = 'http://localhost:3000';

  beforeEach(() => {
    process.env.FRONTEND_URL = frontendUrl;
    req = { user: undefined };
    res = {
      redirect: jest.fn(),
      cookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("devrait rediriger vers login=error si l'utilisateur est manquant", async () => {
    req.user = undefined;

    await handleSocialWebCallback(req as Request, res as Response, provider);

    expect(res.redirect).toHaveBeenCalledWith(
      `${frontendUrl}/auth/login=error`,
    );
    expect(createUserSession).not.toHaveBeenCalled();
  });

  it('devrait créer une session et rediriger vers dashboard si le profil est complet', async () => {
    req.user = { id: 1, profileCompleted: true } as any;
    const mockSession = {
      refreshToken: 'token',
      expires: new Date(Date.now() + 10000),
    };
    (createUserSession as jest.Mock).mockResolvedValue(mockSession);

    await handleSocialWebCallback(req as Request, res as Response, provider);

    expect(createUserSession).toHaveBeenCalledWith(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'token',
      expect.any(Object),
    );
    expect(res.redirect).toHaveBeenCalledWith(`${frontendUrl}/dashboard`);
  });

  it('devrait rediriger vers complete-profile si le profil est incomplet', async () => {
    req.user = { id: 1, profileCompleted: false } as any;
    const mockSession = {
      refreshToken: 'token',
      expires: new Date(Date.now() + 10000),
    };
    (createUserSession as jest.Mock).mockResolvedValue(mockSession);

    await handleSocialWebCallback(req as Request, res as Response, provider);

    expect(res.redirect).toHaveBeenCalledWith(
      `${frontendUrl}/auth/complete-profile`,
    );
  });
});
