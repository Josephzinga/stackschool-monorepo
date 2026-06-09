"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassSubjectsForTeacher = void 0;
const api_errors_1 = require("../utils/api-errors");
const createClassSubjectsForTeacher = async ({ classSubjects, tx, teacherId, }) => {
    if (!teacherId)
        return;
    for (const classSubject of classSubjects) {
        for (const subjectId of classSubject.subjectIds) {
            const existingClassSubjects = await tx.classSubjects.findFirst({
                where: {
                    subjectId: subjectId,
                    group: {
                        classes: {
                            some: {
                                id: classSubject.classId,
                            },
                        },
                    },
                },
            });
            if (!existingClassSubjects) {
                throw (0, api_errors_1.createServiceError)('Assignation introuvable');
            }
            const newClassSubject = await tx.classSubjects.update({
                where: {
                    groupId_subjectId: {
                        subjectId: existingClassSubjects?.subjectId,
                        groupId: existingClassSubjects.groupId,
                    },
                },
                data: {
                    teacherId,
                },
            });
        }
    }
};
exports.createClassSubjectsForTeacher = createClassSubjectsForTeacher;
//# sourceMappingURL=createClassSubjectsForTeacher.js.map