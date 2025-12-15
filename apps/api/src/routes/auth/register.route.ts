import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { registerFormSchema, RegisterFormType, z } from "@stackschool/shared";
import { generateToken } from "../../lib/outils";

const router = Router();
async function sendWhatsAppCode(phoneNumber: string, code: number) {
  console.log(`code: ${code} numéro: ${phoneNumber} `);
}
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parseResult = registerFormSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        ok: false,
        valid: false,
        message: parseResult.error.issues,
      });
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
        return res.status(400).json({ error: "Email déjà utilisé" });
      }
      if (existing?.username === username) {
        return res
          .status(400)
          .json({ error: "Nom d'utilisateur déjà utilisé" });
      }
      if (safePhone && existing.phoneNumber === safePhone) {
        return res
          .status(400)
          .json({ error: "Numéro de téléphone déjà utilisé" });
      }
      return res.status(400).json({ error: "Utilisateur déjà existant" });
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
      const code = Math.floor(100000 * Math.random() * 9000000);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
      /* await prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
          },
        });
        await prisma.verificationCode.create({
          data: {
            code,
            expiresAt,
            userId: user.id,
          },
        }); */

      try {
        await sendWhatsAppCode(phoneNumber, code);
      } catch (sendErr) {
        console.error("Erreur envoi WhatsApp:", sendErr);
        // ne bloque pas la création, mais informe le client
      }
    }

    req.login(user, async (err: any) => {
      if (err)
        return res.status(500).json({ error: "Login after register failed" });

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
        return res.status(201).json({
          ok: true,
          message:
            "Inscription réussie. Un code de vérification a été envoyé sur WhatsApp.",
          user: {
            id: user.id,
            username: user.username, // username est maintenant 'username'
            email: user.email,
            phoneNumber: user.phoneNumber,
          },
          requireVerification: true,
        });
      }

      return res.status(201).json({
        ok: true,
        message: "Inscription réussie",
        user: { id: user.id, username: user.username, email: user.email },
        redirect: user.profileCompleted
          ? "/dashboard"
          : "/auth/finish?from=local&complete=false",
      });
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
