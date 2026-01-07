import { Router } from 'express';

const router = Router();

router.post('/verify-invitation', async (req, res, next) => {
  const { invitationCode } = req.body;
});