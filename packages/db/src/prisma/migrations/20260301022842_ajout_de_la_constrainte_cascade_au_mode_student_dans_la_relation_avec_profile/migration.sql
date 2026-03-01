-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_profileId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
