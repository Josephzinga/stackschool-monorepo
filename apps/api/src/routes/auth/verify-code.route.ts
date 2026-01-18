import { NextFunction, Request, type Response, Router } from 'express';
import { prisma } from '../../lib/prisma';
import { hashCode } from '../../lib/outils';
import { consumeCode } from '../../utils/limiter';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, RESET_TOKEN_EXP_MINUTES } from '../../constant/config';
import { createServiceError } from '../../utils/api-errors';

const router = Router();

router.post(
  '/verify-code',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      try {
        await consumeCode(req);
      } catch (RateLimiterQueueError) {
        return next(
          createServiceError(
            'Trop de tentatives. Veuillez réessayer plus tard',
            429,
          ),
        );
      }
      const { code } = req.body as {
        code: string;
      };

      const tempToken = req.cookies.tempToken;
      if (!tempToken) {
        return res.status(400).json({
          ok: false,
          message: 'Identifiant ou token requis',
        });
      }

      let userId: string;

      try {
        const decoded = jwt.verify(tempToken, JWT_SECRET) as any;

        if (decoded?.type !== 'resend_code') {
          return res.status(400).json({ ok: false, message: 'Token invalide' });
        }

        userId = decoded.userId;
      } catch (jwtError) {
        return res
          .status(400)
          .json({ ok: false, message: 'Token expiré ou invalide' });
      }

      const codeHash = hashCode(code);
      const now = new Date();

      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          userId,
          method: 'whatsapp',
          type: 'password_reset',
          expiresAt: { gt: now },
          used: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!verificationCode) {
        return res
          .status(404)
          .json({ ok: false, message: 'Code invalide ou expiré' });
      }

      // vérifier les tentatives
      if (verificationCode.attempts >= 5) {
        return res.status(400).json({
          ok: false,
          message: 'Trop de tentatives. Veuillez demander un nouveau code.',
        });
      }

      // vérifier les code
      if (verificationCode.codeHash !== codeHash) {
        // incrémenter le compteur de vérification
        await prisma.verificationCode.update({
          where: { id: verificationCode.id },
          data: { attempts: { increment: 1 } },
        });

        const remainingAttempts = 5 - (verificationCode.attempts + 1);

        return res.status(400).json({
          ok: false,
          message: `Code incorrect. ${remainingAttempts} tentative(s) restante(s).`,
          remainingAttempts,
        });
      }

      // code valide marquer comme utilisé
      await prisma.$transaction(async (tx) => {
        // marquer le code comme utiliser
        await tx.verificationCode.update({
          where: { id: verificationCode.id },
          data: { used: true, updateAt: new Date() },
        });

        // invalider les autre code non utiliser
        await tx.verificationCode.updateMany({
          where: { userId, type: 'password_reset', used: false },
          data: { used: true },
        });
      });

      // Générer un JWT d'accès au reset (valide 15 min)
      const resetAccessToken = jwt.sign(
        { userId, type: 'reset_access' },
        JWT_SECRET,
        { expiresIn: `${RESET_TOKEN_EXP_MINUTES}m` }
      );

      // Envoyer le cookie sécurisé
      res.cookie('reset_access_token', resetAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: RESET_TOKEN_EXP_MINUTES * 60 * 1000,
      });

      // On supprime le cookie temporaire car l'étape est validée
      res.clearCookie('tempToken');

      return res.status(200).json({
        ok: true,
        message: 'Code vérifié avec succès.',
      });
    } catch (err) {
      return next(
        createServiceError('Erreur lors de la vérification du code', 500, err),
      );
    }
  },
);

export default router;
