"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomResolver = void 0;
const api_errors_1 = require("../../utils/api-errors");
const verify_role_1 = require("../../lib/verify-role");
const db_1 = require("@stackschool/db");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const shared_1 = require("@stackschool/shared");
exports.RoomResolver = {
    Query: {
        getSchoolRooms: async (_, { filter: { page = 0, limit = 10, teacherId, classId, searchTerm } }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifier');
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant');
            const checked = await (0, verify_role_1.isAdmin)({
                context: { userId: user.id, schoolId },
            });
            const skip = page * limit;
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked?.message || 'Autorisation non accorder');
            }
            let whereClause = {
                schoolId,
            };
            const search = searchTerm?.trim();
            if (searchTerm) {
                whereClause.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    {
                        defaultForClass: {
                            name: { contains: search, mode: 'insensitive' },
                        },
                    },
                    { code: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [total, rooms] = await Promise.all([
                await db_1.prisma.room.count(),
                await db_1.prisma.room.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                }),
            ]);
            return {
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
                data: rooms,
            };
        },
    },
    Mutation: {
        createRoom: async (_, { input }, { user, schoolId }) => {
            try {
                if (!user)
                    throw (0, api_errors_1.createServiceError)('Non authentifié');
                const { errors, success, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createRoomSchema, input);
                if (!success) {
                    throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation');
                }
                const checked = await (0, verify_role_1.isAdmin)({
                    context: { userId: user.id, schoolId },
                });
                if (!checked.success) {
                    throw (0, api_errors_1.createServiceError)(checked?.message || 'Autorisation non accordée');
                }
                const { name, code, capacity, type, defaultClassId } = data;
                const exist = await db_1.prisma.room.findFirst({
                    where: {
                        schoolId,
                        OR: [
                            { name: { equals: name.trim(), mode: 'insensitive' } },
                            { code: { equals: code?.trim(), mode: 'insensitive' } },
                        ],
                    },
                });
                if (exist)
                    throw (0, api_errors_1.createServiceError)('Une salle avec ce nom ou ce code existe déjà dans cette école');
                if (defaultClassId) {
                    const classAlreadyHasRoom = await db_1.prisma.class.findUnique({
                        where: { id: defaultClassId },
                        select: { name: true, defaultRoomId: true },
                    });
                    if (classAlreadyHasRoom?.defaultRoomId) {
                        throw (0, api_errors_1.createServiceError)(`La classe ${classAlreadyHasRoom.name} possède déjà une salle attitrée.`);
                    }
                }
                return await db_1.prisma.room.create({
                    data: {
                        schoolId,
                        name: name.trim(),
                        code: code?.trim(),
                        type: type || 'CLASSIC',
                        capacity: capacity || 0,
                        ...(defaultClassId && {
                            defaultForClass: {
                                connect: { id: defaultClassId },
                            },
                        }),
                    },
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message || 'Erreur lors de la création de la classe');
            }
        },
        updateRoom: async (_, { input }, { user, schoolId }) => {
            const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createRoomSchema, input);
            if (!success) {
                throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation', 400);
            }
            const checked = await (0, verify_role_1.isAdmin)({ context: { userId: user.id, schoolId } });
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked.message || 'Autorisation non accordée', 403);
            }
            const { id, name, code, capacity, type, defaultClassId } = data;
            if (!id)
                throw (0, api_errors_1.createServiceError)("L'identifiant de la salle est manquant", 400);
            const room = await db_1.prisma.room.findUnique({ where: { id } });
            if (!room)
                throw (0, api_errors_1.createServiceError)('Salle introuvable', 404);
            const duplicate = await db_1.prisma.room.findFirst({
                where: {
                    schoolId,
                    id: { not: id },
                    OR: [
                        { name: { equals: name.trim(), mode: 'insensitive' } },
                        { code: { equals: code?.trim(), mode: 'insensitive' } },
                    ],
                },
            });
            if (duplicate) {
                throw (0, api_errors_1.createServiceError)('Une autre salle utilise déjà ce nom ou ce code', 400);
            }
            return await db_1.prisma.room.update({
                where: { id },
                data: {
                    name: name.trim(),
                    code: code?.trim(),
                    capacity: capacity || 0,
                    type: type || 'CLASSIC',
                    defaultForClass: defaultClassId
                        ? { connect: { id: defaultClassId } }
                        : { disconnect: true },
                },
            });
        },
    },
    Room: {
        class: async (parent) => {
            return await db_1.prisma.class.findMany({
                where: {
                    defaultRoom: {
                        id: parent.id,
                    },
                },
            });
        },
        defaultForClass: async (parent) => {
            return await db_1.prisma.class.findFirst({
                where: {
                    defaultRoom: {
                        id: parent.id,
                    },
                },
            });
        },
    },
};
//# sourceMappingURL=room.resolver.js.map