import {
  accessibleBy,
  createPrismaAbility,
  PrismaQuery,
  Subjects,
} from '@casl/prisma';
import {
  CaslPermissionAction,
  SchoolUserForAbility,
  toCaslAction,
  toCaslSubject,
} from '@stackschool/messaging';
import { PrismaService } from './prisma.service';
import { Ability, AbilityBuilder } from '@casl/ability';
import { Parent, Staff, Student, Teacher } from './db/generated/client';

const prisma = new PrismaService();
type AppSubjects =
  | Subjects<{
      Teacher: Teacher;
      Parent: Parent;
      Student: Student;
      Staff: Staff;
    }>
  | 'all';
type AppAbility = Ability<[CaslPermissionAction, AppSubjects], PrismaQuery>;

const RELEVANT_SUBJECTS: AppSubjects[] = [
  'Teacher',
  'Parent',
  'Student',
  'Staff',
];

export async function listTeacherVisibleTo(schoolUser: SchoolUserForAbility) {
  const ability = definePrismaAbilityFor(schoolUser);
  return prisma.teacher.findMany({
    where: {
      AND: [accessibleBy(ability, toCaslAction('READ')).ofType('Teacher')],
    },
  });
}

export function definePrismaAbilityFor(schoolUser: SchoolUserForAbility) {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  for (const grant of schoolUser.grantedPermissions) {
    const subject = toCaslSubject<AppSubjects>(grant.subject);
    if (!RELEVANT_SUBJECTS.includes(subject)) continue;
    if (schoolUser.role === 'ADMIN' || schoolUser.isOwner) {
      can(toCaslAction(grant.action), 'all');
    } else {
      can(toCaslAction(grant.action), subject, grant.conditions ?? undefined);
    }
  }

  return build();
}
