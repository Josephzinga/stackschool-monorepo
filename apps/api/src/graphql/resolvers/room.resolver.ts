import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';
import { isAdmin } from '../../lib/verify-role';
import { prisma, Prisma } from '@stackschool/db';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { createRoomSchema } from '@stackschool/shared';

export const RoomResolver: Resolvers = {
  Query: {
    getSchoolRooms: async (
      _,
      { filter: { page = 0, limit = 10, teacherId, classId, searchTerm } },
      { user, schoolId },
    ) => {
      if (!user) throw createServiceError('Non authentifier');
      if (!schoolId) throw createServiceError('Identifiant manquant');

      const checked = await isAdmin({
        context: { userId: user.id, schoolId },
      });
      const skip = page * limit;
      if (!checked.success) {
        throw createServiceError(
          checked?.message || 'Autorisation non accorder',
        );
      }

      let whereClause: Prisma.RoomWhereInput = {
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
        await prisma.room.count(),
        await prisma.room.findMany({
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
        if (!user) throw createServiceError('Non authentifié');

        const { errors, success, data } = safeValidateSchema(
          createRoomSchema,
          input,
        );
        if (!success) {
          throw createServiceError(
            errors?.[0]?.message || 'Erreur de validation',
          );
        }

        const checked = await isAdmin({
          context: { userId: user.id, schoolId },
        });
        if (!checked.success) {
          throw createServiceError(
            checked?.message || 'Autorisation non accordée',
          );
        }

        const { name, code, capacity, type, defaultClassId } = data!;

        const exist = await prisma.room.findFirst({
          where: {
            schoolId,
            OR: [
              { name: { equals: name.trim(), mode: 'insensitive' } },
              { code: { equals: code?.trim(), mode: 'insensitive' } },
            ],
          },
        });

        if (exist)
          throw createServiceError(
            'Une salle avec ce nom ou ce code existe déjà dans cette école',
          );

        if (defaultClassId) {
          const classAlreadyHasRoom = await prisma.class.findUnique({
            where: { id: defaultClassId },
            select: { name: true, defaultRoomId: true },
          });

          if (classAlreadyHasRoom?.defaultRoomId) {
            throw createServiceError(
              `La classe ${classAlreadyHasRoom.name} possède déjà une salle attitrée.`,
            );
          }
        }

        return await prisma.room.create({
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
      } catch (err: any) {
        throw createServiceError(
          err?.message || 'Erreur lors de la création de la classe',
        );
      }
    },
    updateRoom: async (_, { input }, { user, schoolId }) => {
      const { success, errors, data } = safeValidateSchema(
        createRoomSchema,
        input,
      );

      if (!success) {
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
        );
      }

      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked.success) {
        throw createServiceError(
          checked.message || 'Autorisation non accordée',
          403,
        );
      }

      const { id, name, code, capacity, type, defaultClassId } = data!;
      if (!id)
        throw createServiceError("L'identifiant de la salle est manquant", 400);

      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) throw createServiceError('Salle introuvable', 404);

      const duplicate = await prisma.room.findFirst({
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
        throw createServiceError(
          'Une autre salle utilise déjà ce nom ou ce code',
          400,
        );
      }
      return await prisma.room.update({
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
      return await prisma.class.findMany({
        where: {
          defaultRoom: {
            id: parent.id,
          },
        },
      });
    },
    defaultForClass: async (parent) => {
      return await prisma.class.findFirst({
        where: {
          defaultRoom: {
            id: parent.id,
          },
        },
      });
    },
  },
};
