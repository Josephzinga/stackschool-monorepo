import { z } from 'zod';

export const SendWhatsAppCodeInput = z.object({
  phoneNumber: z.string(),
  code: z.string(),
});

export const SendEmailLinkInput = z.object({
  to: z.string(),
  subject: z.string(),
  resetLink: z.string(),
});

export type SendWhatsAppCodeInput = z.infer<typeof SendWhatsAppCodeInput>;
export type SendEmailLinkInput = z.infer<typeof SendEmailLinkInput>;
