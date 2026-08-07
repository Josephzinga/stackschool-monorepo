
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RelationType {
    FATHER = "FATHER",
    MOTHER = "MOTHER",
    GUARDIAN = "GUARDIAN",
    UNCLE = "UNCLE",
    OTHER = "OTHER",
    GRAND_MOTHER = "GRAND_MOTHER",
    GRAND_FATHER = "GRAND_FATHER",
    AUNT = "AUNT"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum TransportMode {
    BUS = "BUS",
    WALK = "WALK",
    CAR = "CAR",
    MOTO = "MOTO",
    TAXI = "TAXI",
    PARENT = "PARENT",
    OTHER = "OTHER"
}

export enum SchoolRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    STAFF = "STAFF"
}

export enum StudentStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    EXPELLED = "EXPELLED",
    TRANSFERRED = "TRANSFERRED",
    DROPPED_OUT = "DROPPED_OUT",
    GRADUATED = "GRADUATED",
    INACTIVE = "INACTIVE",
    DECEASED = "DECEASED"
}

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

export enum StudentSortField {
    firstname = "firstname",
    lastname = "lastname",
    enrolementYear = "enrolementYear"
}

export enum PermissionCode {
    MARK_STUDENT_ATTENDANCE = "MARK_STUDENT_ATTENDANCE",
    MARK_TEACHER_ATTENDANCE = "MARK_TEACHER_ATTENDANCE",
    MARK_STAFF_ATTENDANCE = "MARK_STAFF_ATTENDANCE",
    VIEW_ATTENDANCE_REPORTS = "VIEW_ATTENDANCE_REPORTS",
    MANAGE_SUBJECTS = "MANAGE_SUBJECTS",
    INPUT_GRADES = "INPUT_GRADES",
    PUBLISH_BULLETINS = "PUBLISH_BULLETINS",
    CREATE_USER = "CREATE_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER",
    MANAGE_USER_PERMISSIONS = "MANAGE_USER_PERMISSIONS",
    MANAGE_PAYMENTS = "MANAGE_PAYMENTS",
    VIEW_FINANCIAL_REPORTS = "VIEW_FINANCIAL_REPORTS"
}

export enum ParentStudentUpdateMode {
    CREATE = "CREATE",
    CONNECT = "CONNECT"
}

export enum PermissionModule {
    ATTENDANCE = "ATTENDANCE",
    ACADEMICS = "ACADEMICS",
    USERS = "USERS",
    FINANCE = "FINANCE",
    SETTINGS = "SETTINGS"
}

export enum DisciplinaryType {
    SUSPENSION = "SUSPENSION",
    EXPULSION = "EXPULSION",
    WARNING = "WARNING"
}

export class CreateParentInput {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isDelegate?: Nullable<boolean>;
    email?: Nullable<string>;
    address: string;
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
    firstname: string;
    lastname: string;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    classId: string;
    matricule: string;
    birthDate?: Nullable<DateTime>;
    birthPlace?: Nullable<DateTime>;
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

export class CreateTeacherAssignmentInput {
    classId: string;
    subjectIds: string[];
    teacherId: string;
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

export class User {
    id: string;
    memberships?: Nullable<Nullable<SchoolMembership>[]>;
    schoolContext?: Nullable<SchoolMembership>;
}

export class Profile {
    id: string;
}

export class ClassSubject {
    id: string;
}

export class Lesson {
    id: string;
}

export class Class {
    id: string;
}

export class AttendanceRecord {
    id: string;
}

export class ClassLessons {
    id: string;
}

export class Permission {
    id: string;
    code?: Nullable<PermissionCode>;
    module?: Nullable<PermissionModule>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    user?: Nullable<User>;
}

export class SchoolMembership {
    id: string;
    role: SchoolRole;
    schoolId?: Nullable<string>;
    school?: Nullable<School>;
    permissions?: Nullable<Nullable<Permission>[]>;
    member?: Nullable<Member>;
    user?: Nullable<User>;
    teacher?: Nullable<Teacher>;
    student?: Nullable<Student>;
    parent?: Nullable<Parent>;
    staff?: Nullable<Staff>;
}

export abstract class IMutation {
    abstract createTeacher(input?: Nullable<CreateTeacherInput>): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract createTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract syncTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteTeacherAssignment(id: string, subjectIds?: Nullable<string[]>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract updateTeacher(teacherId: string, data: CreateTeacherInput): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract deleteTeachers(teacherIds: string[], soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteStudents(studentIds: string[], schoolId: string, soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createListStudent(data: CreateStudentInput, schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract updateStudent(studentId: string, data: CreateStudentInput, schoolId: string): Nullable<Student> | Promise<Nullable<Student>>;

    abstract createParent(input: CreateParentInput): Parent | Promise<Parent>;
}

export class Parent {
    id: string;
    profession?: Nullable<string>;
    isDelegate?: Nullable<boolean>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    schoolUserId?: Nullable<string>;
    user?: Nullable<User>;
}

export class ParentStudent {
    relationType?: Nullable<RelationType>;
    student?: Nullable<Student>;
    studentId?: Nullable<string>;
    parentId?: Nullable<string>;
    parent?: Nullable<Parent>;
}

export class ParentList {
    data?: Nullable<Parent[]>;
    meta?: Nullable<PaginationMeta>;
}

export abstract class IQuery {
    abstract searchStudent(filter: StudentSearchInput): Nullable<Student[]> | Promise<Nullable<Student[]>>;

    abstract searchSchool(filter: SchoolSearchInput): Nullable<School[]> | Promise<Nullable<School[]>>;

    abstract school(schoolId: string): School | Promise<School>;

    abstract teacher(id: string): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract student(id: string): Nullable<Student> | Promise<Nullable<Student>>;

    abstract getSchoolTeachers(input: GetSchoolTeachersInput): TeacherList | Promise<TeacherList>;

    abstract getSchoolStudents(input: GetSchoolStudentsInput): StudentList | Promise<StudentList>;

    abstract getSchoolParents(filter: GetSchoolParentsInput): Nullable<ParentList> | Promise<Nullable<ParentList>>;
}

export class SchoolProfile {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
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
    code?: Nullable<string>;
    logo?: Nullable<string>;
    stats?: Nullable<SchoolStats>;
    settings?: Nullable<SchoolSettings>;
    teachers?: Nullable<Nullable<Teacher>[]>;
    lessons?: Nullable<Nullable<Lesson>[]>;
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
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    monthlyRevenue?: Nullable<MonthlyRevenue>;
    pendingPaymentsCount?: Nullable<number>;
    studentGender?: Nullable<GenderStats>;
}

export class MonthlyRevenue {
    currentMonth: number;
    previousMonth?: Nullable<number>;
}

export class GenderStats {
    male: number;
    female: number;
}

export class Staff {
    id: string;
    schoolUserId: string;
    position: string;
    hireDate?: Nullable<DateTime>;
    salary?: Nullable<number>;
    department?: Nullable<string>;
}

export class Student {
    id: string;
    matricule: string;
    birthDate?: Nullable<DateTime>;
    birthPlace?: Nullable<DateTime>;
    schoolUserId?: Nullable<string>;
    enrollmentDate?: Nullable<DateTime>;
    previousClass?: Nullable<string>;
    studentNumber?: Nullable<number>;
    bloodGroup?: Nullable<string>;
    birthCertificateNumber?: Nullable<string>;
    medicalCondition?: Nullable<string>;
    allergies?: Nullable<string>;
    attendances?: Nullable<AttendanceRecord[]>;
    transportMode?: Nullable<TransportMode>;
    previousSchool?: Nullable<string>;
    enrollmentYear: string;
    status?: Nullable<StudentStatus>;
    disciplinaryActions?: Nullable<StudentDisciplinaryAction>;
    nationality?: Nullable<string>;
    schoolClass?: Nullable<Class>;
    classId?: Nullable<string>;
    profileId?: Nullable<string>;
    profile?: Nullable<Profile>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    user?: Nullable<User>;
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

export class TeacherAssignments {
    id: string;
    teacher?: Nullable<Teacher>;
    teacherId: string;
    classSubjectId: string;
    classSubjects?: Nullable<ClassSubject>;
    lessons?: Nullable<Lesson[]>;
    schoolId?: Nullable<string>;
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
    assignments?: Nullable<Nullable<TeacherAssignments>[]>;
    supervisedClasses?: Nullable<Nullable<Class>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    attendances?: Nullable<AttendanceRecord[]>;
    weeklyHours?: Nullable<number>;
    classesCount?: Nullable<number>;
    user?: Nullable<User>;
}

export class TeacherList {
    data: Teacher[];
    meta: PaginationMeta;
}

export class TeacherTodaySubject {
    teachers?: Nullable<Teacher>;
    classes?: Nullable<ClassLessons>;
}

export type DateTime = any;
export type Member = Teacher | Student | Parent | Staff;
type Nullable<T> = T | null;
