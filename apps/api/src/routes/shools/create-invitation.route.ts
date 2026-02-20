import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { createInvitationSchema } from '@stackschool/shared';
import { createAndSendInvitation } from '../../services/invitation.service';
import { safeValidateSchema } from '../../utils/validate-schema.util';

const router = Router();

router.post('/invitations', isAuthenticated, async (req, res, next) => {
  try {
    const errors = safeValidateSchema(createInvitationSchema, req.body);
    if (errors) return next(errors);
    const invitationData = req.body;

    const invitation = await createAndSendInvitation(invitationData);

    res.status(201).json({
      ok: true,
      message: 'Invitation envoyée avec succès.',
      invitation,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
