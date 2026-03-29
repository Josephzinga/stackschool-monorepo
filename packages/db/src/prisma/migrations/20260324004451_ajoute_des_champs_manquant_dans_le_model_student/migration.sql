/*
  Warnings:

  - Made the column `classId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('BUS', 'WALK', 'PARENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "birthCertificateNumber" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "enrollmentDate" TIMESTAMP(3),
ADD COLUMN     "medicalCondition" TEXT,
ADD COLUMN     "previousClass" TEXT,
ADD COLUMN     "previousLevel" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "transportMode" "TransportMode" NOT NULL DEFAULT 'WALK',
ALTER COLUMN "classId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
