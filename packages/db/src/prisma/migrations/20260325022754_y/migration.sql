/*
  Warnings:

  - You are about to drop the `_ClassGroups` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ClassGroups" DROP CONSTRAINT "_ClassGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassGroups" DROP CONSTRAINT "_ClassGroups_B_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ClassGroups";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
