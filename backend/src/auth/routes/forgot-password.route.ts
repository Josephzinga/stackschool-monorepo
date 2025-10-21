import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../../lib/prisma";
import {
  generate6Code,
  generateToken,
  hashCode,
  hashToken,
} from "../../lib/outils";

const router = Router();

router.post(
  "/forgot-password",
  body("identifier").notEmpty(),
  async (req, res) => {
    try {
      const { identifier } = req.body as { identifier: string };

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { phoneNumber: identifier },
            { email: identifier },
          ],
        },
      });

      if (!user) {
        return res.status(200).json({
          ok: true,
          message:
            "Si un compte correspond à cet identifiant, vous recevrez bientôt des instructions pour réinitialiser le mot de passe.",
        });
      }
      await prisma.verificationToken.updateMany({
        where: { userId: user.id, type: "password_reset", used: false },
        data: { used: true },
      });

      await prisma.verificationCode.updateMany({
        where: { userId: user.id, type: "password_reset", used: false },
        data: { used: true },
      });

      const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 min

      if (user.email) {
        const rawToken = generateToken(32);
        const tokenHash = hashToken(rawToken);

        await prisma.verificationToken.create({
          data: {
            tokenHash,
            userId: user.id,
            used: false,
            expiresAt,
            method: "email",
            type: "password_reset",
          },
        });

        /* try {
          await sendResetEmail(user.email, rawToken); // send raw token in link
        } catch (e) {
          console.error("sendResetEmail error:", e);
        }*/

        return res.status(200).json({
          ok: true,
          message:
            "Si un compte avec cet email existe, un lien de réinitialisation sera envoyé.",
        });
      }

      if (user?.phoneNumber) {
        const rawCode = generate6Code();
        const codeHash = hashCode(rawCode);

        await prisma.verificationCode.create({
          data: {
            userId: user.id,
            codeHash,
            attempts: 0,
            used: false,
            expiresAt,
            method: "whatsapp",
            type: "password_reset",
          },
        });
        /*   try {
          await sendWhatsAppCode(user.phoneNumber, rawCode);
        } catch (e) {
          console.error("sendWhatsAppCode error:", e);
        } */
        return res.status(200).json({
          ok: true,
          message:
            "Si un compte avec ce numéro existe, un code de réinitialisation a été envoyé par WhatsApp.",
        });
      }
      return res.status(200).json({
        ok: true,
        message:
          "Aucune méthode de contact disponible pour ce compte. Contactez le support.",
      });
    } catch (err) {
      console.error("forgot-password error:", err);
      return res.status(500).json({ ok: false, message: "Erreur serveur" });
    }
  }
);

export default router;
