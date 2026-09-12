// prisma/seed.ts
//
// Seeds the Permission catalog — the fixed list of (action, subject) pairs
// an admin can grant to a SchoolUser via SchoolUserPermission. This table
// is NOT admin-editable at runtime; it only changes through this seed file
// plus a migration when you add new PermissionAction/PermissionSubject enum
// values.
//
// Idempotent: run it as many times as you want (dev resets, CI, prod
// deploys) — upsert on the @@unique([action, subject]) constraint means
// re-running only updates `name`/`description`/`module` if you've edited
// them, and never creates duplicates.

import {
  PermissionAction,
  PermissionModule,
  PermissionSubject,
} from './generated/client';
import { PrismaService } from '../prisma.service';

const prisma = new PrismaService();

interface PermissionSeed {
  action: PermissionAction;
  subject: PermissionSubject;
  module: PermissionModule;
  name: string;
  description?: string;
}

const PERMISSIONS: PermissionSeed[] = [
  // --- MODULE: ATTENDANCE ---
  {
    action: PermissionAction.MARK,
    subject: PermissionSubject.ATTENDANCE_RECORD,
    module: PermissionModule.ATTENDANCE,
    name: 'Marquer les présences',
  },
  {
    action: PermissionAction.READ,
    subject: PermissionSubject.ATTENDANCE_RECORD,
    module: PermissionModule.ATTENDANCE,
    name: 'Consulter les rapports de présence',
  },

  // --- MODULE: ACADEMICS ---
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.CLASS,
    module: PermissionModule.ACADEMICS,
    name: 'Gérer les classes',
  },
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.SUBJECT,
    module: PermissionModule.ACADEMICS,
    name: 'Gérer les matières',
  },
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.TIMETABLE,
    module: PermissionModule.ACADEMICS,
    name: "Gérer l'emploi du temps",
  },
  {
    action: PermissionAction.UPDATE,
    subject: PermissionSubject.GRADE,
    module: PermissionModule.ACADEMICS,
    name: 'Saisir les notes',
  },
  {
    action: PermissionAction.PUBLISH,
    subject: PermissionSubject.BULLETIN,
    module: PermissionModule.ACADEMICS,
    name: 'Publier les bulletins',
  },
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.EXAM,
    module: PermissionModule.ACADEMICS,
    name: 'Gérer les examens',
  },

  // --- MODULE: USERS ---
  {
    action: PermissionAction.CREATE,
    subject: PermissionSubject.STUDENT,
    module: PermissionModule.USERS,
    name: 'Créer un élève',
  },
  {
    action: PermissionAction.UPDATE,
    subject: PermissionSubject.STUDENT,
    module: PermissionModule.USERS,
    name: 'Modifier un élève',
  },
  {
    action: PermissionAction.DELETE,
    subject: PermissionSubject.STUDENT,
    module: PermissionModule.USERS,
    name: 'Supprimer un élève',
  },
  {
    action: PermissionAction.CREATE,
    subject: PermissionSubject.TEACHER,
    module: PermissionModule.USERS,
    name: 'Créer un enseignant',
  },
  {
    action: PermissionAction.UPDATE,
    subject: PermissionSubject.TEACHER,
    module: PermissionModule.USERS,
    name: 'Modifier un enseignant',
  },
  {
    action: PermissionAction.DELETE,
    subject: PermissionSubject.TEACHER,
    module: PermissionModule.USERS,
    name: 'Supprimer un enseignant',
  },
  {
    action: PermissionAction.CREATE,
    subject: PermissionSubject.PARENT,
    module: PermissionModule.USERS,
    name: 'Créer un parent',
  },
  {
    action: PermissionAction.UPDATE,
    subject: PermissionSubject.PARENT,
    module: PermissionModule.USERS,
    name: 'Modifier un parent',
  },
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.SCHOOL_USER_PERMISSION,
    module: PermissionModule.USERS,
    name: 'Gérer les permissions des utilisateurs',
    description:
      'Permet à un admin secondaire de modifier les accès des autres utilisateurs.',
  },

  // --- MODULE: FINANCE ---
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.PAYMENT,
    module: PermissionModule.FINANCE,
    name: 'Gérer les paiements',
  },
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.PAYROLL,
    module: PermissionModule.FINANCE,
    name: 'Gérer les salaires',
  },
  {
    action: PermissionAction.READ,
    subject: PermissionSubject.FINANCIAL_REPORT,
    module: PermissionModule.FINANCE,
    name: 'Consulter les rapports financiers',
  },
  {
    action: PermissionAction.EXPORT,
    subject: PermissionSubject.FINANCIAL_REPORT,
    module: PermissionModule.FINANCE,
    name: 'Exporter les rapports financiers',
  },

  // --- MODULE: SETTINGS ---
  {
    action: PermissionAction.MANAGE,
    subject: PermissionSubject.SCHOOL_SETTINGS,
    module: PermissionModule.SETTINGS,
    name: "Gérer les paramètres de l'école",
  },
];

async function main() {
  console.log(`Seeding ${PERMISSIONS.length} permissions...`);

  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: {
        action_subject: { action: perm.action, subject: perm.subject },
      },
      update: {
        name: perm.name,
        module: perm.module,
        description: perm.description ?? null,
      },
      create: {
        action: perm.action,
        subject: perm.subject,
        module: perm.module,
        name: perm.name,
        description: perm.description ?? null,
      },
    });
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
