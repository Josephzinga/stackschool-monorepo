import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { registerFormSchema } from "@stackschool/shared";
import { generate6Code, generateToken, hashCode } from "../../lib/outils";
import { createServiceError } from "../../utils/api-response";

const router = Router();

/**
 * Envoie une réponse API standardisée.
 * @param res L'objet Response d'Express.
 * @param statusCode Le code de statut HTTP.
 * @param data Les données à inclure dans la réponse.
 */
function sendApiResponse(res: Response, statusCode: number, data: object) {
  const ok = statusCode >= 200 && statusCode < 300;
  return res.status(statusCode).json({
    ok,
    ...data,
  });
}

async function sendWhatsAppCode(phoneNumber: string, code: string) {
  console.log(`code: ${code} numéro: ${phoneNumber} `);
}
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = registerFormSchema.safeParse(req.body);

      if (!parseResult.success) {
        // Lève une erreur Zod qui sera attrapée par le gestionnaire d'erreurs
        throw parseResult.error;
      }

      const { email, password, username, phoneNumber } = parseResult.data;

      const safeEmail = email?.trim() || undefined;
      const safePhone = phoneNumber?.trim() || undefined;

      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email: safeEmail }, { phoneNumber: safePhone }],
        },
      });

      if (existing) {
        if (safeEmail && existing?.email === safeEmail) {
          throw createServiceError("Email déjà utilisé", 409);
        }
        if (existing?.username === username) {
          throw createServiceError("Nom d'utilisateur déjà utilisé", 409);
        }
        if (safePhone && existing.phoneNumber === safePhone) {
          throw createServiceError("Numéro de téléphone déjà utilisé", 409);
        }

        // Ce cas est probablement redondant mais gardé pour la sécurité
        throw createServiceError(
          "Un utilisateur avec ces informations existe déjà",
          409
        );
      }

      const hashed = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email: safeEmail,
          password: hashed,
          username,
          isVerified: phoneNumber ? false : true,
          phoneNumber: safePhone,
        },
      });
      console.log("hashed password", hashed);

      if (phoneNumber) {
        const code = generate6Code();
        const codeHash = hashCode(code);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
        await prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
          },
        });
        await prisma.verificationCode.create({
          data: {
            codeHash,
            expiresAt,
            userId: user.id,
          },
        });

        try {
          await sendWhatsAppCode(phoneNumber, code);
        } catch (sendErr) {
          console.error("Erreur envoi WhatsApp:", sendErr);
          // ne bloque pas la création, mais informe le client
        }
      }

      req.login(user, async (err: any) => {
        if (err) {
          return next(
            createServiceError(
              "La connexion après l'inscription a échoué",
              500,
              err
            )
          );
        }

        const refreshToken = generateToken(32);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

        await Promise.all([
          prisma.session.create({
            data: {
              sessionToken: refreshToken,
              userId: user.id,
              expires,
            },
          }),
          prisma.account.create({
            data: {
              provider: "local",
              providerAccountId: user.id,
              userId: user.id,
            },
          }),
        ]);

        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 25,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        if (phoneNumber) {
          return sendApiResponse(res, 201, {
            message:
              "Inscription réussie. Un code de vérification a été envoyé sur WhatsApp.",
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              phoneNumber: user.phoneNumber,
            },
            requireVerification: true,
          });
        }

        return sendApiResponse(res, 201, {
          message: "Inscription réussie",
          user: { id: user.id, username: user.username, email: user.email },
          redirect: user.profileCompleted
            ? "/dashboard"
            : "/auth/finish?from=local&complete=false",
        });
      });
    } catch (err) {
      next(err); // Passe l'erreur au gestionnaire centralisé
    }
  }
);

export default router;
