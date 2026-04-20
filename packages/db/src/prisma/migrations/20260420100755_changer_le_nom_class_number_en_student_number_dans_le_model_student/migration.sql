/*
  Warnings:

  - You are about to drop the column `classNumber` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "classNumber",
ADD COLUMN     "studentNumber" SERIAL NOT NULL;
