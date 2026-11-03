import { Inject, Injectable } from '@nestjs/common';
import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceType,
  MarkAttendanceInput,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Attendance } from 'src/prisma/db/generated/client';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AcademicRpcException,
  ClassSubjectContract,
  CORE_PATTERNS,
  CORE_SERVICE,
  defineAbilityFor,
  SchoolUserContract,
  sendRmqRequest,
  TeacherContract,
  toSchoolUserAbility,
  StudentContract,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
    @Inject(CORE_SERVICE) private readonly coreClient: ClientProxy,
  ) {}
  async mark(
    dto: MarkAttendanceInput[],
    schoolUser: SchoolUserContract,
    schoolId: string,
  ): Promise<AttendanceRecord> {
    const now = new Date();
    let markedAttendance: Attendance | null | undefined = null;

    const ability = defineAbilityFor(toSchoolUserAbility(schoolUser));

    markedAttendance = await this.prisma.$transaction(
      async (tx) => {
        for (const item of dto) {
          let schoolUserId: string | undefined;
          let classSubjectId: string = '';

          if (schoolUser?.role === 'TEACHER' && schoolUser?.teacher?.id) {
            const classSubject =
              await sendRmqRequest<ClassSubjectContract | null>(
                this.academicClient,
                ACADEMIC_PATTERNS.FIND_CLASS_SUBJECT,
                {
                  teacherId: schoolUser.teacher.id,
                  subjectId: item.subjectId,
                  classId: item.classId,
                },
              );

            if (!classSubject)
              throw new AcademicRpcException(
                'NOT_FOUND',
                'Assignation introuvable.',
              );
            classSubjectId = classSubject?.id ?? '';
          }
          switch (item.userType) {
            case 'STUDENT':
              const student = await sendRmqRequest<StudentContract | null>(
                this.coreClient,
                CORE_PATTERNS.STUDENT.FIND_ONE,
                { id: item.id, schoolId },
              );
              if (!student) throw new Error();
              schoolUserId = student.schoolUserId!;
              break;

            case 'TEACHER':
              const teacher = await sendRmqRequest<TeacherContract>(
                this.coreClient,
                CORE_PATTERNS.TEACHER.FIND_ONE,
                {
                  schoolId,
                  id: item.id,
                },
              );
              schoolUserId = teacher?.schoolUserId!;
              break;
          }

          if (!schoolUserId)
            throw new AcademicRpcException(
              'NOT_FOUND',
              'Aucune valeur trouvée pour cette école',
            );

          return tx.attendance.upsert({
            where: {
              schoolUserId_date_type_classSubjectId: {
                schoolUserId,
                date: item.date,
                type: item.isSubjectMode ? 'SUBJECT' : 'DAILY',
                classSubjectId,
              },
            },
            create: {
              schoolId,
              schoolUserId,
              status: item.status,
              checkInTime: now,
              recordedBy: schoolUser?.id,
              date: item.date,
              classSubjectId,
              type: item.isSubjectMode ? 'SUBJECT' : ('DAILY' as any),
            },
            update: {
              status: item.status,
              checkInTime: now,
            },
          });
        }
      },
      { timeout: 5000 },
    );

    return {
      id: markedAttendance?.id!,
      status: markedAttendance?.status as AttendanceStatus,
      date: markedAttendance?.date,
      recordedById: markedAttendance?.recordedBy!,
      checkInTime: markedAttendance?.checkInTime,
      type: markedAttendance?.type as AttendanceType,
    };
  }
}
