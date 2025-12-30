import { sendResetPasswordEmail } from './mail.service';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('Mail Service', () => {
  const mockSendMail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
    mockSendMail.mockResolvedValue({ messageId: 'test-id' });
  });

  it('devrait envoyer un email avec les bons paramètres', async () => {
    const to = 'test@example.com';
    const subject = 'Reset Password';
    const resetLink = 'http://example.com/reset';

    await sendResetPasswordEmail(to, subject, resetLink);

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to,
      subject,
      html: expect.stringContaining(resetLink),
    }));
  });

  it('devrait gérer les erreurs d\'envoi', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP Error'));
    
    await expect(sendResetPasswordEmail('to', 'sub', 'link')).rejects.toThrow('SMTP Error');
  });
});
