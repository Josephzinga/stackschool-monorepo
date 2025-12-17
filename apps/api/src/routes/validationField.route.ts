import { Router } from "express";
import { prisma } from "../lib/prisma";
import { validateUserFieldSchema } from "../lib/validation-schema";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/user-field", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const parseResult = validateUserFieldSchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(400).json({
        ok: false,
        valid: false,
        message: "Format invalide",
      });
    }

    const { email, phoneNumber } = parseResult.data;
    console.log("email in validate=>", email);

    // check email uniqueness
    if (email && user?.email !== email) {
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return res.json({
          ok: true,
          valid: false,
          field: "email",
          message: "Cet email est déjà utilisé.",
        });
      }
    }

    if (phoneNumber && user?.phoneNumber !== phoneNumber) {
      const user = await prisma.user.findUnique({ where: { phoneNumber } });

      if (user) {
        return res.json({
          ok: true,
          valid: false,
          field: "phone",
          message: "Ce numéro est déjà utilisé.",
        });
      }
    }

    // everything ok
    return res.json({
      ok: true,
      valid: true,
    });
  } catch (err) {
    console.error("validate user field error:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
});

export default router;
