import { prisma, SchoolRole } from '@stackschool/db';
import {
  generate6Code,
  generateToken,
  hashCode,
  hashToken,
} from '../lib/outils';
import { sendResetPasswordEmail } from './mail.service'; // On va l'adapter
import sendWhatsAppMessage from './whatsapp.service';

interface CreateInvitationParams {
  schoolId: string;
  role: SchoolRole;
  email?: string | null;
  phoneNumber?: string | null;
  message?: string | null;
  // ... autres données pré-remplies
}

export async function createAndSendInvitation(params: CreateInvitationParams) {
  const { schoolId, role, email, phoneNumber, message } = params;

  // 1. Générer un token unique
  const token = generateToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 jours

  // 2. Créer l'invitation en base
  const invitation = await prisma.invite.create({
    data: {
      schoolId,
      role,
      email,
      phoneNumber,
      token: tokenHash,
      expiresAt,
      message:
        message ||
        `Vous êtes invité à rejoindre notre école en tant que ${role.toLowerCase()}.`,
    },
  });

  // 3. Envoyer l'invitation
  const joinUrl = `${process.env.FRONTEND_URL}/join?token=${token}`;

  if (email) {
    await sendResetPasswordEmail(
      email,
      'Invitation à rejoindre notre école',
      joinUrl,
    );
  }

  if (phoneNumber) {
    const whatsappMessage = `${invitation.message} Cliquez ici pour accepter : ${joinUrl}`;
    const code = generate6Code();
    const codeHashed = hashCode(code);
    await sendWhatsAppMessage(phoneNumber, codeHashed);
  }

  return invitation;
}
