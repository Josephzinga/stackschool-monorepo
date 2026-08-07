/*
  Warnings:

  - Made the column `firstname` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasMembership` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileCompleted` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isVerified` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailVerified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hasMembership" SET NOT NULL,
ALTER COLUMN "profileCompleted" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "isVerified" SET NOT NULL,
ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "emailVerified" SET NOT NULL;
