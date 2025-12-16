import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies["refresh_token"];
      if (refreshToken) {
        await prisma.session.deleteMany({
          where: { sessionToken: refreshToken },
        });
        res.clearCookie("refresh_token");
      }

      req.logout((err) => {
        if (err) {
          return next(err);
        }

        req.session.destroy((destroyErr) => {
          if (destroyErr) return next(destroyErr);
          res.clearCookie("sid");
          res.json({ ok: true });
        });
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
