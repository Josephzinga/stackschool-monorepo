-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "schoolUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "schoolUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "schoolUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teachers" ALTER COLUMN "schoolUserId" DROP NOT NULL;
