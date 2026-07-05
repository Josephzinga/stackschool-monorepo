/*
  Warnings:

  - You are about to drop the column `teacherId` on the `ClassSubjects` table. All the data in the column will be lost.
  - You are about to drop the column `classSubjectId` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,schoolId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,teacherAssignmentId,roomId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,day,endTime,startTime,teacherAssignmentId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `ClassSubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherAssignmentId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassSubjects" DROP CONSTRAINT "ClassSubjects_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classSubjectId_fkey";

-- DropIndex
DROP INDEX "ClassSubjects_teacherId_idx";

-- DropIndex
DROP INDEX "Lesson_day_endTime_startTime_classSubjectId_schoolId_key";

-- DropIndex
DROP INDEX "Lesson_roomId_schoolId_classSubjectId_key";

-- AlterTable
ALTER TABLE "ClassSubjects" DROP COLUMN "teacherId",
ADD COLUMN     "schoolId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "classSubjectId",
ADD COLUMN     "teacherAssignmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classSubjectId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherAssignment_schoolId_idx" ON "TeacherAssignment"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_schoolId_classSubjectId_teacherId_key" ON "TeacherAssignment"("schoolId", "classSubjectId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_schoolId_key" ON "TeacherAssignment"("schoolId");

-- CreateIndex
CREATE INDEX "Group_schoolId_idx" ON "Group"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_schoolId_key" ON "Group"("name", "schoolId");

-- CreateIndex
CREATE INDEX "Lesson_schoolId_idx" ON "Lesson"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_schoolId_teacherAssignmentId_roomId_key" ON "Lesson"("schoolId", "teacherAssignmentId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_schoolId_day_endTime_startTime_teacherAssignmentId_key" ON "Lesson"("schoolId", "day", "endTime", "startTime", "teacherAssignmentId");

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherAssignmentId_fkey" FOREIGN KEY ("teacherAssignmentId") REFERENCES "TeacherAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
