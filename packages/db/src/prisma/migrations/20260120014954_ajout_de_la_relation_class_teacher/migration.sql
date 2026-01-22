/*
  Warnings:

  - You are about to drop the column `address` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `addrress` on the `Teachers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassSubjects" ADD COLUMN     "teacherId" TEXT;

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "adress" TEXT;

-- AlterTable
ALTER TABLE "Teachers" DROP COLUMN "addrress";

-- AddForeignKey
ALTER TABLE "ClassSubjects" ADD CONSTRAINT "ClassSubjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
