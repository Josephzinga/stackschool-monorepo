/*
  Warnings:

  - A unique constraint covering the columns `[schoolUserId,date,type,classSubjectId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AtteandanceType" AS ENUM ('DAILY', 'SUBJECT');

-- DropIndex
DROP INDEX "Attendance_schoolId_date_idx";

-- DropIndex
DROP INDEX "Attendance_schoolUserId_date_key";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "classSubjectId" TEXT,
ADD COLUMN     "type" "AtteandanceType" NOT NULL DEFAULT 'DAILY';

-- CreateIndex
CREATE INDEX "Attendance_schoolId_idx" ON "Attendance"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_schoolUserId_date_type_classSubjectId_key" ON "Attendance"("schoolUserId", "date", "type", "classSubjectId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
