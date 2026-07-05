/*
  Warnings:

  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schoolUserId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_teacherId_fkey";

-- DropIndex
DROP INDEX "Attendance_schoolId_idx";

-- DropIndex
DROP INDEX "Attendance_studentId_date_idx";

-- DropIndex
DROP INDEX "Attendance_studentId_date_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "studentId",
DROP COLUMN "teacherId",
ADD COLUMN     "checkInTime" TIMESTAMP(3),
ADD COLUMN     "recordedBy" TEXT,
ADD COLUMN     "schoolUserId" TEXT,
ADD COLUMN     "sessionId" TEXT;

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "secretCode" TEXT NOT NULL,
    "targetRole" "SchoolRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceSession_expiresAt_idx" ON "AttendanceSession"("expiresAt");

-- CreateIndex
CREATE INDEX "Attendance_schoolId_date_idx" ON "Attendance"("schoolId", "date");

-- CreateIndex
CREATE INDEX "Attendance_schoolUserId_date_idx" ON "Attendance"("schoolUserId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_schoolUserId_date_key" ON "Attendance"("schoolUserId", "date");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "SchoolUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
