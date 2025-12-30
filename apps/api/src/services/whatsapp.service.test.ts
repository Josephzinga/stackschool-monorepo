import { sendWhatsAppMessage } from './whatsapp.service';
import twilio from 'twilio';

// Mock twilio
jest.mock('twilio', () => {
  const mTwilio = jest.fn();
  return mTwilio;
});

// Mock createServiceError
jest.mock('../utils/api-errors', () => ({
  createServiceError: (msg: string) => new Error(msg),
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
    (twilio as unknown as jest.Mock).mockReturnValue(mockClient);
    process.env.TWILIO_ACCOUNT_SID = 'sid';
    process.env.TWILIO_ACCOUNT_TOKEN = 'token';
    process.env.TWILIO_MESSAGE_FROM = '+14155238886';
  });

  it('devrait envoyer un message WhatsApp', async () => {
    mockCreate.mockResolvedValue({ sid: 'SM123' });
    
    await sendWhatsAppMessage('+1234567890', 'Code: 1234');

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      to: 'whatsapp:+1234567890',
      body: 'Code: 1234',
    }));
  });

  it('devrait gérer les erreurs Twilio', async () => {
    mockCreate.mockRejectedValue(new Error('Twilio Error'));

    await expect(sendWhatsAppMessage('+123', 'code')).rejects.toThrow("Erreur d'envoi WhatsApp");
  });
});
