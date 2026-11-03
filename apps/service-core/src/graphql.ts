
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export type RelationType = "FATHER" | "MOTHER" | "GUARDIAN" | "UNCLE" | "OTHER" | "GRAND_MOTHER" | "GRAND_FATHER" | "AUNT";
export type Gender = "MALE" | "FEMALE";
export type TransportMode = "BUS" | "WALK" | "CAR" | "MOTO" | "TAXI" | "PARENT" | "OTHER";
export type StudentStatus = "ACTIVE" | "SUSPENDED" | "EXPELLED" | "TRANSFERRED" | "DROPPED_OUT" | "GRADUATED" | "INACTIVE" | "DECEASED";
export type SortOrder = "ASC" | "DESC";
export type StudentSortField = "firstName" | "lastName" | "level" | "enrolementYear";
export type PermissionAction = "MANAGE" | "CREATE" | "READ" | "UPDATE" | "DELETE" | "MARK" | "PUBLISH" | "EXPORT" | "CONFIRM";
export type PermissionSubject = "STUDENT" | "TEACHER" | "PARENT" | "STAFF" | "CLASS" | "ENROLLMENT" | "SUBJECT" | "LESSON" | "GRADE" | "BULLETIN" | "TIMETABLE" | "EXAM" | "ATTENDANCE_RECORD" | "PAYMENT" | "PAYROLL" | "FINANCIAL_REPORT" | "SCHOOL_SETTINGS" | "SCHOOL_USER_PERMISSION" | "ALL";
export type StaffPosition = "SECRETARY" | "GUARDIAN" | "SUPERVISOR" | "ACCOUNTANT" | "LIBRARIAN" | "NURSE" | "CLEANER" | "MAINTENANCE" | "OTHER";
export type ParentStudentUpdateMode = "CREATE" | "CONNECT";
export type PermissionModule = "ATTENDANCE" | "ACADEMICS" | "USERS" | "FINANCE" | "SETTINGS" | "ENROLLMENT";
export type DisciplinaryType = "SUSPENSION" | "EXPULSION" | "WARNING";
export type LessonStatus = "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED" | "POSTPONED";
export type ResourceMode = "TEACHER" | "CLASS";
export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type SchoolRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
export type link__Purpose = "SECURITY" | "EXECUTION";

export class UpdateSchoolUserPermissionsInput {
    schoolUserId: string;
    grantPermissionIds?: Nullable<Nullable<string>[]>;
    revokePermissionIds?: Nullable<Nullable<string>[]>;
}

export class GetSchoolMembershipsInput {
    id?: Nullable<string>;
    searchTerm?: Nullable<string>;
    limit?: Nullable<number>;
}

export class CreateParentStudentInput {
    id?: Nullable<string>;
    parentId: string;
    studentId: string;
    relationType: RelationType;
}

export class UpdateParentStudentInput {
    id: string;
    relationType?: Nullable<RelationType>;
}

export class UpdateParentInput {
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    isDelegate?: Nullable<boolean>;
    gender?: Nullable<Gender>;
    email?: Nullable<string>;
    address?: Nullable<string>;
    profession?: Nullable<string>;
    children?: Nullable<CreateParentStudentInput[]>;
}

export class CreateParentInput {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isDelegate?: Nullable<boolean>;
    gender: Gender;
    email?: Nullable<string>;
    address?: Nullable<string>;
    profession: string;
    children?: Nullable<ParentStudentInput[]>;
}

export class UpdateStudentParentData {
    mode?: Nullable<ParentStudentUpdateMode>;
    parentId?: Nullable<string>;
    newParent?: Nullable<CreateParentInput>;
}

export class ParentStudentInput {
    id: string;
    relationType: RelationType;
}

export class GetSchoolParentsInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    studentId?: Nullable<string>;
}

export class SchoolSearchInput {
    searchTerm?: Nullable<string>;
}

export class CreateStaffInput {
    firstName: string;
    lastName: string;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    email?: Nullable<string>;
    position: StaffPosition;
    department?: Nullable<string>;
    address?: Nullable<string>;
}

export class GetSchoolStaffInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
}

export class GetSchoolStudentsInput {
    page: number;
    limit: number;
    teacherId?: Nullable<string>;
    sort?: Nullable<StudentSortInput>;
    classId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    level?: Nullable<string>;
    section?: Nullable<string>;
}

export class StudentSortInput {
    field?: Nullable<StudentSortField>;
    order?: Nullable<SortOrder>;
}

export class CreateStudentInput {
    firstName: string;
    lastName: string;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    classId: string;
    matricule: string;
    birthDate?: Nullable<DateTime>;
    birthPlace?: Nullable<string>;
    enrollmentYear?: Nullable<string>;
    nationality?: Nullable<string>;
    enrollmentDate?: Nullable<DateTime>;
    previousClass?: Nullable<string>;
    studentNumber?: Nullable<number>;
    address?: Nullable<string>;
    bloodGroup?: Nullable<string>;
    birthCertificateNumber?: Nullable<string>;
    medicalCondition?: Nullable<string>;
    allergies?: Nullable<string>;
    parentData?: Nullable<UpdateStudentParentData>;
    transportMode?: Nullable<TransportMode>;
    previousSchool?: Nullable<string>;
    status?: Nullable<StudentStatus>;
}

export class StudentSearchInput {
    schoolId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    getSubject?: Nullable<boolean>;
    limit?: Nullable<number>;
}

export class CreateTeacherInput {
    firstName: string;
    lastName: string;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    diploma?: Nullable<string>;
    specialization: string;
}

export class GetSchoolTeachersInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId?: Nullable<string>;
    isActive?: Nullable<boolean>;
    isSupervisor?: Nullable<boolean>;
    day?: Nullable<Day>;
}

export class User {
    id: string;
    memberships?: Nullable<Nullable<SchoolMembership>[]>;
    schoolContext?: Nullable<SchoolMembership>;
}

export class TeacherAssignment {
    id: string;
    teacherId: string;
    teacher?: Nullable<Teacher>;
}

export class SchoolEvent {
    id: string;
}

export class Class {
    id: string;
    supervisor?: Nullable<Teacher>;
    students?: Nullable<Student[]>;
    studentCount?: Nullable<StudentCount>;
}

export class Subject {
    id: string;
    mainTeacher?: Nullable<Teacher>;
}

export class StudentCount {
    male: number;
    female: number;
}

export class Lesson {
    id: string;
    teacherId?: Nullable<string>;
    teacher?: Nullable<LessonTeacher>;
}

export class LessonTeacher {
    id: string;
    firstName: string;
    lastName: string;
    weeklyHours?: Nullable<number>;
}

export class AttendanceRecord {
    id: string;
    recordedById: string;
    recordedBy?: Nullable<SchoolMembership>;
    member?: Nullable<SchoolMember>;
}

export class Permission {
    id: string;
    action: PermissionAction;
    subject: PermissionSubject;
    module: PermissionModule;
    name: string;
    description?: Nullable<string>;
    conditions?: Nullable<JSON>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class SchoolMembership {
    id: string;
    role: SchoolRole;
    userId: string;
    schoolId?: Nullable<string>;
    school?: Nullable<School>;
    isActive: boolean;
    isOwner: boolean;
    schoolProfile?: Nullable<SchoolProfile>;
    permissions?: Nullable<Nullable<Permission>[]>;
    member?: Nullable<SchoolMember>;
    teacher?: Nullable<Teacher>;
    student?: Nullable<Student>;
    parent?: Nullable<Parent>;
    staff?: Nullable<Staff>;
}

export abstract class IMutation {
    abstract createTeacher(input?: Nullable<CreateTeacherInput>): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract updateTeacher(teacherId: string, data: CreateTeacherInput): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract deleteTeachers(teacherIds: string[], soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteStudents(studentIds: string[], soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createStudent(input: CreateStudentInput): Nullable<Student> | Promise<Nullable<Student>>;

    abstract updateStudent(studentId: string, input: CreateStudentInput): Nullable<Student> | Promise<Nullable<Student>>;

    abstract createParent(input: CreateParentInput): Parent | Promise<Parent>;

    abstract updateParent(input: UpdateParentInput): Parent | Promise<Parent>;

    abstract createParentStudent(input?: Nullable<CreateParentStudentInput[]>): Nullable<ParentStudent[]> | Promise<Nullable<ParentStudent[]>>;

    abstract updateParentStudent(input?: Nullable<CreateParentStudentInput[]>): Nullable<ParentStudent[]> | Promise<Nullable<ParentStudent[]>>;

    abstract createStaff(input: CreateStaffInput): Staff | Promise<Staff>;

    abstract updateSchoolUserPermissions(input: UpdateSchoolUserPermissionsInput): SchoolMembership | Promise<SchoolMembership>;
}

export class Parent {
    id: string;
    profession?: Nullable<string>;
    isDelegate?: Nullable<boolean>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    schoolUserId?: Nullable<string>;
    schoolProfile?: Nullable<SchoolProfile>;
    member?: Nullable<SchoolMembership>;
}

export class ParentStudent {
    id: string;
    relationType: RelationType;
    student?: Nullable<Student>;
    studentId: string;
    parentId: string;
    parent?: Nullable<Parent>;
}

export class ParentList {
    data?: Nullable<Parent[]>;
    meta?: Nullable<PaginationMeta>;
}

export class SchoolProfile {
    id: string;
    firstName: string;
    lastName: string;
    address?: Nullable<string>;
    gender: Gender;
    avatarUrl?: Nullable<string>;
    bio?: Nullable<string>;
    schoolUserId: string;
    schoolId: string;
}

export class School {
    id: string;
    name: string;
    slug?: Nullable<string>;
    address: string;
    code: string;
    logo?: Nullable<string>;
    stats?: Nullable<SchoolStats>;
    settings?: Nullable<SchoolSettings>;
    teachers?: Nullable<Nullable<Teacher>[]>;
    events?: Nullable<Nullable<SchoolEvent>[]>;
}

export class SchoolSettings {
    id: string;
    schoolId?: Nullable<string>;
    lessonDuration?: Nullable<number>;
    startHour?: Nullable<number>;
    endHour?: Nullable<number>;
    daysOfWeek?: Nullable<Nullable<Day>[]>;
}

export class SchoolStats {
    id: string;
    totalStudents: number;
    totalTeachers: number;
    monthlyRevenue?: Nullable<MonthlyRevenue>;
    pendingPaymentsCount?: Nullable<number>;
    studentGender?: Nullable<GenderStats>;
    enrollmentPerMonth?: Nullable<MonthlyStats[]>;
}

export class MonthlyRevenue {
    currentMonth: number;
    previousMonth?: Nullable<number>;
}

export class MonthlyStats {
    month: string;
    count: number;
}

export class Staff {
    id: string;
    schoolUserId: string;
    position: StaffPosition;
    hireDate?: Nullable<DateTime>;
    salary?: Nullable<number>;
    department?: Nullable<string>;
    schoolProfile?: Nullable<SchoolProfile>;
    schoolUser?: Nullable<SchoolMembership>;
}

export class StaffList {
    data: Staff[];
    meta: PaginationMeta;
}

export class Student {
    id: string;
    matricule: string;
    birthDate?: Nullable<DateTime>;
    birthPlace?: Nullable<string>;
    schoolUserId?: Nullable<string>;
    enrollmentDate?: Nullable<DateTime>;
    previousClass?: Nullable<string>;
    studentNumber?: Nullable<number>;
    bloodGroup?: Nullable<string>;
    birthCertificateNumber?: Nullable<string>;
    medicalCondition?: Nullable<string>;
    allergies?: Nullable<string>;
    transportMode?: Nullable<TransportMode>;
    previousSchool?: Nullable<string>;
    classId: string;
    enrollmentYear?: Nullable<string>;
    status?: Nullable<StudentStatus>;
    disciplinaryActions?: Nullable<StudentDisciplinaryAction>;
    nationality?: Nullable<string>;
    profileId?: Nullable<string>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    schoolProfile?: Nullable<SchoolProfile>;
    schoolUser?: Nullable<SchoolMembership>;
}

export class StudentDisciplinaryAction {
    id?: Nullable<string>;
    studentId?: Nullable<string>;
    type?: Nullable<DisciplinaryType>;
    reason?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
}

export class StudentList {
    data?: Nullable<Student[]>;
    meta: PaginationMeta;
}

export class Teacher {
    id: string;
    schoolUserId?: Nullable<string>;
    diploma?: Nullable<string>;
    experience?: Nullable<string>;
    hireDate?: Nullable<DateTime>;
    isActive?: Nullable<boolean>;
    bio?: Nullable<string>;
    salary?: Nullable<number>;
    department?: Nullable<string>;
    specialization?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    weeklyHours?: Nullable<number>;
    classesCount?: Nullable<number>;
    schoolUser?: Nullable<SchoolMembership>;
    schoolProfile?: Nullable<SchoolProfile>;
}

export class TeacherList {
    data: Teacher[];
    meta: PaginationMeta;
}

export class TeacherTodaySubject {
    teachers?: Nullable<Teacher>;
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

export abstract class IQuery {
    abstract searchStudent(filter: StudentSearchInput): Nullable<Nullable<Student>[]> | Promise<Nullable<Nullable<Student>[]>>;

    abstract searchSchool(filter: SchoolSearchInput): Nullable<School[]> | Promise<Nullable<School[]>>;

    abstract getMemberships(input: GetSchoolMembershipsInput): Nullable<SchoolMembership>[] | Promise<Nullable<SchoolMembership>[]>;

    abstract membership(id: string): Nullable<SchoolMembership> | Promise<Nullable<SchoolMembership>>;

    abstract permissions(): Permission[] | Promise<Permission[]>;

    abstract school(schoolId: string): School | Promise<School>;

    abstract teacher(id: string): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract student(id: string): Nullable<Student> | Promise<Nullable<Student>>;

    abstract getSchoolTeachers(input: GetSchoolTeachersInput): TeacherList | Promise<TeacherList>;

    abstract getSchoolStudents(input: GetSchoolStudentsInput): StudentList | Promise<StudentList>;

    abstract getSchoolParents(filter: GetSchoolParentsInput): Nullable<ParentList> | Promise<Nullable<ParentList>>;

    abstract getSchoolStaff(input: GetSchoolStaffInput): StaffList | Promise<StaffList>;
}

export class _Service {
    sdl?: Nullable<string>;
}

export type JSON = any;
export type DateTime = any;
export type link__Import = any;
export type federation__FieldSet = any;
export type _Any = any;

export class ISchema {
    Query: IQuery;
    Mutation: IMutation;
}

export type SchoolMember = Teacher | Student | Parent | Staff;
export type _Entity = AttendanceRecord | Class | Lesson | LessonTeacher | Parent | ParentStudent | Permission | School | SchoolEvent | SchoolMembership | SchoolSettings | SchoolStats | Staff | Student | Subject | Teacher | TeacherAssignment | User;
type Nullable<T> = T | null;
