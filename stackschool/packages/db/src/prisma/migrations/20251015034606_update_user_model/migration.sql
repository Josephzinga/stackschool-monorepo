-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasMembership" BOOLEAN DEFAULT false,
ADD COLUMN     "profileCompleted" BOOLEAN DEFAULT false,
ALTER COLUMN "globalRole" SET DEFAULT 'USER';
