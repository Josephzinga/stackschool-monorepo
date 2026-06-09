"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentMutationResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
const db_1 = require("@stackschool/db");
const generate_username_1 = require("../../../utils/generate-username");
exports.parentMutationResolver = {
    Mutation: {
        createParent: async (_, { input }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement est manquant", 400);
            const { firstname, profession, lastname, phoneNumber, address, students, email, isDelegate, } = input;
            try {
                const checked = await (0, verify_role_1.isAdmin)({
                    context: { userId: user?.id, schoolId },
                });
                if (!checked.success) {
                    throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accordée');
                }
                return await db_1.prisma.$transaction(async (tx) => {
                    const existingParent = await tx.parent.findFirst({
                        where: {
                            schoolUser: {
                                schoolId,
                                user: {
                                    OR: [{ email, phoneNumber }],
                                },
                            },
                        },
                    });
                    if (existingParent)
                        throw (0, api_errors_1.createServiceError)("C'est parent existe déjà dans la l'établissement.");
                    const existingUser = await tx.user.findFirst({
                        where: {
                            OR: [{ email, phoneNumber }],
                        },
                    });
                    if (existingUser)
                        throw (0, api_errors_1.createServiceError)("L'utilisateur avec c'est numéro ou email existe déjà.");
                    const newUser = await tx.user.create({
                        data: {
                            username: (0, generate_username_1.generateUsername)(firstname, lastname),
                            phoneNumber,
                            email,
                            profileCompleted: true,
                            hasMembership: true,
                            isActive: false,
                            profile: {
                                create: {
                                    firstname,
                                    lastname,
                                    address,
                                },
                            },
                        },
                    });
                    const newParent = await tx.parent.create({
                        data: {
                            profession,
                            isDelegate: isDelegate ?? undefined,
                            schoolUser: {
                                create: {
                                    schoolId,
                                    role: 'PARENT',
                                    userId: newUser.id,
                                },
                            },
                        },
                    });
                    if (students && students?.length > 0) {
                        for (const student of students) {
                            await tx.parentStudent.create({
                                data: {
                                    parentId: newParent.id,
                                    studentId: student.studentId,
                                    relationType: student.relationType,
                                },
                            });
                        }
                    }
                    return newParent;
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message || 'Erreur lors de la création de parent');
            }
        },
    },
};
//# sourceMappingURL=parent-mutation.resolver.js.map