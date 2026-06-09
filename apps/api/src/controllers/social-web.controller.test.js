"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const social_web_controller_1 = require("./social-web.controller");
const session_service_1 = require("../services/session.service");
jest.mock('../services/session.service');
jest.mock('../utils/api-errors');
describe('handleSocialWebCallback', () => {
    let req;
    let res;
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
        await (0, social_web_controller_1.handleSocialWebCallback)(req, res, provider);
        expect(res.redirect).toHaveBeenCalledWith(`${frontendUrl}/auth/login=error`);
        expect(session_service_1.createUserSession).not.toHaveBeenCalled();
    });
    it('devrait créer une session et rediriger vers dashboard si le profil est complet', async () => {
        req.user = { id: 1, profileCompleted: true };
        const mockSession = {
            refreshToken: 'token',
            expires: new Date(Date.now() + 10000),
        };
        session_service_1.createUserSession.mockResolvedValue(mockSession);
        await (0, social_web_controller_1.handleSocialWebCallback)(req, res, provider);
        expect(session_service_1.createUserSession).toHaveBeenCalledWith(1);
        expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'token', expect.any(Object));
        expect(res.redirect).toHaveBeenCalledWith(`${frontendUrl}/dashboard`);
    });
    it('devrait rediriger vers complete-profile si le profil est incomplet', async () => {
        req.user = { id: 1, profileCompleted: false };
        const mockSession = {
            refreshToken: 'token',
            expires: new Date(Date.now() + 10000),
        };
        session_service_1.createUserSession.mockResolvedValue(mockSession);
        await (0, social_web_controller_1.handleSocialWebCallback)(req, res, provider);
        expect(res.redirect).toHaveBeenCalledWith(`${frontendUrl}/auth/complete-profile`);
    });
});
//# sourceMappingURL=social-web.controller.test.js.map