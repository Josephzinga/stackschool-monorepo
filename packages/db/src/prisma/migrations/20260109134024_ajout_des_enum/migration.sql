/*
  Warnings:

  - Added the required column `contactPreference` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationType` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'UNCLE', 'OTHER', 'GRAND_MOTHER', 'GRAND_FATHER', 'AUNT');

-- CreateEnum
CREATE TYPE "ContactPreference" AS ENUM ('WHATSAPP', 'EMAIL', 'PHONE');

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "contactPreference" "ContactPreference" NOT NULL;

-- AlterTable
ALTER TABLE "ParentStudent" DROP COLUMN "relationType",
ADD COLUMN     "relationType" "RelationType" NOT NULL;
