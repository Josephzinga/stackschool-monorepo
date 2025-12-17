import { Router, NextFunction, Request, Response } from "express";
import passport from "passport";
import { Profile, User } from "@stackschool/db";
import { createServiceError } from "../../utils/api-response";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../lib/outils";

const router = Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
type UserWithProfile = User & {
  profile: Profile;
};

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (err: any, user: UserWithProfile, info: any) => {
      try {
        if (err) {
          return next(err); // Passe l'erreur au gestionnaire centralisé
        }

        if (info) {
          console.log("info:", info);
          // Les messages d'info de Passport sont des erreurs d'authentification (401)
          return next(
            createServiceError(info.message, 401, {
              isSocialOnly: info.isSocialOnly,
              provider: info.provider,
            })
          );
        }

        if (info?.isSocialOnly) {
          const providers = Array.isArray(info.providers)
            ? info.providers.join(",")
            : info.providers || "";

          return res.status(403).json({
            ok: false,
            isSocialOnly: true,
            providers,
            message: "Compte social uniquement — complétez votre profil.",
          });
        }

        if (!user) {
          const msg = info?.message || "Identifiants invalides";
          return next(createServiceError(msg, 401));
        }

        req.login(user, async (loginErr: any) => {
          if (loginErr) {
            console.error("req.login error:", loginErr);
            return next(
              createServiceError("La connexion a échoué", 500, loginErr)
            );
          }

          const refreshToken = generateToken(32);
          const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

          await prisma.session.create({
            data: {
              sessionToken: refreshToken,
              userId: user.id,
              expires,
            },
          });

          // cookie (même options que ton code précédent)
          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 25,
          });

          // Toujours répondre avec du JSON
          return res.json({
            ok: true,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              phoneNumber: user.phoneNumber,
              profileCompleted: user.profileCompleted,
            },
          });
        });
      } catch (error: any) {
        console.error("Error in local login callback:", error);
        return next(error);
      }
    }
  )(req, res, next);
});
export default router;
