import { Router, Response, Request } from "express";
import { Profile, User } from "../../generated/client";
const router = Router();

router.get("/me", async (req: Request, res: Response) => {
  if (!req.isAuthenticated?.()) {
    return res.json({ user: null });
  }

  const user = req.user as any;
  console.log("user:", user);
  return res.json({
    user: {
      email: user.email ?? null,
      id: user.id,
      phoneNumber: user.phoneNumber,
      profile: user.profile ?? null,
    },
  });
});

export default router;
