/*
  Warnings:

  - Added the required column `birthPlace` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SchoolRole" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "Student"
ADD COLUMN     "birthPlace" TEXT ,
ADD COLUMN     "fatherName" TEXT ,
ADD COLUMN     "motherName" TEXT ,
ADD COLUMN     "nationality" TEXT ;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
