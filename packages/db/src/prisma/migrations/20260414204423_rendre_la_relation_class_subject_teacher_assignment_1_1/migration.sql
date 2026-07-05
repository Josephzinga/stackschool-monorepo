/*
  Warnings:

  - A unique constraint covering the columns `[classSubjectId]` on the table `TeacherAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,classSubjectId]` on the table `TeacherAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_classSubjectId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_classSubjectId_key" ON "TeacherAssignment"("classSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_schoolId_classSubjectId_key" ON "TeacherAssignment"("schoolId", "classSubjectId");

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
