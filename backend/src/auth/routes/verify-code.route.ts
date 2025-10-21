import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../../lib/prisma";
import { generateToken, hashCode, hashToken } from "../../lib/outils";

const router = Router();

router.post(
  "/verify-code",
  body("identifier").notEmpty(),
  body("code").notEmpty(),
  async (req, res) => {
    try {
      const { identifier, code } = req.body as {
        identifier: string;
        code: string;
      };

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: identifier },
            { email: identifier },
            { username: identifier },
            { phoneNumber: identifier },
          ],
        },
      });

      if (!user) {
        // generic response
        return res
          .status(400)
          .json({ ok: false, message: "Code invalide ou expiré" });
      }

      const codeHash = hashCode(code);
      const now = new Date();

      const v = await prisma.verificationCode.findFirst({
        where: {
          userId: user.id,
          method: "whatsapp",
          type: "password_reset",
          codeHash,
          expiresAt: { gt: now },
          used: false,
        },
        orderBy: { createdAt: "desc" },
      });
      if (!v) {
        await prisma.verificationCode.updateMany({
          where: {
            userId: user.id,
            type: "password_reset",
            method: "whatsapp",
            used: false,
            expiresAt: { gt: now },
          },
          data: { attempts: { increment: 1 } },
        });
        return res
          .status(404)
          .json({ ok: false, message: "Code invalide ou expiré" });
      }
      await prisma.verificationCode.update({
        where: { id: v.id },
        data: { used: true },
      });
      const rawToken = generateToken(16);
      const tokenHash = hashToken(rawToken);
      const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 min

      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          type: "password_reset",
          method: "whatsapp",
          expiresAt: tokenExpiresAt,
          used: false,
          tokenHash,
        },
      }); // Return the raw token to the client (only now, once)
      return res.status(200).json({
        ok: true,
        message:
          "Code vérifié. Vous pouvez maintenant réinitialiser votre mot de passe.",
        resetToken: rawToken, // client uses this in /reset-password
        expiresIn: 5 * 60, // seconds
      });
    } catch (err) {
      console.error("verify-phone error:", err);
      return res.status(500).json({ ok: false, message: "Erreur serveur" });
    }
  }
);

export default router;
