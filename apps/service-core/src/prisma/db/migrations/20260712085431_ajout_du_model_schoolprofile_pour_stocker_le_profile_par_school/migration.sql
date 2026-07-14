-- CreateTable
CREATE TABLE "SchoolProfile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "schoolUserId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "SchoolProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolProfile_schoolUserId_key" ON "SchoolProfile"("schoolUserId");

-- AddForeignKey
ALTER TABLE "SchoolProfile" ADD CONSTRAINT "SchoolProfile_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolProfile" ADD CONSTRAINT "SchoolProfile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
