/*
  Warnings:

  - The primary key for the `SchoolUserPermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[schoolUserId,permissionId]` on the table `SchoolUserPermission` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `SchoolUserPermission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SchoolUserPermission" DROP CONSTRAINT "SchoolUserPermission_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SchoolUserPermission_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolUserPermission_schoolUserId_permissionId_key" ON "SchoolUserPermission"("schoolUserId", "permissionId");
