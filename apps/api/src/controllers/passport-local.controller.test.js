"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_controller_1 = __importDefault(require("./passport-local.controller"));
const prisma_1 = require("../lib/prisma");
const validate_1 = require("../validations/validate");
const bcrypt = __importStar(require("bcryptjs"));
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
        validate_1.validateLogin.mockReturnValue([{ message: 'Invalid' }]);
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
        expect(mockDone).toHaveBeenCalledWith([{ message: 'Invalid' }]);
        expect(prisma_1.prisma.user.findFirst).not.toHaveBeenCalled();
    });
    it("devrait retourner false si l'utilisateur n'est pas trouvé", async () => {
        validate_1.validateLogin.mockReturnValue(undefined);
        prisma_1.prisma.user.findFirst.mockResolvedValue(null);
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
        expect(mockDone).toHaveBeenCalledWith(null, false, {
            message: 'Utilisateur introuvable',
        });
    });
    it("devrait retourner false si l'utilisateur n'a pas de mot de passe (compte social)", async () => {
        validate_1.validateLogin.mockReturnValue(undefined);
        prisma_1.prisma.user.findFirst.mockResolvedValue({
            id: 1,
            password: null,
            Account: [{ provider: 'google' }],
        });
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
        expect(mockDone).toHaveBeenCalledWith(null, false, expect.objectContaining({
            message: expect.stringContaining('Ce compte utilise : google'),
            isSocialOnly: true,
        }));
    });
    it('devrait retourner false si le mot de passe est incorrect', async () => {
        validate_1.validateLogin.mockReturnValue(undefined);
        prisma_1.prisma.user.findFirst.mockResolvedValue({
            id: 1,
            password: 'hashedPassword',
            Account: [],
        });
        bcrypt.compare.mockResolvedValue(false);
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
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
        validate_1.validateLogin.mockReturnValue(undefined);
        prisma_1.prisma.user.findFirst.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
        expect(mockDone).toHaveBeenCalledWith(null, user);
    });
    it('devrait gérer les erreurs inattendues', async () => {
        validate_1.validateLogin.mockReturnValue(undefined);
        const error = new Error('DB Error');
        prisma_1.prisma.user.findFirst.mockRejectedValue(error);
        await (0, passport_local_controller_1.default)(identifier, password, mockDone);
        expect(mockDone).toHaveBeenCalledWith(error);
    });
});
//# sourceMappingURL=passport-local.controller.test.js.map