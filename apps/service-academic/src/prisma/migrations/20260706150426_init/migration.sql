-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('EXAM', 'ASSIGNMENT', 'QUIZ', 'TEST', 'PRACTICAL', 'ORAL');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('SCIENTIFIC', 'LITERARY', 'GENERAL', 'SPORT');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('SOLO', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('FINISHED', 'STARTED');

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "category" "SubjectCategory" NOT NULL DEFAULT 'GENERAL',
    "mainTeacherId" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSubjects" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "weeklyHours" INTEGER,
    "coefficient" INTEGER NOT NULL DEFAULT 1,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "ClassSubjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classSubjectId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "section" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT NOT NULL,
    "teacherId" TEXT,
    "defaultRoomId" TEXT,
    "supervisorId" TEXT,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GroupType" NOT NULL DEFAULT 'SOLO',
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT DEFAULT 'CLASSIC',
    "capacity" INTEGER,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "startTime" TIME NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'PLANNED',
    "day" "Day" NOT NULL,
    "date" DATE NOT NULL,
    "endTime" TIME NOT NULL,
    "schoolId" TEXT NOT NULL,
    "roomId" TEXT,
    "teacherAssignmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIME,
    "status" "SessionStatus" NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "description" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "weight" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classSubjectId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" DATE,
    "dueDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "grade" TEXT,
    "feedback" TEXT,
    "status" TEXT,
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_schoolId_idx" ON "Subject"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_schoolId_key" ON "Subject"("name", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_schoolId_key" ON "Subject"("code", "schoolId");

-- CreateIndex
CREATE INDEX "ClassSubjects_groupId_idx" ON "ClassSubjects"("groupId");

-- CreateIndex
CREATE INDEX "ClassSubjects_subjectId_idx" ON "ClassSubjects"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSubjects_groupId_subjectId_key" ON "ClassSubjects"("groupId", "subjectId");

-- CreateIndex
CREATE INDEX "TeacherAssignment_schoolId_idx" ON "TeacherAssignment"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_schoolId_classSubjectId_teacherId_key" ON "TeacherAssignment"("schoolId", "classSubjectId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_classSubjectId_key" ON "TeacherAssignment"("classSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAssignment_schoolId_classSubjectId_key" ON "TeacherAssignment"("schoolId", "classSubjectId");

-- CreateIndex
CREATE INDEX "Class_schoolId_idx" ON "Class"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_schoolId_key" ON "Class"("name", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_defaultRoomId_key" ON "Class"("defaultRoomId");

-- CreateIndex
CREATE INDEX "Group_schoolId_idx" ON "Group"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_schoolId_key" ON "Group"("name", "schoolId");

-- CreateIndex
CREATE INDEX "Room_schoolId_idx" ON "Room"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_schoolId_key" ON "Room"("name", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_code_schoolId_key" ON "Room"("code", "schoolId");

-- CreateIndex
CREATE INDEX "Lesson_schoolId_idx" ON "Lesson"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_schoolId_teacherAssignmentId_roomId_key" ON "Lesson"("schoolId", "teacherAssignmentId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_schoolId_day_endTime_startTime_teacherAssignmentId_key" ON "Lesson"("schoolId", "day", "endTime", "startTime", "teacherAssignmentId");

-- CreateIndex
CREATE INDEX "Assessment_teacherId_idx" ON "Assessment"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_title_classSubjectId_startDate_key" ON "Assessment"("title", "classSubjectId", "startDate");

-- CreateIndex
CREATE INDEX "AssessmentResult_studentId_idx" ON "AssessmentResult"("studentId");

-- CreateIndex
CREATE INDEX "AssessmentResult_assessmentId_idx" ON "AssessmentResult"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_assessmentId_studentId_key" ON "AssessmentResult"("assessmentId", "studentId");

-- AddForeignKey
ALTER TABLE "ClassSubjects" ADD CONSTRAINT "ClassSubjects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubjects" ADD CONSTRAINT "ClassSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_defaultRoomId_fkey" FOREIGN KEY ("defaultRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherAssignmentId_fkey" FOREIGN KEY ("teacherAssignmentId") REFERENCES "TeacherAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
