/*
  Warnings:

  - A unique constraint covering the columns `[classId,staffMemberId]` on the table `ClassTeacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffMemberId` to the `ClassTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ClassTeacher" DROP CONSTRAINT "ClassTeacher_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."ClassTeacher_classId_teacherId_key";

-- DropIndex
DROP INDEX "public"."ClassTeacher_teacherId_idx";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassTeacher" ADD COLUMN     "staffMemberId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Teachers" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "diploma" TEXT,
    "experience" TEXT,
    "hireDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL,
    "salary" DOUBLE PRECISION,
    "departement" TEXT,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3),
    "salary" DOUBLE PRECISION,
    "departement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_schoolUserId_key" ON "Teachers"("schoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_schoolUserId_key" ON "Staff"("schoolUserId");

-- CreateIndex
CREATE INDEX "ClassTeacher_staffMemberId_idx" ON "ClassTeacher"("staffMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacher_classId_staffMemberId_key" ON "ClassTeacher"("classId", "staffMemberId");

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_staffMemberId_fkey" FOREIGN KEY ("staffMemberId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
