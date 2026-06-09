"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_service_1 = require("./session.service");
const db_1 = require("@stackschool/db");
const outils_1 = require("../lib/outils");
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
        outils_1.generateToken.mockReturnValue(mockToken);
        db_1.prisma.session.create.mockResolvedValue(mockSession);
        const result = await (0, session_service_1.createUserSession)(userId);
        expect(outils_1.generateToken).toHaveBeenCalledWith(16);
        expect(db_1.prisma.session.create).toHaveBeenCalledWith(expect.objectContaining({
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
//# sourceMappingURL=session.service.test.js.map