"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facebook_token_service_1 = require("./facebook-token.service");
const shared_1 = require("@stackschool/shared");
jest.mock('@stackschool/shared', () => ({
    api: {
        post: jest.fn(),
    },
}));
jest.mock('../utils/api-errors', () => ({
    createServiceError: (msg) => new Error(msg),
}));
describe('verifyFacebookToken', () => {
    const accessToken = 'valid-token';
    process.env.FACEBOOK_CLIENT_SECRET = 'secret';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('devrait retourner les données utilisateur si le token est valide', async () => {
        const mockData = { id: '123', name: 'John Doe' };
        shared_1.api.post.mockResolvedValue({ data: mockData });
        const result = await (0, facebook_token_service_1.verifyFacebookToken)(accessToken);
        expect(result).toEqual(mockData);
        expect(shared_1.api.post).toHaveBeenCalledWith(expect.stringContaining('graph.facebook.com'));
    });
    it('devrait lancer une erreur si le token est invalide (réponse erreur FB)', async () => {
        shared_1.api.post.mockResolvedValue({
            data: { error: { message: 'Invalid token' } },
        });
        await expect((0, facebook_token_service_1.verifyFacebookToken)(accessToken)).rejects.toThrow('Invalid Facebook token');
    });
    it("devrait lancer une erreur si l'appel API échoue", async () => {
        shared_1.api.post.mockRejectedValue(new Error('Network Error'));
        await expect((0, facebook_token_service_1.verifyFacebookToken)(accessToken)).rejects.toThrow('Invalid Facebook token');
    });
});
//# sourceMappingURL=facebook-token.service.test.js.map