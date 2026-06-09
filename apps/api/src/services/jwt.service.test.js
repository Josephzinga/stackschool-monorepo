"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("./jwt.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
jest.mock('../constant/config', () => ({
    JWT_SECRET: 'secret-key',
}));
describe('JWT Service', () => {
    const mockSign = jest.fn();
    const mockVerify = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        jsonwebtoken_1.default.sign = mockSign;
        jsonwebtoken_1.default.verify = mockVerify;
    });
    describe('createJwtForUser', () => {
        it('devrait créer un token avec le bon payload', () => {
            const user = { id: 1, email: 'tests@example.com' };
            mockSign.mockReturnValue('signed-token');
            const token = (0, jwt_service_1.createJwtForUser)(user);
            expect(token).toBe('signed-token');
            expect(mockSign).toHaveBeenCalledWith(expect.objectContaining({ userId: 1, email: 'tests@example.com' }), 'secret-key', expect.any(Object));
        });
    });
    describe('verifyJwtForUser', () => {
        it('devrait vérifier et décoder le token', () => {
            const token = 'valid-token';
            const decoded = { userId: 1 };
            mockVerify.mockReturnValue(decoded);
            const result = (0, jwt_service_1.verifyJwtForUser)(token);
            expect(result).toEqual(decoded);
            expect(mockVerify).toHaveBeenCalledWith(token, 'secret-key');
        });
        it('devrait lancer une erreur si le token est invalide', () => {
            mockVerify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            expect(() => (0, jwt_service_1.verifyJwtForUser)('invalid')).toThrow('Invalid token');
        });
    });
});
//# sourceMappingURL=jwt.service.test.js.map