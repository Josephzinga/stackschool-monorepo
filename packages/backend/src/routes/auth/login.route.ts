import { Router } from "express";
import passport from "passport";
import { User } from "@stackschool/db";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../lib/outils";

const router = Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any | false, info: any) => {
    console.log("user dans login (auth callback) =>", user, "info=>", info);
    try {
      if (err) {
        if (req.headers.accept?.includes("application/json")) {
          return res.status(500).json({ ok: false, message: "Server error" });
        }
        return res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
      }

      if (info?.isSocialOnly) {
        const providers = Array.isArray(info.providers)
          ? info.providers.join(",")
          : info.providers || "";

        const redirectUrl = `${FRONTEND_ORIGIN}/auth/finish?from=social&providers=${encodeURIComponent(
          providers
        )}`;

        if (req.headers.accept?.includes("application/json")) {
          console.log("joseph");
          return res.status(403).json({
            ok: false,
            isSocialOnly: true,
            redirectUrl,
            providers,
            message: "Compte social uniquement — complétez votre profil.",
          });
        }

        return res.redirect(redirectUrl);
      }

      if (!user) {
        const msg = info?.message || "Identifiants invalides";
        if (req.headers.accept?.includes("application/json")) {
          return res.status(401).json({ ok: false, message: msg });
        }
        return res.redirect(
          `${FRONTEND_ORIGIN}/auth/login?error=${encodeURIComponent(msg)}`
        );
      }

      // IMPORTANT : si on utilise un callback personnalisé, on doit appeler req.login
      req.login(user, async (loginErr: any) => {
        if (loginErr) {
          console.error("req.login error:", loginErr);
          if (req.headers.accept?.includes("application/json")) {
            return res.status(500).json({ ok: false, message: "Login failed" });
          }
          return res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
        }

        // création du refresh token dans ta table session
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

        const profileComplete = Boolean(
          user.profile &&
            user.username &&
            user.profile.firstname &&
            user.profile.lastname
        );

        const redirectUrl = profileComplete
          ? `${process.env.FRONTEND_URL}/dashboard`
          : `${process.env.FRONTEND_URL}/auth/finish?from=local&complete=false`;

        // Réponse JSON si fetch/axios, sinon redirect
        if (req.headers.accept?.includes("application/json")) {
          return res.json({
            ok: true,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              phoneNumber: user.phoneNumber,
            },
            redirectUrl,
          });
        }

        return res.redirect(redirectUrl);
      });
    } catch (e) {
      console.error("Error in local login callback:", e);
      if (req.headers.accept?.includes("application/json")) {
        return res.status(500).json({ ok: false, message: "Server error" });
      }
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/login?error=server`
      );
    }
  })(req, res, next);
});
export default router;
