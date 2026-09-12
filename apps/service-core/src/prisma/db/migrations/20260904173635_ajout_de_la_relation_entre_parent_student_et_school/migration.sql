/*
  Warnings:

  - Added the required column `schoolId` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParentStudent" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
