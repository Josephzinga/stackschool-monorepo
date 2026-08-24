-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "needAdminConfirm" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "needAdminConfirm" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "needAdminConfirm" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "needAdminConfirm" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TempSchoolUser" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SchoolRole" NOT NULL,
    "staffId" TEXT,
    "studentId" TEXT,
    "teacherId" TEXT,

    CONSTRAINT "TempSchoolUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TempSchoolUser_userId_schoolId_idx" ON "TempSchoolUser"("userId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "TempSchoolUser_userId_schoolId_key" ON "TempSchoolUser"("userId", "schoolId");

-- AddForeignKey
ALTER TABLE "TempSchoolUser" ADD CONSTRAINT "TempSchoolUser_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempSchoolUser" ADD CONSTRAINT "TempSchoolUser_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempSchoolUser" ADD CONSTRAINT "TempSchoolUser_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
