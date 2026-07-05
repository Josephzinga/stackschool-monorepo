/*
  Warnings:

  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_sess_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "id_token",
DROP COLUMN "scope",
DROP COLUMN "session_state",
DROP COLUMN "token_type";

-- AlterTable
ALTER TABLE "SchoolUser" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
