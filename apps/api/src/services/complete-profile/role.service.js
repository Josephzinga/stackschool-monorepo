"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoleCreation = handleRoleCreation;
async function handleRoleCreation(tx, userId, schoolId, roleData) {
    const role = roleData.role;
    let schoolUser;
    const existingMember = await tx.schoolUser.findUnique({
        where: { schoolId_userId: { schoolId, userId } },
    });
    if (existingMember) {
        schoolUser = existingMember;
    }
    else {
        schoolUser = await tx.schoolUser.create({
            data: {
                userId,
                schoolId,
                role,
            },
        });
    }
    switch (roleData.role) {
        case 'TEACHER':
            if (roleData.teacher) {
                const teacher = await tx.teacher.create({
                    data: {
                        schoolUserId: schoolUser.id,
                        diploma: roleData.teacher.diploma,
                        department: roleData.teacher.department,
                        isActive: true,
                    },
                });
                if (roleData.teacher.assignments &&
                    roleData.teacher.assignments.length > 0) {
                    for (const assignment of roleData.teacher.assignments) {
                        if (assignment.isMainTeacher) {
                            await tx.class.update({
                                where: {
                                    id: assignment.classId,
                                },
                                data: {
                                    supervisorId: teacher.id,
                                },
                            });
                        }
                        if (assignment.subjectIds && assignment.subjectIds.length > 0) {
                            for (const subjectID of assignment.subjectIds) {
                                try {
                                    await tx.classSubjects.update({
                                        where: {
                                            subjectId: subjectID,
                                            group: {
                                                classes: {
                                                    some: {
                                                        id: assignment.classId,
                                                    },
                                                },
                                            },
                                        },
                                        data: {
                                            teacherId: teacher.id,
                                        },
                                    });
                                }
                                catch (e) {
                                    console.warn(`Impossible de lier le prof ${teacher.id} à la matière ${subjectID} dans la classe ${assignment.classId} (Lien inexistant ?)`);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'STUDENT':
            const { id: profileId } = await tx.profile.findUniqueOrThrow({
                where: { userId },
            });
            const { matricule, motherName, fatherName, birthDate, nationality, enrollmentYear, classId, birthPlace, } = roleData.student;
            if (roleData.student) {
                await tx.student.create({
                    data: {
                        schoolUserId: schoolUser.id,
                        classId,
                        matricule,
                        motherName,
                        fatherName,
                        birthDate,
                        nationality,
                        enrollmentYear,
                        birthPlace,
                        schoolId,
                        profileId,
                    },
                });
            }
            break;
        case 'PARENT':
            if (roleData.parent) {
                const parent = await tx.parent.create({
                    data: {
                        schoolUserId: schoolUser.id,
                        profession: roleData.parent.profession,
                        contactPreference: roleData.parent.contactPreference,
                    },
                });
                if (roleData.parent.children && roleData.parent.children.length > 0) {
                    for (const child of roleData.parent.children) {
                        await tx.parentStudent.create({
                            data: {
                                parentId: parent.id,
                                studentId: child.id,
                                relationType: child.relation,
                            },
                        });
                    }
                }
            }
            break;
        case 'ADMIN':
            break;
    }
}
//# sourceMappingURL=role.service.js.map