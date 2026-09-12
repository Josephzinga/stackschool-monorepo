/*
  Warnings:

  - You are about to drop the column `code` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action,subject]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('MANAGE', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'MARK', 'PUBLISH', 'EXPORT');

-- CreateEnum
CREATE TYPE "PermissionSubject" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'STAFF', 'CLASS', 'SUBJECT', 'GRADE', 'BULLETIN', 'TIMETABLE', 'EXAM', 'ATTENDANCE_RECORD', 'PAYMENT', 'PAYROLL', 'FINANCIAL_REPORT', 'SCHOOL_SETTINGS', 'SCHOOL_USER_PERMISSION', 'ALL');

-- DropIndex
DROP INDEX "Permission_code_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "code",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "action" "PermissionAction" NOT NULL,
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "subject" "PermissionSubject" NOT NULL;

-- DropEnum
DROP TYPE "PermissionCode";

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_subject_key" ON "Permission"("action", "subject");
