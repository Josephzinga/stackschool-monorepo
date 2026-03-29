/*
  Warnings:

  - You are about to drop the column `fatherName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "fatherName",
DROP COLUMN "motherName";
