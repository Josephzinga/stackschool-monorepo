/*
  Warnings:

  - You are about to drop the column `profileId` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_profileId_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "profileId";
