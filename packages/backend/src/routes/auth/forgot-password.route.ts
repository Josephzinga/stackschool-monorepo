import { Router, type Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { sendMail } from "../../services/node_mail";
import sendWhatshAppMessage from "../../services/twilio-whatshapp";
import {
  generateToken,
  hashToken,
  generate6Code,
  hashCode,
} from "../../lib/outils";
import {
  JWT_SECRET,
  CODE_EXPIRES_MINUTES,
  TEMP_TOKEN_EXP,
} from "../../constant/config";
import { consumeIdentifier, consumeIp } from "../../utils/limiter";

const router = Router();

router.post(
  "/forgot-password",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Identifiant requis")
      .isLength({ max: 255 })
      .withMessage("Identifiant trop long")
      .matches(/^[a-zA-Z0-9@.+_\-\s]+$/)
      .withMessage("Format d'identifiant invalide"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const { identifier } = req.body as { identifier: string };

      try {
        await consumeIp(req);
        await consumeIdentifier(req);
      } catch (RateLimiterQueueError) {
        return res.status(429).json({
          ok: false,
          message: "Trop de tentatives. Veuillez réessayer plus tard.",
        });
      }

      const user = (await Promise.race([
        prisma.user.findFirst({
          where: {
            OR: [
              { username: identifier },
              { phoneNumber: identifier },
              { email: identifier },
            ],
          },
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            username: true,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000)
        ),
      ])) as any;

      if (!user) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 500)
        );
        return res.status(200).json({
          ok: true,
          message:
            "Si un compte correspond à cet identifiant, un message a été envoyé.",
        });
      }

      const now = new Date();
      const expiresAt = new Date(Date.now() + CODE_EXPIRES_MINUTES * 60 * 1000);

      const [existingToken, existingCode] = await Promise.all([
        prisma.verificationToken.findFirst({
          where: {
            userId: user.id,
            type: "password_reset",
            used: false,
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.verificationCode.findFirst({
          where: {
            userId: user.id,
            type: "password-reset",
            used: false,
            expiresAt: { gt: now },
          },
        }),
      ]);

      const minDelay = 1000 * 60 * 2; // 2 min
      const lastCreated = Math.max(
        existingCode ? new Date(existingCode.createdAt).getTime() : 0,
        existingToken ? new Date(existingToken.createdAt).getTime() : 0
      );

      if (Date.now() - lastCreated < minDelay) {
        return res.status(200).json({
          ok: true,
          message: "Veuillez patienter avant de redemander un code.",
        });
      }

      await Promise.all([
        prisma.verificationToken.updateMany({
          where: {
            userId: user.id,
            type: "password_reset",
            used: false,
          },
          data: { used: true },
        }),
        prisma.verificationCode.updateMany({
          where: {
            userId: user.id,
            type: "password_reset",
            used: false,
          },
          data: { used: true },
        }),
      ]);

      let sent = false;
      // 5️⃣ Si l'utilisateur a un email : envoi d'un lien sécurisé
      if (user.email) {
        const rawToken = generateToken(32);
        const tokenHash = hashToken(rawToken);

        await prisma.verificationToken.create({
          data: {
            userId: user.id,
            tokenHash,
            method: "email",
            type: "password_reset",
            used: false,
            expiresAt,
          },
        });

        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${rawToken}`;

        try {
          await sendMail(user.email, "password_reset", resetLink);
          sent = true;
        } catch (err) {
          console.error("Erreur envoi email:", err);
        }

        return res.status(200).json({
          ok: true,
          message:
            "Un lien de réinitialisation du mot de passe a été envoyé à votre email.",
        });
      }

      if (!sent && user.phoneNumber) {
        const rawCode = generate6Code();
        const codeHash = hashCode(rawCode);

        await prisma.verificationCode.create({
          data: {
            userId: user.id,
            codeHash,
            method: "whatsapp",
            type: "password_reset",
            used: false,
            attempts: 0,
            expiresAt,
          },
        });

        try {
          await sendWhatshAppMessage(user.phoneNumber, rawCode);
          sent = true;
        } catch (err) {
          console.error("Erreur WhatsApp:", err);
        }

        // Crée un petit JWT temporaire pour réessayer sans redemander l'identifiant
        const tempToken = jwt.sign(
          { userId: user.id, type: "resend_code", jti: generateToken(16) },
          JWT_SECRET,

          { expiresIn: TEMP_TOKEN_EXP }
        );

        return res.status(200).json({
          ok: true,
          message: "Un code de réinitialisation a été envoyé par WhatsApp.",
          tempToken,
        });
      }

      if (!sent) {
        // Logger l'incident pour le support
        console.warn(`Aucun moyen de contact pour l'utilisateur ${user.id}`);
      }

      return res.status(200).json({
        ok: true,
        message: "Aucun moyen de contact veilleuiz contacter le support",
      });
    } catch (err) {
      console.error("forgot-password error:", err);
      return res.status(200).json({
        ok: true,
        message:
          "Si un compte correspond à cet identifiant, un message vous a été envoyé.",
      });
    }
  }
);

export default router;
