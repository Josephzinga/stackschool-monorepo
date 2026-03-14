-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "mainTeacherId" TEXT;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_mainTeacherId_fkey" FOREIGN KEY ("mainTeacherId") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
