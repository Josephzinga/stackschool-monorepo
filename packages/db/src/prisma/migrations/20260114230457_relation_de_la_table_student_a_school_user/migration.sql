/*
  Warnings:

  - Added the required column `schoolUserId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "schoolUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "addrress" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
