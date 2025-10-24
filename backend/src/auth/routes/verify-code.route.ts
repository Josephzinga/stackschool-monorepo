import { Router, type Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../lib/prisma";
import { generateToken, hashCode, hashToken } from "../../lib/outils";
import { consumeCode } from "../../utils/limiter";
import jwt from "jsonwebtoken";
import { JWT_SECRET, RESET_TOKEN_EXP_MINUTES } from "../../constant/config";

const router = Router();

router.post(
  "/verify-code",
  [
    body("code")
      .notEmpty()
      .withMessage("Le code est requis")
      .isLength({ min: 6, max: 6 })
      .withMessage("Le code doit contenir 6 chiffres")
      .matches(/^\d+$/)
      .withMessage("Le code doit contenir uniquement des chiffres"),
    body("tempToken").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      try {
        await consumeCode(req);
      } catch (RateLimiterQueueError) {
        return res.status(429).json({
          ok: false,
          message: "Trop de tentatives. Veuillez réessayer dans 15 minutes.",
        });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array(), ok: false });

      const { tempToken, code } = req.body as {
        tempToken: string;
        code: string;
      };

      if (!tempToken) {
        return res.status(400).json({
          ok: false,
          message: "Identifiant ou token requis",
        });
      }

      let userId: string;

      try {
        const decoded = jwt.verify(tempToken, JWT_SECRET) as any;
        console.log("decoded:", decoded);

        if (decoded?.type !== "resend_code") {
          return res.status(400).json({ ok: false, message: "Token invalide" });
        }

        userId = decoded.userId;
      } catch (jwtError) {
        return res
          .status(400)
          .json({ ok: false, message: "Token expiré ou invalide" });
      }

      const codeHash = hashCode(code);
      const now = new Date();

      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          userId,
          method: "whatsapp",
          type: "password_reset",
          expiresAt: { gt: now },
          used: false,
        },
        orderBy: { createdAt: "desc" },
      });
      console.log("verificationCode:", verificationCode);
      if (!verificationCode) {
        return res
          .status(404)
          .json({ ok: false, message: "Code invalide ou expiré" });
      }

      // vérifier les tentatives
      if (verificationCode.attempts >= 5) {
        return res.status(400).json({
          ok: false,
          message: "Trop de tentatives. Veuillez demander un nouveau code.",
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

      // code valide marquer comme utilisé et générer le token de reset
      await prisma.$transaction(async (tx) => {
        // marquer le code comme utiliser
        tx.verificationCode.update({
          where: { id: verificationCode.id },
          data: { used: true, updateAt: new Date() },
        });

        // invalider les autre code non utiliser
        await Promise.all([
          tx.verificationCode.updateMany({
            where: { userId, type: "password_reset", used: false },
            data: { used: true },
          }),
        ]);
      });

      const rawToken = generateToken(16);
      const tokenHash = hashToken(rawToken);
      const tokenExpiresAt = new Date(
        Date.now() + 1000 * 60 * RESET_TOKEN_EXP_MINUTES
      );

      await prisma.verificationToken.create({
        data: {
          userId,
          type: "password_reset",
          method: "whatsapp",
          expiresAt: tokenExpiresAt,
          used: false,
          tokenHash,
        },
      });
      return res.status(200).json({
        ok: true,
        message:
          "Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.",
        resetToken: rawToken,
        expiresIn: 15 * 60, // 15 minutes en secondes
      });
    } catch (err) {
      console.error("verify-phone error:", err);
      return res.status(500).json({
        ok: false,
        message: "Erreur lors de la vérification du code",
      });
    }
  }
);

export default router;
