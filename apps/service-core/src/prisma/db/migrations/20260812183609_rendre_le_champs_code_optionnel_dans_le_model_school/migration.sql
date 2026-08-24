/*
  Warnings:

  - Made the column `code` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ParentStudent" ADD COLUMN     "needAdminConfirm" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "pendingAssignments" JSONB,
ALTER COLUMN "isActive" SET DEFAULT true;
