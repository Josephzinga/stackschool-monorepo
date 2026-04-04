import handleLocalAuth from './passport-local.controller';
import { prisma } from '../lib/prisma';
import { validateLogin } from '../validations/validate';
import * as bcrypt from 'bcryptjs';

// Mocks

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));
jest.mock('bcryptjs');
jest.mock('../validations/validate');

describe('handleLocalAuth', () => {
  const mockDone = jest.fn();
  const identifier = 'tests@example.com';
  const password = 'password;/°0ML123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner une erreur si la validation échoue', async () => {
    (validateLogin as jest.Mock).mockReturnValue([{ message: 'Invalid' }]);

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith([{ message: 'Invalid' }]);
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("devrait retourner false si l'utilisateur n'est pas trouvé", async () => {
    (validateLogin as jest.Mock).mockReturnValue(undefined);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith(null, false, {
      message: 'Utilisateur introuvable',
    });
  });

  it("devrait retourner false si l'utilisateur n'a pas de mot de passe (compte social)", async () => {
    (validateLogin as jest.Mock).mockReturnValue(undefined);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      password: null,
      Account: [{ provider: 'google' }],
    });

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith(
      null,
      false,
      expect.objectContaining({
        message: expect.stringContaining('Ce compte utilise : google'),
        isSocialOnly: true,
      }),
    );
  });

  it('devrait retourner false si le mot de passe est incorrect', async () => {
    (validateLogin as jest.Mock).mockReturnValue(undefined);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      password: 'hashedPassword',
      Account: [],
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith(null, false, {
      message: 'Identifiants invalides',
    });
  });

  it("devrait retourner l'utilisateur si tout est correct", async () => {
    const user = {
      id: 1,
      password: 'hashedPassword',
      Account: [],
    };
    (validateLogin as jest.Mock).mockReturnValue(undefined);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith(null, user);
  });

  it('devrait gérer les erreurs inattendues', async () => {
    (validateLogin as jest.Mock).mockReturnValue(undefined);
    const error = new Error('DB Error');
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(error);

    await handleLocalAuth(identifier, password, mockDone);

    expect(mockDone).toHaveBeenCalledWith(error);
  });
});
