import { Injectable } from '@nestjs/common';
import { CreateRoomInput, GetSchoolRoomInput, RoomList } from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, RoomType } from '../../prisma/db/generated/client';
import { AcademicRpcException } from '@stackschool/messaging';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchool(
    dto: GetSchoolRoomInput,
    schoolId: string,
  ): Promise<RoomList> {
    const skip = dto.page * dto.limit;
    let where: Prisma.RoomWhereInput = {
      schoolId,
      deletedAt: null,
    };

    if (dto.searchTerm)
      where = {
        ...where,
        OR: [
          { name: { contains: dto.searchTerm, mode: 'insensitive' } },
          { code: { contains: dto.searchTerm, mode: 'insensitive' } },
        ],
      };

    if (dto.classId) where['classId'] = dto.classId;
    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        skip,
        take: dto.limit,
      }),
      this.prisma.room.count(),
    ]);

    return {
      data: rooms,
      meta: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async create(dto: CreateRoomInput, schoolId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        schoolId,
        OR: [{ code: dto.code }, { name: dto.name }],
      },
    });
    if (room) {
      throw new AcademicRpcException(
        'CONFLICT',
        'La salle avec cet nom et code existe déjà.',
      );
    }
    try {
      return this.prisma.room.create({
        data: {
          schoolId,
          code: dto.code,
          name: dto.name,
          type: dto.type as RoomType,
          capacity: dto.capacity,
          ...(dto.defaultClassId && {
            defaultForClass: { connect: { id: dto.defaultClassId } },
          }),
        },
      });
    } catch (e) {
      throw new AcademicRpcException(
        'INTERNAL_ERROR',
        'Erreur lors de la création de la salle.',
      );
    }
  }

  async deleteMany(
    dto: { soft: boolean; ids: string | string[] },
    schoolId: string,
  ) {
    const rooms = await this.prisma.room.findMany({
      where: {
        schoolId,
        id: { in: [...dto.ids] },
      },
    });

    for (const room of rooms) {
      if (!room)
        throw new AcademicRpcException('NOT_FOUND', 'Sale non trouvé.');
    }

    try {
      if (dto.soft) {
        await this.prisma.room.updateMany({
          where: {
            id: {
              in: [...dto.ids],
            },
          },
          data: {
            deletedAt: new Date(),
          },
        });
      } else {
        await this.prisma.room.deleteMany({
          where: {
            id: {
              in: [...dto.ids],
            },
          },
        });
      }
      return {
        ok: true,
        message: 'La salle a été supprimé avec succès.',
      };
    } catch (e) {
      throw new AcademicRpcException(
        'INTERNAL_ERROR',
        'Erreur lors de la suppression de la salle.',
      );
    }
  }
}
