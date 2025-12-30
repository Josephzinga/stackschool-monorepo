import { verifyFacebookToken } from './facebook-token.service';
import { api } from '@stackschool/shared';

// Mock de l'API partagée
jest.mock('@stackschool/shared', () => ({
  api: {
    post: jest.fn(),
  },
}));

// Mock de createServiceError pour qu'il retourne une erreur simple pour le test
jest.mock('../utils/api-errors', () => ({
  createServiceError: (msg: string) => new Error(msg),
}));

describe('verifyFacebookToken', () => {
  const accessToken = 'valid-token';
  process.env.FACEBOOK_CLIENT_SECRET = 'secret';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner les données utilisateur si le token est valide', async () => {
    const mockData = { id: '123', name: 'John Doe' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await verifyFacebookToken(accessToken);

    expect(result).toEqual(mockData);
    expect(api.post).toHaveBeenCalledWith(expect.stringContaining('graph.facebook.com'));
  });

  it('devrait lancer une erreur si le token est invalide (réponse erreur FB)', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { error: { message: 'Invalid token' } } });

    await expect(verifyFacebookToken(accessToken)).rejects.toThrow('Invalid Facebook token');
  });

  it('devrait lancer une erreur si l\'appel API échoue', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(verifyFacebookToken(accessToken)).rejects.toThrow('Invalid Facebook token');
  });
});
