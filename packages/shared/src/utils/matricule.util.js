"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMatricule = generateMatricule;
exports.generateStudentMatricule = generateStudentMatricule;
function generateMatricule(type) {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    switch (type) {
        case 'STUDENT':
            return `STU-${year}-${randomPart}`;
        case 'TEACHER':
            return `TCH-${year}-${randomPart}`;
        case 'SCHOOL':
            return `SCH-${randomPart}${Math.floor(Math.random() * 100)}`;
        case 'CLASS':
            return `CLS-${randomPart}`;
        default:
            return `GEN-${randomPart}`;
    }
}
function generateStudentMatricule(firstname, lastname) {
    if (!firstname || !lastname)
        return '';
    const year = new Date().getFullYear();
    const initials = (firstname[0] + lastname[0]).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${initials}${year}-${random}`;
}
//# sourceMappingURL=matricule.util.js.map