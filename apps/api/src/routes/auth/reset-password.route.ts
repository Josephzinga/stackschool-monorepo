import { NextFunction, type Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { hashToken } from '../../lib/outils';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { resetPasswordSchema } from '@stackschool/shared';
import { createServiceError } from '../../utils/api-errors';
import { JWT_SECRET } from '../../constant/config';

const router = Router();

router.post(
  '/reset-password',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password, confirm } = req.body as {
      token?: string;
      password: string;
      confirm: string;
    };
    try {
      const errors = safeValidateSchema(resetPasswordSchema, {
        confirm,
        password,
      });
      if (errors) {
        return next(errors);
      }

      let userIdToReset: string | null = null;
      let verificationTokenId: string | null = null;

      // --- CAS 1 : Méthode Email (Token dans le body) ---
      if (token) {
        const now = new Date();
        const tokenHash = hashToken(token);

        const verificationToken = await prisma.verificationToken.findFirst({
          where: {
            tokenHash,
            type: 'password_reset',
            used: false,
            expiresAt: { gt: now },
          },
          include: { user: { select: { id: true } } },
        });

        if (!verificationToken || !verificationToken.user) {
          return res.status(400).json({
            ok: false,
            message: 'Lien invalide, expiré ou déjà utilisé.',
          });
        }

        userIdToReset = verificationToken.user.id;
        verificationTokenId = verificationToken.id;
      }
      // --- CAS 2 : Méthode WhatsApp (JWT dans le cookie) ---
      else {
        const resetAccessToken = req.cookies.reset_access_token;

        if (!resetAccessToken) {
          return res.status(400).json({
            ok: false,
            message:
              'Session expirée ou invalide. Veuillez recommencer la procédure.',
          });
        }

        try {
          const decoded = jwt.verify(resetAccessToken, JWT_SECRET) as any;

          if (decoded.type !== 'reset_access') {
            return res
              .status(400)
              .json({ ok: false, message: 'Token invalide.' });
          }

          userIdToReset = decoded.userId;
        } catch (err) {
          return res.status(400).json({
            ok: false,
            message: 'Session invalide.',
          });
        }
      }

      if (!userIdToReset) {
        return res.status(400).json({
          ok: false,
          message: "Impossible d'identifier le compte à réinitialiser.",
        });
      }

      // --- Action Commune : Reset du mot de passe ---
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.$transaction(async (tx) => {
        // 1. Mettre à jour le mot de passe
        await tx.user.update({
          where: { id: userIdToReset! },
          data: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        });

        // 2. Si méthode Email : Marquer le token comme utilisé
        if (verificationTokenId) {
          await tx.verificationToken.update({
            where: { id: verificationTokenId },
            data: { used: true, updateAt: new Date() },
          });
        }

        // 3. Nettoyage global (Tokens et Codes)
        await tx.verificationToken.updateMany({
          where: {
            userId: userIdToReset!,
            type: 'password_reset',
            used: false,
          },
          data: { used: true },
        });

        await tx.verificationCode.updateMany({
          where: {
            userId: userIdToReset!,
            type: 'password_reset',
            used: false,
          },
          data: { used: true },
        });
      });

      // Nettoyage des cookies
      res.clearCookie('reset_access_token');
      res.clearCookie('tempToken');

      return res.status(200).json({
        ok: true,
        message: 'Mot de passe réinitialisé avec succès.',
      });
    } catch (err) {
      return next(
        createServiceError('Erreur lors de la réinitialisation', 500, err),
      );
    }
  },
);

export default router;
