import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { sessionToken: refreshToken },
      });
      res.clearCookie("refresh_token");
    }

    req.logout((err) => {
      if (err) console.error("Erreur logout:", err);

      req.session?.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
      });
    });
  } catch (err) {
    console.error("Erreur server logout");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
