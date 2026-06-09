"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_service_1 = require("./mail.service");
const nodemailer_1 = __importDefault(require("nodemailer"));
jest.mock('nodemailer');
describe('Mail Service', () => {
    const mockSendMail = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        nodemailer_1.default.createTransport.mockReturnValue({
            sendMail: mockSendMail,
        });
        mockSendMail.mockResolvedValue({ messageId: 'tests-id' });
    });
    it('devrait envoyer un email avec les bons paramètres', async () => {
        const to = 'tests@example.com';
        const subject = 'Reset Password';
        const resetLink = 'http://example.com/reset';
        await (0, mail_service_1.sendResetPasswordEmail)(to, subject, resetLink);
        expect(nodemailer_1.default.createTransport).toHaveBeenCalled();
        expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
            to,
            subject,
            html: expect.stringContaining(resetLink),
        }));
    });
    it("devrait gérer les erreurs d'envoi", async () => {
        mockSendMail.mockRejectedValue(new Error('SMTP Error'));
        await expect((0, mail_service_1.sendResetPasswordEmail)('to', 'sub', 'link')).rejects.toThrow('SMTP Error');
    });
});
//# sourceMappingURL=mail.service.test.js.map