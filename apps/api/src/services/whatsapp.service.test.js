"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_service_1 = require("./whatsapp.service");
const twilio_1 = __importDefault(require("twilio"));
jest.mock('twilio', () => {
    const mTwilio = jest.fn();
    return mTwilio;
});
jest.mock('../utils/api-errors', () => ({
    createServiceError: (msg) => new Error(msg),
}));
describe('WhatsApp Service', () => {
    const mockCreate = jest.fn();
    const mockClient = {
        messages: {
            create: mockCreate,
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
        twilio_1.default.mockReturnValue(mockClient);
        process.env.TWILIO_ACCOUNT_SID = 'sid';
        process.env.TWILIO_ACCOUNT_TOKEN = 'token';
        process.env.TWILIO_MESSAGE_FROM = '+14155238886';
    });
    it('devrait envoyer un message WhatsApp', async () => {
        mockCreate.mockResolvedValue({ sid: 'SM123' });
        await (0, whatsapp_service_1.sendWhatsAppMessage)('+1234567890', 'Code: 1234');
        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
            to: 'whatsapp:+1234567890',
            body: 'Code: 1234',
        }));
    });
    it('devrait gérer les erreurs Twilio', async () => {
        mockCreate.mockRejectedValue(new Error('Twilio Error'));
        await expect((0, whatsapp_service_1.sendWhatsAppMessage)('+123', 'code')).rejects.toThrow("Erreur d'envoi WhatsApp");
    });
});
//# sourceMappingURL=whatsapp.service.test.js.map