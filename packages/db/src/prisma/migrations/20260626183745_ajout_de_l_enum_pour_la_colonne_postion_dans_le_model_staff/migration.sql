/*
  Warnings:

  - The `position` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StaffPosition" AS ENUM ('SECRETARY', 'GUARDIAN', 'SUPERVISOR', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'CLEANER', 'MAINTENANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "positionOther" TEXT,
DROP COLUMN "position",
ADD COLUMN     "position" "StaffPosition" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE INDEX "Staff_schoolUserId_idx" ON "Staff"("schoolUserId");

-- CreateIndex
CREATE INDEX "Staff_position_idx" ON "Staff"("position");
