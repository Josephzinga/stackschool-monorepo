/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sess]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expire` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `Session` table without a default value. This is not possible if the table is not empty.
  - The required column `sid` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "public"."Session_sessionToken_key";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "expires",
DROP COLUMN "id",
DROP COLUMN "sessionToken",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sess" TEXT NOT NULL,
ADD COLUMN     "sid" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sess_key" ON "Session"("sess");
