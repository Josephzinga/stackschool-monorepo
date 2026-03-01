-- CreateEnum
CREATE TYPE "DisciplinaryType" AS ENUM ('SUSPENSION', 'EXPULSION', 'WARNING');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPELLED', 'TRANSFERRED', 'DROPPED_OUT', 'GRADUATED', 'INACTIVE', 'DECEASED');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "StudentDisciplinaryAction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "DisciplinaryType" NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentDisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentDisciplinaryAction_studentId_key" ON "StudentDisciplinaryAction"("studentId");

-- AddForeignKey
ALTER TABLE "StudentDisciplinaryAction" ADD CONSTRAINT "StudentDisciplinaryAction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
