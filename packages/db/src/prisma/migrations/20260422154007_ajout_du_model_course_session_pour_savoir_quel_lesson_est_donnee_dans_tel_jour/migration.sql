-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('FINISHED', 'STARTED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
