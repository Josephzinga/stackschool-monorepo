/*
  Warnings:

  - A unique constraint covering the columns `[title,subjectId,classId,startDate,schoolId]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,schoolId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coefficient` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ponderation` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklyHours` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('SCIENTIFIC', 'LITERARY', 'GENERAL', 'SPORT');

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_teacherId_fkey";

-- DropIndex
DROP INDEX "Subject_name_key";

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "category" "SubjectCategory" NOT NULL,
ADD COLUMN     "coefficient" INTEGER NOT NULL,
ADD COLUMN     "ponderation" INTEGER NOT NULL,
ADD COLUMN     "weeklyHours" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Assessment_schoolId_idx" ON "Assessment"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_title_subjectId_classId_startDate_schoolId_key" ON "Assessment"("title", "subjectId", "classId", "startDate", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_schoolId_key" ON "Subject"("name", "schoolId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
