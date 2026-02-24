/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_profileId_key" ON "Student"("profileId");
