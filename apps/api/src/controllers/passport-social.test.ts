import handleOauthStrategy from './passport-social.controller';
import { upsertOauthUser } from '../services/auth-user.service';

// Mock du service
jest.mock('../services/oauth-user.service');

describe('handleOauthStrategy', () => {
  const mockDone = jest.fn();
  const accessToken = 'access-token';
  const refreshToken = 'refresh-token';
  const provider = 'google';

  const mockProfile = {
    id: '12345',
    displayName: 'John Doe',
    emails: [{ value: 'John.Doe@Example.com', verified: true }],
    photos: [{ value: 'avatar.jpg' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait extraire les données du profil et appeler upsertOauthUser', async () => {
    const mockUser = { id: 1, email: 'john.doe@example.com' };
    (upsertOauthUser as jest.Mock).mockResolvedValue(mockUser);

    await handleOauthStrategy(
      accessToken,
      refreshToken,
      mockProfile,
      mockDone,
      provider,
    );

    expect(upsertOauthUser).toHaveBeenCalledWith({
      provider,
      email: 'john.doe@example.com', // Doit être en minuscule
      displayName: 'John Doe',
      avatar: 'avatar.jpg',
      firstname: 'John',
      lastname: 'Doe',
      providerAccountId: '12345',
      emailVerified: true,
    });

    expect(mockDone).toHaveBeenCalledWith(null, mockUser);
  });

  it('devrait gérer les profils incomplets', async () => {
    const incompleteProfile = { id: '67890' }; // Pas d'email, pas de nom
    const mockUser = { id: 2 };
    (upsertOauthUser as jest.Mock).mockResolvedValue(mockUser);

    await handleOauthStrategy(
      accessToken,
      refreshToken,
      incompleteProfile,
      mockDone,
      provider,
    );

    expect(upsertOauthUser).toHaveBeenCalledWith(
      expect.objectContaining({
        providerAccountId: '67890',
        email: '',
        firstname: '',
        lastname: '',
      }),
    );

    expect(mockDone).toHaveBeenCalledWith(null, mockUser);
  });

  it('devrait gérer les erreurs du service', async () => {
    const error = new Error('Service Error');
    (upsertOauthUser as jest.Mock).mockRejectedValue(error);

    await handleOauthStrategy(
      accessToken,
      refreshToken,
      mockProfile,
      mockDone,
      provider,
    );

    expect(mockDone).toHaveBeenCalledWith(error);
  });
});
