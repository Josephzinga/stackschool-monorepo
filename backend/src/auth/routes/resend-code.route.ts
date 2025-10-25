import { Router, type Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { consumeResendCode } from "../../utils/limiter";
import jwt from "jsonwebtoken";
import { CODE_EXPIRES_MINUTES, JWT_SECRET } from "../../constant/config";
import { prisma } from "../../lib/prisma";
import { generate6Code, hashCode } from "../../lib/outils";
import sendWhatshAppMessage from "../../services/twilio-whatshapp";

const router = Router();

router.post(
  "/resend-code",
  body("tempToken").notEmpty().withMessage("Token temporaire requis"),
  async (req: Request, res: Response) => {
    try {
      try {
        await consumeResendCode(req);
      } catch (RateLimiterQueueError) {
        return res.status(429).json({
          ok: false,
          message: "Trop de demandes de renvoi. Veuillez réessayer plus tard.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ ok: false, error: errors.array() });

      const { tempToken } = req.body as { tempToken: string };

      let decoded;
      try {
        decoded = jwt.verify(tempToken, JWT_SECRET) as any;
        console.log("decoded:", decoded);

        if (decoded.type !== "resend_code") {
          return res.status(400).json({
            ok: false,
            message: "Token invalide",
          });
        }
      } catch (jwtError) {
        return res.status(400).json({
          ok: false,
          message:
            "Token expiré ou invalide. Veuillez refaire une demande de réinitialisation.",
        });
      }

      const userId = decoded.userId;
      const now = new Date();
      const delay = new Date(Date.now() - 2 * 60 * 1000);

      // vérifier si un code à été envoyer récemment
      const recentCode = await prisma.verificationCode.findFirst({
        where: {
          userId,
          type: "password_reset",
          method: "whatsapp",
          createdAt: { gt: delay },
        },
      });

      if (recentCode) {
        const timeLeft = Math.ceil(
          (new Date(recentCode.createdAt).getTime() +
            2 * 60 * 1000 -
            Date.now()) /
            1000
        );
        return res.status(400).json({
          ok: false,
          message: `Veuillez patienter ${timeLeft} seconde(s) avant de redemander un code.`,
        });
      }

      // récuperer les info d'utilisateur
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: { id: true, phoneNumber: true },
      });

      if (!user || !user.phoneNumber) {
        return res.status(400).json({
          ok: false,
          message:
            "Utilisateur non trouvé ou numéro de téléphone indisponible.",
        });
      }

      // invalider les ancien code
      await prisma.verificationCode.updateMany({
        where: { userId, type: "password_reset", used: false },
        data: { used: true },
      });

      // générer et envoyer un nouveau code
      const rawCode = generate6Code();
      const codeHash = hashCode(rawCode);
      const expiresAt = new Date(Date.now() + CODE_EXPIRES_MINUTES * 60 * 1000);

      await prisma.verificationCode.create({
        data: {
          userId,
          type: "password_reset",
          method: "whatsapp",
          attempts: 0,
          expiresAt,
          codeHash,
        },
      });

      try {
        await sendWhatshAppMessage(user.phoneNumber, rawCode);
      } catch (err) {
        console.error("Erreur WhatsApp lors du renvoi:", err);
        return res.status(500).json({
          ok: false,
          message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Un nouveau code a été envoyé par WhatsApp.",
        // Optionnel: renvoyer un nouveau tempToken si nécessaire
        // tempToken: generateNewTempToken(userId)
      });
    } catch (error) {
      console.error("resend-code error:", error);
      return res.status(500).json({
        ok: false,
        message: "Erreur lors du renvoi du code",
      });
    }
  }
);

export default router;
