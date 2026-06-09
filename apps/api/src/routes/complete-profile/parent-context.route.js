"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../../lib/redis");
const prisma_1 = require("../../lib/prisma");
const api_errors_1 = require("../../utils/api-errors");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/context', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const redisKey = `complete_profile:${userId}`;
        const progressData = await redis_1.redisClient.get(redisKey);
        if (!progressData) {
            return res.status(404).json({
                ok: false,
                message: 'Aucune progression trouvée',
            });
        }
        const { school } = JSON.parse(progressData);
        console.log('school dans le contexte parents', school);
        if (!school || !school.schoolId) {
            return res.status(400).json({
                ok: false,
                message: 'Aucune école sélectionnée',
            });
        }
        const schoolDetails = await prisma_1.prisma.school.findUnique({
            where: {
                id: school.schoolId,
            },
            select: {
                id: true,
                name: true,
                code: true,
                students: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        matricule: true,
                        profile: {
                            select: {
                                firstname: true,
                                lastname: true,
                            },
                        },
                    },
                    orderBy: { matricule: 'asc' },
                },
            },
        });
        if (!schoolDetails) {
            return res.status(404).json({
                ok: false,
                message: 'Aucune école trouver',
            });
        }
        console.log('students schoolDetails', schoolDetails.students);
        const students = schoolDetails.students.map((student) => ({
            id: student.id,
            matricule: student.matricule,
            fullName: `${student.profile.firstname || ''} ${student.profile.lastname || ''}`.trim(),
        }));
        console.log('Students', students);
        return res.json({
            ok: true,
            context: {
                school: {
                    id: schoolDetails.id,
                    name: schoolDetails.name,
                    code: schoolDetails.code,
                },
                students,
            },
        });
    }
    catch (e) {
        throw (0, api_errors_1.createServiceError)('Erreur lors du chargement du contexte', 500, e);
    }
});
exports.default = router;
//# sourceMappingURL=parent-context.route.js.map