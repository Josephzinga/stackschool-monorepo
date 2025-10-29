import { Router, type Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { hashToken } from "../../lib/outils";
import { resetPasswordValidation } from "../../lib/validation-schema";

const router = Router();

router.post(
  "/reset-password",
  resetPasswordValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          errors: errors.array(),
        });
      }

      const { token, password } = req.body as {
        token: string;
        password: string;
      };

      const now = new Date();

      // hasher le token pour comparaison
      const tokenHash = hashToken(token);

      // chercher le token valide
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          tokenHash,
          type: "password_reset",
          used: false,
          expiresAt: {
            gt: now, // Vérifie que le token n'est pas expiré
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // vérifier si le token existe et est valide
      if (!verificationToken) {
        return res.status(400).json({
          ok: false,
          message: "Token invalide, expiré ou déjà utilisé",
        });
      }

      // vérifier que l'utilisateur existe
      if (!verificationToken.user) {
        return res.status(400).json({
          ok: false,
          message: "Utilisateur non trouvé",
        });
      }

      // hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // 7️utiliser une transaction pour garentir l'integriter
      await prisma.$transaction(async (tx) => {
        // a. Mettre à jour le mot de passe utilisateur
        await tx.user.update({
          where: {
            id: verificationToken.user.id,
          },
          data: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        });

        // b. Marquer le token comme utilisé
        await tx.verificationToken.update({
          where: {
            id: verificationToken.id,
          },
          data: {
            used: true,
            updateAt: new Date(),
          },
        });

        // c. Invalider tous les autres tokens de réinitialisation pour cet utilisateur
        await tx.verificationToken.updateMany({
          where: {
            userId: verificationToken.user.id,
            type: "password_reset",
            used: false,
          },
          data: {
            used: true,
          },
        });

        // d. Invalider les codes de réinitialisation (au cas où)
        await tx.verificationCode.updateMany({
          where: {
            userId: verificationToken.user.id,
            type: "password_reset",
            used: false,
          },
          data: {
            used: true,
          },
        });
      });

      // 8️⃣ RÉPONSE DE SUCCÈS
      return res.status(200).json({
        ok: true,
        message:
          "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
      });
    } catch (err) {
      console.error("reset-password error:", err);

      // 9️⃣ GESTION D'ERREUR SÉCURISÉE
      return res.status(500).json({
        ok: false,
        message: "Erreur lors de la réinitialisation du mot de passe",
      });
    }
  }
);

export default router;
