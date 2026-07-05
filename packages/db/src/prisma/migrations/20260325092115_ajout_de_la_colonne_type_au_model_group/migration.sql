-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('SOLO', 'MULTIPLE');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "type" "GroupType" NOT NULL DEFAULT 'SOLO';
