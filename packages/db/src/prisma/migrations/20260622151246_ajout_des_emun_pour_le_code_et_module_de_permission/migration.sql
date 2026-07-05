/*
  Warnings:

  - Changed the type of `code` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `module` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PermissionModule" AS ENUM ('ATTENDANCE', 'ACADEMICS', 'USERS', 'FINANCE', 'SETTINGS');

-- CreateEnum
CREATE TYPE "PermissionCode" AS ENUM ('MARK_STUDENT_ATTENDANCE', 'MARK_TEACHER_ATTENDANCE', 'MARK_STAFF_ATTENDANCE', 'VIEW_ATTENDANCE_REPORTS', 'MANAGE_CLASSES', 'MANAGE_SUBJECTS', 'INPUT_GRADES', 'PUBLISH_BULLETINS', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_USER_PERMISSIONS', 'MANAGE_PAYMENTS', 'VIEW_FINANCIAL_REPORTS');

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "code",
ADD COLUMN     "code" "PermissionCode" NOT NULL,
DROP COLUMN "module",
ADD COLUMN     "module" "PermissionModule" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");
