"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../../lib/redis");
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../utils/api-errors");
const auth_1 = require("../../middlewares/auth");
const generatedMatricule_1 = require("../../lib/generatedMatricule");
const router = (0, express_1.Router)();
router.get('/context', auth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const redisKey = `complete_profile:${userId}`;
        const progressData = await redis_1.redisClient.get(redisKey);
        if (!progressData)
            return res.status(404).json({
                ok: false,
                message: 'Aucune progression trouver',
            });
        const { school, invitationCode } = JSON.parse(progressData);
        console.log('school', school, 'invitationCode', invitationCode);
        if (!school) {
            console.log('Aucune école sélectionnée');
            return res.status(400).json({
                ok: false,
                message: 'Aucune école sélectionnée',
            });
        }
        let schoolId;
        let schoolDetails;
        let classes = [];
        let existingStudent;
        switch (school.type) {
            case 'join':
                schoolId = school.schoolId;
                break;
            case 'invite':
                schoolId = school.schoolId;
                break;
        }
        schoolDetails = await db_1.prisma.school.findUnique({
            where: { id: schoolId },
            select: {
                name: true,
                id: true,
                logo: true,
                code: true,
                classes: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        _count: {
                            select: { students: true },
                        },
                    },
                    orderBy: { name: 'asc' },
                },
            },
        });
        console.log('schoolDetails', schoolDetails);
        if (!schoolDetails) {
            (0, api_errors_1.createServiceError)('Ecole non trouvé', 404);
            return;
        }
        classes = schoolDetails.classes;
        const suggestMatricule = await (0, generatedMatricule_1.generatSuggestedMatricule)(schoolId);
        const academicYear = (0, generatedMatricule_1.getCurrentAcademicYear)();
        return res.json({
            ok: true,
            context: {
                school: {
                    id: schoolDetails.id,
                    name: schoolDetails.name,
                    code: schoolDetails.code,
                },
                suggestMatricule,
                classes,
                academicYear,
            },
        });
    }
    catch (e) {
        (0, api_errors_1.createServiceError)('Erreur lors du chargement du contexte', 500, e);
    }
});
exports.default = router;
//# sourceMappingURL=student-context.route.js.map