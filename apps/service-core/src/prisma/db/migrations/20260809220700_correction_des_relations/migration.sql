/*
  Warnings:

  - You are about to drop the column `staffId` on the `TempSchoolUser` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `TempSchoolUser` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `TempSchoolUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tempSchoolUserId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tempSchoolUserId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tempSchoolUserId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tempSchoolUserId]` on the table `Teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tempSchoolUserId` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempSchoolUserId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TempSchoolUser" DROP CONSTRAINT "TempSchoolUser_staffId_fkey";

-- DropForeignKey
ALTER TABLE "TempSchoolUser" DROP CONSTRAINT "TempSchoolUser_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TempSchoolUser" DROP CONSTRAINT "TempSchoolUser_teacherId_fkey";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "tempSchoolUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "tempSchoolUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "tempSchoolUserId" TEXT;

-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "tempSchoolUserId" TEXT;

-- AlterTable
ALTER TABLE "TempSchoolUser" DROP COLUMN "staffId",
DROP COLUMN "studentId",
DROP COLUMN "teacherId";

-- CreateIndex
CREATE UNIQUE INDEX "Parent_tempSchoolUserId_key" ON "Parent"("tempSchoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_tempSchoolUserId_key" ON "Staff"("tempSchoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_tempSchoolUserId_key" ON "Student"("tempSchoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_tempSchoolUserId_key" ON "Teachers"("tempSchoolUserId");

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_tempSchoolUserId_fkey" FOREIGN KEY ("tempSchoolUserId") REFERENCES "TempSchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tempSchoolUserId_fkey" FOREIGN KEY ("tempSchoolUserId") REFERENCES "TempSchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_tempSchoolUserId_fkey" FOREIGN KEY ("tempSchoolUserId") REFERENCES "TempSchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_tempSchoolUserId_fkey" FOREIGN KEY ("tempSchoolUserId") REFERENCES "TempSchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
