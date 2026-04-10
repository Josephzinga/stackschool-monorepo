import { Prisma } from '@stackschool/db';
import { createServiceError } from '../utils/api-errors';

type PrismaTx = Prisma.TransactionClient;

export const createClassSubjectsForTeacher = async ({
  classSubjects,
  tx,
  teacherId,
}: {
  classSubjects: { classId: string; subjectIds: string[] }[];
  tx: PrismaTx;
  teacherId?: string;
}) => {
  if (!teacherId) return;
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
        throw createServiceError('Assignation introuvable');
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
