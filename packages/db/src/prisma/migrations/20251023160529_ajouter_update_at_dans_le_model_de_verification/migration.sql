-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "updateAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "updateAt" TIMESTAMP(3);
