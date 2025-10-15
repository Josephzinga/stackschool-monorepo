import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import body from "express-validator";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await prisma.user.findUnique({
      where: email,
    });

    if (existing) return res.status(409).json({ error: "Email déjà utiliser" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: { firstname: firstname ?? "", lastname: lastname ?? "" },
        },
      },
      include: { profile: true },
    });

    return res
      .status(201)
      .json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});
export default router;
