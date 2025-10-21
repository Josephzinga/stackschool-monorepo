import { generateToken } from "../../lib/outils";
import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"]; // recupére le cookie dans le headers

    if (!refreshToken)
      return res.status(401).json({ error: "no_refresh_token" });
    // recupére la session conrrespante
    const dbSession = await prisma.session.findUnique({
      where: { sessionToken: refreshToken },
    });

    if (!dbSession || dbSession.expires < new Date()) {
      // si token abssent ou expiré
      if (dbSession) {
        await prisma.session.delete({
          where: { id: dbSession.id },
        });
      }
      res.clearCookie("refresh_token");
      return res.status(401).json({ error: "invalid_refresh_token" });
    }
    // recherche l'utilisateur avec cette session et son profile inclut
    const user = await prisma.user.findUnique({
      where: { id: dbSession.userId as string },
      include: { profile: true },
    });

    if (!user) {
      await prisma.session.delete({
        where: { id: dbSession.id },
      });
      res.clearCookie("refresh_token");
      return res.status(401).json({ error: "user_not-found" });
    }

    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    await prisma.session.delete({
      where: { id: dbSession.id },
    });

    const newRefreshToken = generateToken(32);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

    await prisma.session.create({
      data: {
        sessionToken: newRefreshToken,
        userId: user.id,
        expires,
      },
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 25,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("refresh_error", error);
    return res.status(500).json({ error: "errer_server" });
  }
});

export default router;
