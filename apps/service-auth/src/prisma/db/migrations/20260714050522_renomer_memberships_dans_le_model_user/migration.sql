/*
  Warnings:

  - You are about to drop the column `memberships` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "memberships",
ADD COLUMN     "membershipIds" TEXT[];
