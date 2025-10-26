/*
  Warnings:

  - A unique constraint covering the columns `[classId,teacherId]` on the table `ClassTeacher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassTeacher" DROP CONSTRAINT "ClassTeacher_staffMemberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."ClassTeacher_classId_staffMemberId_key";

-- DropIndex
DROP INDEX "public"."ClassTeacher_staffMemberId_idx";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ClassTeacher" ADD COLUMN     "schoolUserId" TEXT;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "schoolUserId" TEXT;

-- CreateIndex
CREATE INDEX "ClassTeacher_teacherId_idx" ON "ClassTeacher"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacher_classId_teacherId_key" ON "ClassTeacher"("classId", "teacherId");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
