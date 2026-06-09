"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_social_controller_1 = __importDefault(require("./passport-social.controller"));
const auth_user_service_1 = require("../services/auth-user.service");
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
        auth_user_service_1.upsertOauthUser.mockResolvedValue(mockUser);
        await (0, passport_social_controller_1.default)(accessToken, refreshToken, mockProfile, mockDone, provider);
        expect(auth_user_service_1.upsertOauthUser).toHaveBeenCalledWith({
            provider,
            email: 'john.doe@example.com',
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
        const incompleteProfile = { id: '67890' };
        const mockUser = { id: 2 };
        auth_user_service_1.upsertOauthUser.mockResolvedValue(mockUser);
        await (0, passport_social_controller_1.default)(accessToken, refreshToken, incompleteProfile, mockDone, provider);
        expect(auth_user_service_1.upsertOauthUser).toHaveBeenCalledWith(expect.objectContaining({
            providerAccountId: '67890',
            email: '',
            firstname: '',
            lastname: '',
        }));
        expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });
    it('devrait gérer les erreurs du service', async () => {
        const error = new Error('Service Error');
        auth_user_service_1.upsertOauthUser.mockRejectedValue(error);
        await (0, passport_social_controller_1.default)(accessToken, refreshToken, mockProfile, mockDone, provider);
        expect(mockDone).toHaveBeenCalledWith(error);
    });
});
//# sourceMappingURL=passport-social.test.js.map