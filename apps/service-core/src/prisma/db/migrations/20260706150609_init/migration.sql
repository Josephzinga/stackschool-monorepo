-- CreateEnum
CREATE TYPE "DisciplinaryType" AS ENUM ('SUSPENSION', 'EXPULSION', 'WARNING');

-- CreateEnum
CREATE TYPE "SchoolRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF');

-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SUPER_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'UNCLE', 'OTHER', 'GRAND_MOTHER', 'GRAND_FATHER', 'AUNT');

-- CreateEnum
CREATE TYPE "ContactPreference" AS ENUM ('WHATSAPP', 'EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPELLED', 'TRANSFERRED', 'DROPPED_OUT', 'GRADUATED', 'INACTIVE', 'DECEASED');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('BUS', 'WALK', 'CAR', 'MOTO', 'TAXI', 'PARENT', 'OTHER');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('SOLO', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('FINISHED', 'STARTED');

-- CreateEnum
CREATE TYPE "PermissionModule" AS ENUM ('ATTENDANCE', 'ACADEMICS', 'USERS', 'FINANCE', 'SETTINGS');

-- CreateEnum
CREATE TYPE "PermissionCode" AS ENUM ('MARK_STUDENT_ATTENDANCE', 'MARK_TEACHER_ATTENDANCE', 'MARK_STAFF_ATTENDANCE', 'VIEW_ATTENDANCE_REPORTS', 'MANAGE_CLASSES', 'MANAGE_SUBJECTS', 'INPUT_GRADES', 'PUBLISH_BULLETINS', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_USER_PERMISSIONS', 'MANAGE_PAYMENTS', 'VIEW_FINANCIAL_REPORTS');

-- CreateEnum
CREATE TYPE "StaffPosition" AS ENUM ('SECRETARY', 'GUARDIAN', 'SUPERVISOR', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'CLEANER', 'MAINTENANCE', 'OTHER');

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "address" TEXT NOT NULL,
    "code" TEXT,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "invitationCode" TEXT,
    "logo" TEXT,
    "motto" TEXT,
    "orangeMerchantId" TEXT,
    "paymentApiKey" TEXT,
    "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSettings" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "lessonDuration" INTEGER NOT NULL DEFAULT 50,
    "startHour" INTEGER NOT NULL DEFAULT 8,
    "endHour" INTEGER NOT NULL DEFAULT 18,
    "daysOfWeek" "Day"[],
    "breakStartHour" INTEGER NOT NULL DEFAULT 12,
    "breakDuration" INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT "SchoolSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" "PermissionCode" NOT NULL,
    "name" TEXT NOT NULL,
    "module" "PermissionModule" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolUserPermission" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "SchoolUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolUser" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "SchoolRole" NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDisciplinaryAction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "DisciplinaryType" NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentDisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "profession" TEXT,
    "isDelegate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactPreference" "ContactPreference" DEFAULT 'WHATSAPP',

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "enrollmentYear" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3),
    "studentNumber" SERIAL NOT NULL,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "medicalCondition" TEXT,
    "schoolUserId" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "birthPlace" TEXT,
    "nationality" TEXT,
    "previousClass" TEXT,
    "previousLevel" TEXT,
    "birthCertificateNumber" TEXT,
    "previousSchool" TEXT,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "transportMode" "TransportMode" NOT NULL DEFAULT 'WALK',
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStudent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,

    CONSTRAINT "ParentStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "diploma" TEXT,
    "experience" TEXT,
    "hireDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL,
    "salary" DOUBLE PRECISION,
    "department" TEXT,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "bio" TEXT,
    "cvUrl" TEXT,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "schoolUserId" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3),
    "position" "StaffPosition" NOT NULL DEFAULT 'OTHER',
    "positionOther" TEXT,
    "salary" DOUBLE PRECISION,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "token" TEXT,
    "relation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "role" "SchoolRole" NOT NULL,
    "message" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "code" TEXT,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "stripeSubId" TEXT,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stripeId" TEXT,
    "priceCents" INTEGER NOT NULL,
    "features" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "School_code_key" ON "School"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSettings_schoolId_key" ON "SchoolSettings"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolUserPermission_schoolUserId_permissionId_key" ON "SchoolUserPermission"("schoolUserId", "permissionId");

-- CreateIndex
CREATE INDEX "SchoolUser_schoolId_idx" ON "SchoolUser"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolUser_userId_idx" ON "SchoolUser"("userId");

-- CreateIndex
CREATE INDEX "SchoolUser_role_idx" ON "SchoolUser"("role");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolUser_schoolId_userId_key" ON "SchoolUser"("schoolId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_schoolUserId_key" ON "Parent"("schoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_profileId_key" ON "Student"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolUserId_key" ON "Student"("schoolUserId");

-- CreateIndex
CREATE INDEX "Student_schoolUserId_idx" ON "Student"("schoolUserId");

-- CreateIndex
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_matricule_schoolId_key" ON "Student"("matricule", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudent_parentId_studentId_key" ON "ParentStudent"("parentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_schoolUserId_key" ON "Teachers"("schoolUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_schoolUserId_key" ON "Staff"("schoolUserId");

-- CreateIndex
CREATE INDEX "Staff_schoolUserId_idx" ON "Staff"("schoolUserId");

-- CreateIndex
CREATE INDEX "Staff_position_idx" ON "Staff"("position");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "Invite"("code");

-- CreateIndex
CREATE INDEX "Invite_schoolId_idx" ON "Invite"("schoolId");

-- CreateIndex
CREATE INDEX "Invite_studentId_idx" ON "Invite"("studentId");

-- CreateIndex
CREATE INDEX "Subscription_schoolId_idx" ON "Subscription"("schoolId");

-- AddForeignKey
ALTER TABLE "SchoolSettings" ADD CONSTRAINT "SchoolSettings_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolUserPermission" ADD CONSTRAINT "SchoolUserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolUserPermission" ADD CONSTRAINT "SchoolUserPermission_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolUser" ADD CONSTRAINT "SchoolUser_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDisciplinaryAction" ADD CONSTRAINT "StudentDisciplinaryAction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
