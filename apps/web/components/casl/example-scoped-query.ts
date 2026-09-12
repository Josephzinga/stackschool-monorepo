// apps/service-academic/src/casl/example-scoped-query.ts
//
// @casl/prisma turns your ability's conditions into a Prisma `where` clause,
// so "a teacher only sees grades for their own classes" is enforced by the
// query itself, not by filtering results in application code after the fact.

import { accessibleBy } from "@casl/prisma";
import { defineAbilityFor, SchoolUserForAbility } from "@stackschool/shared/casl";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listGradesVisibleTo(schoolUser: SchoolUserForAbility, classId?: string) {
  const ability = defineAbilityFor(schoolUser);

  return prisma.grade.findMany({
    where: {
      AND: [
        accessibleBy(ability, "read").Grade, // CASL-derived scope
        classId ? { classId } : {}, // your normal request filters
      ],
    },
  });
}
