/*
  Warnings:

  - The `type` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('CLASSROOM', 'LECTURE_HALL', 'COMPUTER_LAB', 'LIBRARY', 'STUDY_ROOM', 'TEACHERS_ROOM', 'ADMINISTRATIVE_OFFICE', 'MEETING_ROOM', 'EXAM_ROOM', 'SPORTS_HALL', 'GYM', 'CANTEEN', 'MEDICAL_ROOM', 'STORAGE_ROOM', 'MULTIPURPOSE_ROOM', 'OTHER');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "type",
ADD COLUMN     "type" "RoomType" DEFAULT 'CLASSROOM';
