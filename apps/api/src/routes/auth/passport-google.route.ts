import { Router } from 'express';
import passport from 'passport';
import { handleSocialWebCallback } from '../../controllers/social-web.controller';

const router = Router();

router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(
    req,
    res,
    next,
  );
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    session: true,
  }),
  (req, res, next) => handleSocialWebCallback(req, res, next, 'google'),
);

export default router;
