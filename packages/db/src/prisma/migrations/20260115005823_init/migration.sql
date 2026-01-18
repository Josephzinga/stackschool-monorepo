/*
  Warnings:

  - A unique constraint covering the columns `[schoolUserId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolUserId_key" ON "Student"("schoolUserId");

-- CreateIndex
CREATE INDEX "Student_schoolUserId_idx" ON "Student"("schoolUserId");
