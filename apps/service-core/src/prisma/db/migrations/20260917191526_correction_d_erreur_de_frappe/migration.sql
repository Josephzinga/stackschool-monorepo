/*
  Warnings:

  - The values [ENROLLEMENT] on the enum `PermissionModule` will be removed. If these variants are still used in the database, this will fail.
  - The values [ENROLLEMENT] on the enum `PermissionSubject` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionModule_new" AS ENUM ('ATTENDANCE', 'ACADEMICS', 'USERS', 'FINANCE', 'ENROLLMENT', 'SETTINGS');
ALTER TABLE "Permission" ALTER COLUMN "module" TYPE "PermissionModule_new" USING ("module"::text::"PermissionModule_new");
ALTER TYPE "PermissionModule" RENAME TO "PermissionModule_old";
ALTER TYPE "PermissionModule_new" RENAME TO "PermissionModule";
DROP TYPE "public"."PermissionModule_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PermissionSubject_new" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'STAFF', 'CLASS', 'SUBJECT', 'LESSON', 'GRADE', 'BULLETIN', 'TIMETABLE', 'EXAM', 'ENROLLMENT', 'ATTENDANCE_RECORD', 'PAYMENT', 'PAYROLL', 'FINANCIAL_REPORT', 'SCHOOL_SETTINGS', 'SCHOOL_USER_PERMISSION', 'ALL');
ALTER TABLE "Permission" ALTER COLUMN "subject" TYPE "PermissionSubject_new" USING ("subject"::text::"PermissionSubject_new");
ALTER TYPE "PermissionSubject" RENAME TO "PermissionSubject_old";
ALTER TYPE "PermissionSubject_new" RENAME TO "PermissionSubject";
DROP TYPE "public"."PermissionSubject_old";
COMMIT;
