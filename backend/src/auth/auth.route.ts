import Router from "express";
import type { Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  try {
    if (!usernameOrEmail || !password)
      return res.status(404).json({ error: "Email ou mot de passe incorret" });
    console.log(usernameOrEmail, password);
  } catch (error) {
    console.error("Erreur serveur login", error);
  }
});

export default router;
