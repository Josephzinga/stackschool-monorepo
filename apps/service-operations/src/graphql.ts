
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type AttendanceType = "DAILY" | "SUBJECT";
export type LessonStatus = "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED" | "POSTPONED";
export type ResourceMode = "TEACHER" | "CLASS";
export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type SchoolRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
export type link__Purpose = "SECURITY" | "EXECUTION";

export class MarkAttendanceInput {
    id: string;
    classId?: Nullable<string>;
    status: AttendanceStatus;
    date: DateTime;
    userType: SchoolRole;
    isSubjectMode: boolean;
    subjectId?: Nullable<string>;
}

export class MarkEmployeeAttendanceInput {
    schoolUserId: string;
    status: AttendanceStatus;
    date?: Nullable<DateTime>;
}

export class GetTeacherForAttendanceInput {
    search?: Nullable<string>;
    day?: Nullable<Day>;
    page: number;
    limit: number;
    attendanceDate?: Nullable<DateTime>;
}

export class GenerateSessionInput {
    targetRole: string;
    durationMinutes?: Nullable<number>;
}

export class AttendanceStats {
    rate: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    totalExpected: number;
    history?: Nullable<DailyAttendance[]>;
}

export class DailyAttendance {
    date: DateTime;
    rate: number;
    present: number;
    absent: number;
    late: number;
}

export class AttendanceSessionPayload {
    sessionId: string;
    qrCodeDataUrl: string;
    secretCode: string;
    expiresAt: DateTime;
}

export class AttendanceRecord {
    id: string;
    status?: Nullable<AttendanceStatus>;
    date?: Nullable<DateTime>;
    checkInTime?: Nullable<DateTime>;
    recordedById: string;
    type?: Nullable<AttendanceType>;
}

export class Teacher {
    id: string;
    attendances?: Nullable<Nullable<AttendanceRecord>[]>;
}

export class Student {
    id: string;
    attendances?: Nullable<Nullable<AttendanceRecord>[]>;
}

export class SchoolStats {
    id: string;
    attendance?: Nullable<AttendanceStats>;
}

export class Staff {
    id: string;
}

export class SchoolMembership {
    id: string;
    userId: string;
}

export abstract class IMutation {
    abstract markAttendance(input?: Nullable<MarkAttendanceInput[]>): AttendanceRecord | Promise<AttendanceRecord>;
}

export class ApiResponse {
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    details?: Nullable<Nullable<string>[]>;
}

export class PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GenderStats {
    male: number;
    female: number;
}

export class _Service {
    sdl?: Nullable<string>;
}

export abstract class IQuery {
}

export type DateTime = Date;
export type link__Import = any;
export type federation__FieldSet = any;
export type _Any = any;

export class ISchema {
    Query: IQuery;
    Mutation: IMutation;
}

export type SchoolMember = Teacher | Student | Staff;
export type _Entity = AttendanceRecord | SchoolMembership | SchoolStats | Staff | Student | Teacher;
type Nullable<T> = T | null;
