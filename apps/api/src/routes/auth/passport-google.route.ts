import { Router } from 'express';
import passport from 'passport';
import { getPlateForm } from '../../utils/deep.link';
import { handleSocialWebCallback } from '../../controllers/social-web.controller';

const router = Router();

router.get('/google', (req, res, next) => {
  const state = getPlateForm(req);

  passport.authenticate('google', { scope: ['email', 'profile'], state })(
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
  (req, res) => handleSocialWebCallback(req, res, 'google'),
);

export default router;
