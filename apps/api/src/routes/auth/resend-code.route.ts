import { type Request, Response, Router } from 'express';
import { consumeResendCode, resetVerifyCodeLimit } from '../../utils/limiter';
import jwt from 'jsonwebtoken';
import { CODE_EXPIRES_MINUTES, JWT_SECRET } from '../../constant/config';
import { prisma } from '../../lib/prisma';
import { generate6Code, hashCode } from '../../lib/outils';
import sendWhatshAppMessage from '../../services/whatsapp.service';

const router = Router();

router.post('/resend-code', async (req: Request, res: Response) => {
  try {
    // 1. Rate Limit sur le renvoi (Anti-spam)
    try {
      await consumeResendCode(req);
    } catch (RateLimiterQueueError) {
      return res.status(429).json({
        ok: false,
        message: 'Trop de demandes de renvoi. Veuillez réessayer plus tard.',
      });
    }

    const tempToken = req.cookies.tempToken as string;
    if (!tempToken) {
      return res.status(400).json({
        ok: false,
        message: 'Identifiant ou token requis',
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET) as any;

      if (decoded.type !== 'resend_code') {
        return res.status(400).json({
          ok: false,
          message: 'Token invalide',
        });
      }
    } catch (jwtError) {
      return res.status(400).json({
        ok: false,
        message:
          'Token expiré ou invalide. Veuillez refaire une demande de réinitialisation.',
      });
    }

    const userId = decoded.userId;
    const now = new Date();
    const delay = 1000 * 60 * 2; // 2min

    // vérifier si un code a été envoyer récemment
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        type: 'password_reset',
        method: 'whatsapp',
        createdAt: { gt: new Date(now.getTime() - delay) }, // Créé il y a moins de 2 min
      },
    });

    if (recentCode) {
      const timeLeft = Math.ceil(
        (recentCode.createdAt.getTime() + delay - now.getTime()) / 1000
      );
      return res.status(400).json({
        ok: false,
        message: `Veuillez patienter ${timeLeft} seconde(s) avant de redemander un code.`,
      });
    }

    // récupérer les infos d'utilisateur
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, phoneNumber: true },
    });

    if (!user || !user.phoneNumber) {
      return res.status(400).json({
        ok: false,
        message: 'Utilisateur non trouvé ou numéro de téléphone indisponible.',
      });
    }

    // invalider les ancien code
    await prisma.verificationCode.updateMany({
      where: { userId, type: 'password_reset', used: false },
      data: { used: true },
    });

    // générer et envoyer un nouveau code
    const rawCode = generate6Code();
    const codeHash = hashCode(rawCode);
    const expiresAt = new Date(Date.now() + CODE_EXPIRES_MINUTES * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId,
        type: 'password_reset',
        method: 'whatsapp',
        attempts: 0,
        expiresAt,
        codeHash,
      },
    });

    try {
      await sendWhatshAppMessage(user.phoneNumber, rawCode);
    } catch (err) {
      console.error('Erreur WhatsApp lors du renvoi:', err);
      return res.status(500).json({
        ok: false,
        message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      });
    }

    // IMPORTANT : On réinitialise le compteur de tentatives de vérification pour cette IP
    // car l'utilisateur a reçu un nouveau code légitime.
    await resetVerifyCodeLimit(req);

    return res.status(200).json({
      ok: true,
      message: 'Un nouveau code a été envoyé par WhatsApp.',
    });
  } catch (error) {
    console.error('resend-code error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Erreur lors du renvoi du code',
    });
  }
});

export default router;
