"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatSuggestedMatricule = generatSuggestedMatricule;
exports.getCurrentAcademicYear = getCurrentAcademicYear;
const prisma_1 = require("./prisma");
async function generatSuggestedMatricule(schoolId) {
    try {
        const currentYear = new Date().getFullYear();
        const countStudent = await prisma_1.prisma.student.count({
            where: {
                schoolId,
                enrollmentYear: currentYear.toString(),
            },
        });
        const school = await prisma_1.prisma.school.findUnique({
            where: {
                id: schoolId,
            },
            select: { code: true },
        });
        const sequence = (currentYear + 1).toString().padStart(3, '0');
        return `${currentYear}-${school?.code || 'SCH'}-${sequence}`;
    }
    catch (e) {
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${Date.now().toString().slice(-4)}`;
    }
}
function getCurrentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}-${year + 1}`;
}
//# sourceMappingURL=generatedMatricule.js.map