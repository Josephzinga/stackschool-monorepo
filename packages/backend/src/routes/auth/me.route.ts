import { Router, Response, Request } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { Account, Profile, User } from "@stackschool/db";

const router = Router();

router.get("/me", isAuthenticated, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return;
  let provider = null;

  for (const p of user.Account) {
    if (p.provider) {
      provider = p.provider;
    }
  }

  return res.json({
    ok: true,
    user: {
      email: user.email ?? null,
      id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileCompleted: user.profileCompleted,
      provider,
      profile: user.profile ?? null,
    },
  });
});

export default router;
