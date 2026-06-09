"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("@stackschool/db");
const auth_1 = require("../../middlewares/auth");
const api_errors_1 = require("../../utils/api-errors");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const shared_1 = require("@stackschool/shared");
const router = (0, express_1.Router)();
router.get('/students/search', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const { searchTerm, schoolId } = req.query;
        console.log('query', searchTerm, 'SchoolId', schoolId);
        const errors = (0, validate_schema_util_1.safeValidateSchema)(shared_1.searchStudentSchema, {
            searchTerm,
            schoolId,
        });
        if (errors)
            return next(errors);
        const students = await db_1.prisma.student.findMany({
            where: {
                schoolId: schoolId,
                OR: [
                    { matricule: { contains: searchTerm, mode: 'insensitive' } },
                    {
                        profile: {
                            firstname: { contains: searchTerm, mode: 'insensitive' },
                        },
                    },
                    {
                        profile: {
                            lastname: { contains: searchTerm, mode: 'insensitive' },
                        },
                    },
                ],
            },
            take: 10,
            select: {
                id: true,
                matricule: true,
                schoolClass: {
                    select: { name: true },
                },
                profile: {
                    select: {
                        firstname: true,
                        lastname: true,
                        photo: true,
                    },
                },
            },
        });
        const formattedStudents = students.map((s) => ({
            id: s.id,
            matricule: s.matricule,
            firstName: s.profile.firstname,
            lastName: s.profile.lastname,
            photo: s.profile.photo,
            className: s.schoolClass?.name,
        }));
        return res.json({
            ok: true,
            students: formattedStudents,
        });
    }
    catch (error) {
        next((0, api_errors_1.createServiceError)('Erreur lors de la recherche des étudiants', 500, error));
    }
});
exports.default = router;
//# sourceMappingURL=search-school-student.route.js.map