/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "teacherId";
