/*
  Warnings:

  - You are about to drop the column `parentProfileId` on the `ParentStudent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId,studentId]` on the table `ParentStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_parentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_studentId_fkey";

-- DropIndex
DROP INDEX "ParentStudent_parentProfileId_studentId_key";

-- AlterTable
ALTER TABLE "ParentStudent" DROP COLUMN "parentProfileId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "profession" TEXT,
    "address" TEXT,
    "isDelegate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_schoolUserId_key" ON "Parent"("schoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudent_parentId_studentId_key" ON "ParentStudent"("parentId", "studentId");

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
