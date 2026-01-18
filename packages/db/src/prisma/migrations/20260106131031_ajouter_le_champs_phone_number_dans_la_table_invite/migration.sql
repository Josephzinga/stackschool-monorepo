-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
