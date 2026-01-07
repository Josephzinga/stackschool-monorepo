import { Router } from 'express';
import getSchoolsClassesRoute from './get-school-classes.route';
import SearchSchoolRoute from './search-school.route';
import createInvitationRoute from './create-invitation.route';
import searchSchoolStudentsRoute from './search-school-student.route';

const router = Router();

router.use('/schools', getSchoolsClassesRoute);
router.use('/schools', SearchSchoolRoute);
router.use('/schools', createInvitationRoute);
router.use('/schools', searchSchoolStudentsRoute);

export default router;
