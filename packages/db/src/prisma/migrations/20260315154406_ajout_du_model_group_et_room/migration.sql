/*
  Warnings:

  - You are about to drop the column `classId` on the `ClassSubjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultRoomId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,subjectId]` on the table `ClassSubjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId,schoolId,classSubjectId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,endTime,startTime,classSubjectId,schoolId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `ClassSubjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassSubjects" DROP CONSTRAINT "ClassSubjects_classId_fkey";

-- DropIndex
DROP INDEX "ClassSubjects_classId_idx";

-- DropIndex
DROP INDEX "ClassSubjects_classId_subjectId_key";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "defaultRoomId" TEXT;

-- AlterTable
ALTER TABLE "ClassSubjects" DROP COLUMN "classId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "roomId" TEXT;

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT DEFAULT 'CLASSIC',
    "capacity" INTEGER,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Room_schoolId_idx" ON "Room"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_schoolId_key" ON "Room"("name", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_code_schoolId_key" ON "Room"("code", "schoolId");

-- CreateIndex
CREATE INDEX "_ClassGroups_B_index" ON "_ClassGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Class_defaultRoomId_key" ON "Class"("defaultRoomId");

-- CreateIndex
CREATE INDEX "ClassSubjects_groupId_idx" ON "ClassSubjects"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSubjects_groupId_subjectId_key" ON "ClassSubjects"("groupId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_roomId_schoolId_classSubjectId_key" ON "Lesson"("roomId", "schoolId", "classSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_day_endTime_startTime_classSubjectId_schoolId_key" ON "Lesson"("day", "endTime", "startTime", "classSubjectId", "schoolId");

-- AddForeignKey
ALTER TABLE "ClassSubjects" ADD CONSTRAINT "ClassSubjects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_defaultRoomId_fkey" FOREIGN KEY ("defaultRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassGroups" ADD CONSTRAINT "_ClassGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassGroups" ADD CONSTRAINT "_ClassGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
