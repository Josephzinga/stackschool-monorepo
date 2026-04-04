/*
  Warnings:

  - You are about to drop the column `departement` on the `Teachers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teachers" DROP COLUMN "departement",
ADD COLUMN     "department" TEXT;
