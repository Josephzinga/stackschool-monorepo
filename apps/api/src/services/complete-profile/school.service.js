"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSchoolCreation = handleSchoolCreation;
const api_errors_1 = require("../../utils/api-errors");
async function handleSchoolCreation(tx, userId, schoolData, role) {
    if (schoolData.type === 'create') {
        const newSchool = await tx.school.create({
            data: {
                name: schoolData.newSchool.name,
                address: schoolData.newSchool.address,
                code: schoolData.newSchool.code,
                memberships: {
                    create: {
                        userId,
                        role: 'ADMIN',
                        isOwner: true,
                    },
                },
            },
        });
        return newSchool.id;
    }
    console.log('SchoolData', schoolData);
    if (schoolData.type === 'join') {
        const schoolUser = await tx.schoolUser.create({
            data: {
                schoolId: schoolData.schoolSelected.id,
                userId,
                role,
            },
        });
        console.log('schoolUser', schoolUser);
        const school = await tx.school.findUnique({
            where: { id: schoolData.schoolSelected?.id },
        });
        if (!school) {
            throw (0, api_errors_1.createServiceError)("L'école sélectionnée n'existe plus.");
        }
        return school.id;
    }
    throw (0, api_errors_1.createServiceError)("Type d'action école invalide.");
}
//# sourceMappingURL=school.service.js.map