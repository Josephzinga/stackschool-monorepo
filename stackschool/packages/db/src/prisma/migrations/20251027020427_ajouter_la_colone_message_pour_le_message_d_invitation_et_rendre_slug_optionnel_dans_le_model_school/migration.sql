/*
  Warnings:

  - Added the required column `message` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "inviationCode" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "motto" TEXT,
ALTER COLUMN "slug" DROP NOT NULL;
