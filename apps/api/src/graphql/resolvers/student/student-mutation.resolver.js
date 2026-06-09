"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentMutationResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const validate_schema_util_1 = require("../../../utils/validate-schema.util");
const shared_1 = require("@stackschool/shared");
const verify_role_1 = require("../../../lib/verify-role");
exports.studentMutationResolver = {
    Mutation: {
        createListStudent: async (_, { data }, { schoolId, user, prisma }) => {
            try {
                if (!user || !user.id) {
                    throw (0, api_errors_1.createServiceError)('Non authentifier', 401);
                }
                if (!schoolId) {
                    throw (0, api_errors_1.createServiceError)('identifiant manquant');
                }
                const birthDate = data.birthDate ? new Date(data.birthDate) : null;
                const { data: validData, errors, success, } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createStudentSchema, { ...data, birthDate });
                if (!success) {
                    return (0, api_errors_1.createServiceError)(errors[0].message, 400, errors);
                }
                const checkedRole = await (0, verify_role_1.isAdmin)({
                    context: { userId: user.id, schoolId },
                });
                if (!checkedRole.success) {
                    return (0, api_errors_1.createServiceError)(checkedRole?.message, 403);
                }
                console.log('tout ok', checkedRole, schoolId);
                await prisma.$transaction(async (tx) => {
                    const existingStudent = await tx.student.findUnique({
                        where: {
                            matricule_schoolId: {
                                matricule: validData?.matricule,
                                schoolId,
                            },
                        },
                    });
                    if (existingStudent) {
                        throw (0, api_errors_1.createServiceError)("C'est élève existe déjà dans l'établissement");
                    }
                    const user = await tx.user.create({
                        data: {
                            email: `email_student_${data?.matricule}@invalid`,
                            isActive: false,
                            profile: {
                                create: {
                                    lastname: data?.lastname,
                                    firstname: data?.firstname,
                                    gender: data?.gender,
                                },
                            },
                        },
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    });
                    const schoolUser = await tx.schoolUser.create({
                        data: {
                            userId: user?.id,
                            role: 'STUDENT',
                            schoolId,
                        },
                    });
                    await tx.student.create({
                        data: {
                            schoolId,
                            matricule: validData?.matricule,
                            enrollmentYear: validData?.enrollmentYear,
                            birthDate: new Date(validData?.birthDate),
                            birthPlace: validData?.birthPlace,
                            nationality: validData?.nationality,
                            schoolUserId: schoolUser.id,
                            profileId: user?.profile?.id,
                            classId: validData?.classId,
                        },
                    });
                });
                return {
                    ok: true,
                    message: 'Élève crée avec succés',
                };
            }
            catch (e) {
                const message = "Erreur lors de la création de l'élève.";
                (0, api_errors_1.createServiceError)(message, 500, e);
                return {
                    ok: false,
                    message,
                };
            }
        },
        updateStudent: async (_, { studentId, data: studentData }, { prisma, user, schoolId }) => {
            (0, verify_role_1.checkSchoolId)(schoolId);
            (0, verify_role_1.checkUser)(user);
            const { success, data, errors } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createStudentSchema, studentData);
            if (!success)
                throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation', 400, errors);
            const adminCheck = await (0, verify_role_1.isAdmin)({
                context: { schoolId, userId: user.id },
            });
            if (!adminCheck?.success) {
                throw (0, api_errors_1.createServiceError)(adminCheck?.message || 'Accès refusé', 403);
            }
            try {
                const existingStudent = await prisma.student.findUnique({
                    where: { id: studentId, schoolId },
                    include: {
                        schoolUser: {
                            select: {
                                user: true,
                            },
                        },
                    },
                });
                if (!existingStudent || existingStudent.schoolId !== schoolId) {
                    throw (0, api_errors_1.createServiceError)('Élève introuvable dans cette école', 404);
                }
                const { firstname, lastname, gender, address, parentData, matricule, medicalCondition, phoneNumber, allergies, isActive, classId, birthCertificateNumber, birthPlace, birthDate, enrollmentYear, nationality, enrollmentDate, bloodGroup, previousClass, previousSchool, status, email, } = data;
                console.log('data', data);
                return await prisma.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id: existingStudent.schoolUser?.user?.id },
                        data: {
                            email,
                            phoneNumber,
                            isActive,
                            profile: {
                                update: {
                                    firstname,
                                    lastname,
                                    gender,
                                    address,
                                },
                            },
                        },
                    });
                    if (parentData) {
                        let parentIdToLink = parentData?.parentId;
                        if (parentData?.mode === 'CREATE') {
                            let parentUser = await tx.user.findUnique({
                                where: {
                                    phoneNumber: parentData?.newParent?.phoneNumber,
                                },
                            });
                            if (!parentUser) {
                                parentUser = await tx.user.create({
                                    data: {
                                        phoneNumber: parentData.newParent?.phoneNumber,
                                        isActive: false,
                                        hasMembership: true,
                                        profileCompleted: true,
                                        profile: {
                                            create: {
                                                firstname: parentData.newParent?.firstname,
                                                lastname: parentData.newParent?.lastname,
                                                address: parentData.newParent?.address,
                                            },
                                        },
                                    },
                                });
                            }
                            const newParent = await tx.parent.create({
                                data: {
                                    profession: parentData.newParent?.profession,
                                    schoolUser: {
                                        create: {
                                            role: 'PARENT',
                                            userId: parentUser?.id,
                                            schoolId,
                                        },
                                    },
                                },
                            });
                            parentIdToLink = newParent.id;
                        }
                        if (parentIdToLink) {
                            await tx.parentStudent.upsert({
                                where: {
                                    parentId_studentId: { parentId: parentIdToLink, studentId },
                                },
                                create: {
                                    studentId,
                                    parentId: parentIdToLink,
                                    relationType: (parentData.newParent?.relationType ||
                                        'OTHER'),
                                },
                                update: {},
                            });
                        }
                    }
                    return await tx.student.update({
                        where: { id: studentId },
                        data: {
                            matricule,
                            classId,
                            enrollmentYear: enrollmentYear ?? '',
                            birthDate,
                            birthPlace,
                            nationality,
                            bloodGroup,
                            allergies,
                            birthCertificateNumber: birthCertificateNumber,
                            medicalCondition,
                            previousSchool,
                            previousClass,
                            enrollmentDate: enrollmentDate
                                ? new Date(enrollmentDate)
                                : undefined,
                            status: status ?? undefined,
                        },
                    });
                });
            }
            catch (error) {
                console.error('Erreur update élève:', error);
                throw (0, api_errors_1.createServiceError)('Erreur lors de la mise à jour', 500, error);
            }
        },
        deleteStudents: async (_, { studentIds, schoolId, soft = true }, context) => {
            try {
                if (!context.user)
                    throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
                const adminCheck = await (0, verify_role_1.isAdmin)({
                    context: { schoolId, userId: context.user.id },
                });
                if (!adminCheck?.success) {
                    throw (0, api_errors_1.createServiceError)(adminCheck.message, 403);
                }
                const exist = await prisma.student.findMany({
                    where: {
                        id: { in: studentIds },
                        schoolId,
                    },
                    select: {
                        id: true,
                        schoolUserId: true,
                    },
                });
                if (!exist || exist.length === 0) {
                    throw (0, api_errors_1.createServiceError)('Aucun élève trouvé', 404);
                }
                if (soft) {
                    await prisma.student.updateMany({
                        where: {
                            id: { in: studentIds },
                            schoolId,
                        },
                        data: {
                            status: 'INACTIVE',
                            deletedAt: new Date(),
                        },
                    });
                    const schoolUserIds = exist.map((s) => s.schoolUserId);
                    await prisma.user.updateMany({
                        where: { memberships: { some: { id: { in: schoolUserIds } } } },
                        data: { isActive: false },
                    });
                    return {
                        ok: true,
                        message: `${studentIds.length} élève(s) archivé(s)`,
                    };
                }
                else {
                    const schoolUserIds = exist.map((s) => s.schoolUserId);
                    await prisma.schoolUser.deleteMany({
                        where: {
                            id: { in: schoolUserIds },
                        },
                    });
                    return {
                        ok: true,
                        message: `${studentIds.length} élève(s) supprimé(s) définitivement`,
                    };
                }
            }
            catch (e) {
                const message = 'Erreur lors de la suppression.';
                throw (0, api_errors_1.createServiceError)(message, 500, e);
            }
        },
    },
};
//# sourceMappingURL=student-mutation.resolver.js.map