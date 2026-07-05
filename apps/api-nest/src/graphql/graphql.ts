
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export type SchoolRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
export type LessonStatus = "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED" | "POSTPONED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type PermissionCode = "MARK_STUDENT_ATTENDANCE" | "MARK_TEACHER_ATTENDANCE" | "MARK_STAFF_ATTENDANCE" | "VIEW_ATTENDANCE_REPORTS" | "MANAGE_SUBJECTS" | "INPUT_GRADES" | "PUBLISH_BULLETINS" | "CREATE_USER" | "UPDATE_USER" | "DELETE_USER" | "MANAGE_USER_PERMISSIONS" | "MANAGE_PAYMENTS" | "VIEW_FINANCIAL_REPORTS";
export type PermissionModule = "ATTENDANCE" | "ACADEMICS" | "USERS" | "FINANCE" | "SETTINGS";
export type AttendanceType = "SUBJECT" | "DAILY";
export type AssessmentType = "EXAM" | "ASSIGNMENT" | "QUIZ" | "TEST" | "PRACTICAL" | "ORAL";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubjectCategory = "SCIENTIFIC" | "LITERARY" | "GENERAL" | "SPORT";
export type TransportMode = "BUS" | "WALK" | "CAR" | "MOTO" | "TAXI" | "PARENT" | "OTHER";
export type RelationType = "FATHER" | "MOTHER" | "GUARDIAN" | "UNCLE" | "OTHER" | "GRAND_MOTHER" | "GRAND_FATHER" | "AUNT";
export type UpdateMode = "CREATE" | "CONNECT";
export type ContactPreference = "WHATSAPP" | "EMAIL" | "PHONE";
export type SortOrder = "ASC" | "DESC";
export type StudentSortField = "firstname" | "lastname" | "enrolementYear";
export type SubjectSortField = "coefficient" | "name" | "ponderation";
export type DisciplinaryType = "SUSPENSION" | "EXPULSION" | "WARNING";
export type StudentStatus = "ACTIVE" | "SUSPENDED" | "EXPELLED" | "TRANSFERRED" | "DROPPED_OUT" | "GRADUATED" | "INACTIVE" | "DECEASED";
export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type Gender = "MALE" | "FEMALE";
export type ResourceMode = "TEACHER" | "CLASS";
export type GroupType = "SOLO" | "MULTIPLE";

export class MarkAttendanceInput {
    id: string;
    classId?: Nullable<string>;
    status: AttendanceStatus;
    date: Date;
    userType: SchoolRole;
    isSubjectMode: boolean;
    subjectId?: Nullable<string>;
}

export class MarkEmployeeAttendanceInput {
    schoolUserId: string;
    status: AttendanceStatus;
    date?: Nullable<Date>;
}

export class GetTeacherForAttendanceInput {
    search?: Nullable<string>;
    day?: Nullable<Day>;
    page: number;
    limit: number;
    attendanceDate?: Nullable<Date>;
}

export class GenerateSessionInput {
    targetRole: string;
    durationMinutes?: Nullable<number>;
}

export class Role {
    role?: Nullable<SchoolRole>;
}

export class CreateInvitationInput {
    schoolId: string;
    role?: Nullable<SchoolRole>;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    message: string;
}

export class InvitationCodeInput {
    code: string;
}

export class CreateLessonInput {
    day: Day;
    mode: ResourceMode;
    startTime: DateTime;
    endTime: DateTime;
    subjectId: string;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
}

export class UpdateLessonInput {
    id: string;
    startTime?: Nullable<DateTime>;
    endTime?: Nullable<DateTime>;
    groupId?: Nullable<string>;
    teacherId?: Nullable<string>;
    subjectId?: Nullable<string>;
    day?: Nullable<Day>;
    mode: ResourceMode;
}

export class CreateTeacherAssignmentInput {
    classId: string;
    subjectIds: string[];
    teacherId: string;
}

export class GetLessonsInput {
    groupId?: Nullable<string>;
    teacherId?: Nullable<string>;
    classId?: Nullable<string>;
    department?: Nullable<string>;
    mode: ResourceMode;
    hasLessonOnly?: Nullable<boolean>;
    section?: Nullable<string>;
    status?: Nullable<LessonStatus>;
    level?: Nullable<string>;
    limit: number;
    page: number;
}

export class GetSubjectInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    sort?: Nullable<SubjectSortInput>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
}

export class GetAssignmentInput {
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    limit?: Nullable<number>;
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

export class GetSchoolClassesInput {
    page: number;
    limit: number;
    level?: Nullable<string>;
    section?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
}

export class GetSchoolRoomInput {
    page: number;
    limit: number;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
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

export class UpdateStudentParentData {
    mode?: Nullable<UpdateMode>;
    parentId?: Nullable<string>;
    newParent?: Nullable<CreateParentInput>;
}

export class CreateParentInput {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    isDelegate?: Nullable<boolean>;
    email?: Nullable<string>;
    address: string;
    profession: string;
    children?: Nullable<ParentStudentInput[]>;
}

export class ParentStudentInput {
    id: string;
    relationType: RelationType;
}

export class CreateTeacherInput {
    firstname: string;
    lastname: string;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    diploma?: Nullable<string>;
    specialization: string;
}

export class CreateClassInput {
    section?: Nullable<string>;
    name: string;
    level: string;
    supervisorId?: Nullable<string>;
}

export class GetSchoolParentsInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    studentId?: Nullable<string>;
}

export class StudentSortInput {
    field?: Nullable<StudentSortField>;
    order?: Nullable<SortOrder>;
}

export class SubjectSortInput {
    field?: Nullable<SubjectSortField>;
    order?: Nullable<SortOrder>;
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

export class CreateSubjectInput {
    name: string;
    code: string;
    mainTeacherId?: Nullable<string>;
    category: SubjectCategory;
    classSubject?: Nullable<ClassSubjectInput[]>;
}

export class CreateRoomInput {
    id?: Nullable<string>;
    name: string;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    code?: Nullable<string>;
    defaultClassId?: Nullable<string>;
}

export class CreateGroupInput {
    name: string;
    classIds: string[];
}

export class ClassSubjectInput {
    id?: Nullable<string>;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId: string;
    coefficient: number;
    weeklyHours?: Nullable<number>;
}

export class SchoolSearchInput {
    searchTerm?: Nullable<string>;
}

export class StudentSearchInput {
    schoolId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    getSubject?: Nullable<boolean>;
    limit?: Nullable<number>;
}

export class AttendanceSessionPayload {
    __typename?: 'AttendanceSessionPayload';
    sessionId: string;
    qrCodeDataUrl: string;
    secretCode: string;
    expiresAt: DateTime;
}

export class AttendanceRecord {
    __typename?: 'AttendanceRecord';
    id?: Nullable<string>;
    person?: Nullable<Person>;
    status?: Nullable<AttendanceStatus>;
    date?: Nullable<DateTime>;
    checkInTime?: Nullable<DateTime>;
    recordedBy?: Nullable<User>;
    type?: Nullable<AttendanceType>;
}

export class UserPayload {
    __typename?: 'UserPayload';
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    user?: Nullable<User>;
}

export class PaginationMeta {
    __typename?: 'PaginationMeta';
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class TeacherList {
    __typename?: 'TeacherList';
    data: Teacher[];
    meta: PaginationMeta;
}

export class ApiResponse {
    __typename?: 'ApiResponse';
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    details?: Nullable<Nullable<string>[]>;
}

export class ClassAndSubject {
    __typename?: 'ClassAndSubject';
    classes?: Nullable<Class[]>;
    subjects?: Nullable<Subject[]>;
}

export class LessonsData {
    __typename?: 'LessonsData';
    events?: Nullable<LessonsEvents[]>;
    resources?: Nullable<LessonResources[]>;
}

export class LessonsList {
    __typename?: 'LessonsList';
    data: LessonsData;
    meta?: Nullable<PaginationMeta>;
}

export class LessonResources {
    __typename?: 'LessonResources';
    id: string;
    title: string;
    weeklyHours?: Nullable<number>;
}

export class LessonsEvents {
    __typename?: 'LessonsEvents';
    id: string;
    resourceId?: Nullable<string>;
    title: string;
    startTime: string;
    endTime: string;
    day: Day;
    status?: Nullable<LessonStatus>;
    subject: Subject;
    group?: Nullable<Group>;
    teacher?: Nullable<LessonTeacher>;
    room?: Nullable<Room>;
}

export class LessonTeacher {
    __typename?: 'LessonTeacher';
    id: string;
    firstname: string;
    lastname: string;
    weeklyHours?: Nullable<number>;
}

export class ParentList {
    __typename?: 'ParentList';
    data?: Nullable<Parent[]>;
    meta?: Nullable<PaginationMeta>;
}

export class StudentList {
    __typename?: 'StudentList';
    data?: Nullable<Student[]>;
    meta: PaginationMeta;
}

export class ClassList {
    __typename?: 'ClassList';
    data?: Nullable<Class[]>;
    meta: PaginationMeta;
}

export class SubjectList {
    __typename?: 'SubjectList';
    data: Subject[];
    meta: PaginationMeta;
}

export class SearchClassesAndSubjects {
    __typename?: 'SearchClassesAndSubjects';
    searchClasses?: Nullable<Nullable<Class>[]>;
    searchSubjects?: Nullable<Nullable<Subject>[]>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract confirmCompleteProfile(): Nullable<UserPayload> | Promise<Nullable<UserPayload>>;

    abstract createTeacher(input?: Nullable<CreateTeacherInput>): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract createTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract syncTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteTeacherAssignment(id: string, subjectIds?: Nullable<string[]>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract updateTeacher(teacherId: string, data: CreateTeacherInput): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract deleteTeachers(teacherIds: string[], soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteStudents(studentIds: string[], schoolId: string, soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createListStudent(data: CreateStudentInput, schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract updateStudent(studentId: string, data: CreateStudentInput, schoolId: string): Nullable<Student> | Promise<Nullable<Student>>;

    abstract createClass(data: CreateClassInput): Class | Promise<Class>;

    abstract updateClass(data: CreateClassInput, schoolId: string, classId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteClasses(classIds: string[], schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createSubject(input: CreateSubjectInput): Nullable<Subject> | Promise<Nullable<Subject>>;

    abstract deleteSubjects(subjectIds: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;

    abstract updateClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;

    abstract deleteClassSubjects(ids: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createLesson(input: CreateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract updateLessonStatus(status: LessonStatus, id: string): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract updateLesson(input: UpdateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract deleteLesson(id: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createRoom(input: CreateRoomInput): Room | Promise<Room>;

    abstract updateRoom(input: CreateRoomInput): Room | Promise<Room>;

    abstract createGroup(input: CreateGroupInput): Group | Promise<Group>;

    abstract createParent(input: CreateParentInput): Parent | Promise<Parent>;

    abstract markAttendance(input?: Nullable<MarkAttendanceInput[]>): AttendanceRecord | Promise<AttendanceRecord>;

    abstract generateAttendanceSession(input: GenerateSessionInput): AttendanceSessionPayload | Promise<AttendanceSessionPayload>;

    abstract registerPresence(sessionId: string): AttendanceRecord | Promise<AttendanceRecord>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract searchStudent(filter: StudentSearchInput): Nullable<Student[]> | Promise<Nullable<Student[]>>;

    abstract searchSchool(filter: SchoolSearchInput): Nullable<School[]> | Promise<Nullable<School[]>>;

    abstract getClassSubjects(classId?: Nullable<string>, teacherId?: Nullable<string>, groupId?: Nullable<string>, searchTerm?: Nullable<string>): Nullable<ClassSubject[]> | Promise<Nullable<ClassSubject[]>>;

    abstract getAssignments(filter: GetAssignmentInput): Nullable<TeacherAssignments[]> | Promise<Nullable<TeacherAssignments[]>>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract school(schoolId: string): School | Promise<School>;

    abstract verifyInvitationCode(code: InvitationCodeInput): Nullable<User> | Promise<Nullable<User>>;

    abstract getLessons(filter: GetLessonsInput): Nullable<LessonsList> | Promise<Nullable<LessonsList>>;

    abstract teacher(id: string): Nullable<Teacher> | Promise<Nullable<Teacher>>;

    abstract student(id: string): Nullable<Student> | Promise<Nullable<Student>>;

    abstract class(id: string): Nullable<Class> | Promise<Nullable<Class>>;

    abstract getSchoolTeachers(input: GetSchoolTeachersInput): TeacherList | Promise<TeacherList>;

    abstract getSchoolStudents(input: GetSchoolStudentsInput): StudentList | Promise<StudentList>;

    abstract getSchoolClasses(input: GetSchoolClassesInput): ClassList | Promise<ClassList>;

    abstract getSchoolSubjects(input: GetSubjectInput): Nullable<SubjectList> | Promise<Nullable<SubjectList>>;

    abstract getTeachersForAttendance(filter: GetTeacherForAttendanceInput): Nullable<Nullable<TeacherTodaySubject>[]> | Promise<Nullable<Nullable<TeacherTodaySubject>[]>>;

    abstract getSchoolRooms(filter: GetSchoolRoomInput): RoomList | Promise<RoomList>;

    abstract getSchoolParents(filter: GetSchoolParentsInput): Nullable<ParentList> | Promise<Nullable<ParentList>>;
}

export class TeacherTodaySubject {
    __typename?: 'TeacherTodaySubject';
    teachers?: Nullable<Teacher>;
    classes?: Nullable<ClassLessons>;
}

export class ClassLessons {
    __typename?: 'ClassLessons';
    classSubject?: Nullable<ClassSubject>;
    lesson?: Nullable<Lesson>;
}

export class Student {
    __typename?: 'Student';
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
    __typename?: 'StudentDisciplinaryAction';
    id?: Nullable<string>;
    studentId?: Nullable<string>;
    type?: Nullable<DisciplinaryType>;
    reason?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
}

export class School {
    __typename?: 'School';
    id?: Nullable<string>;
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
    __typename?: 'SchoolSettings';
    id?: Nullable<string>;
    schoolId?: Nullable<string>;
    lessonDuration?: Nullable<number>;
    startHour?: Nullable<number>;
    endHour?: Nullable<number>;
    daysOfWeek?: Nullable<Nullable<Day>[]>;
}

export class Subject {
    __typename?: 'Subject';
    id: string;
    name: string;
    code?: Nullable<string>;
    category?: Nullable<SubjectCategory>;
    totalWeeklyHours?: Nullable<number>;
    mainTeacherId?: Nullable<string>;
    mainTeacher?: Nullable<Teacher>;
    classSubject?: Nullable<Nullable<ClassSubject>[]>;
}

export class Room {
    __typename?: 'Room';
    id: string;
    name: string;
    code?: Nullable<string>;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    class?: Nullable<Nullable<Class>[]>;
    defaultForClass?: Nullable<Class>;
}

export class ClassSubject {
    __typename?: 'ClassSubject';
    id: string;
    coefficient?: Nullable<number>;
    weeklyHours?: Nullable<number>;
    teacherId?: Nullable<string>;
    subjectId?: Nullable<string>;
    groupId: string;
    subject: Subject;
    assignment?: Nullable<TeacherAssignments>;
    group: Group;
    assessments?: Nullable<Assessment[]>;
}

export class Parent {
    __typename?: 'Parent';
    id: string;
    profession?: Nullable<string>;
    isDelegate?: Nullable<boolean>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    schoolUserId?: Nullable<string>;
    user?: Nullable<User>;
}

export class ParentStudent {
    __typename?: 'ParentStudent';
    relationType?: Nullable<RelationType>;
    student?: Nullable<Student>;
    studentId?: Nullable<string>;
    parentId?: Nullable<string>;
    parent?: Nullable<Parent>;
}

export class Assessment {
    __typename?: 'Assessment';
    id: string;
    type?: Nullable<AssessmentType>;
    description?: Nullable<string>;
    status?: Nullable<AssessmentStatus>;
    weight?: Nullable<number>;
    maxScore?: Nullable<number>;
}

export class Lesson {
    __typename?: 'Lesson';
    id: string;
    title?: Nullable<string>;
    startTime?: Nullable<DateTime>;
    endTime?: Nullable<DateTime>;
    day?: Nullable<Day>;
    teacherAssignmentId: string;
    teacherAssignment?: Nullable<TeacherAssignments>;
    status: LessonStatus;
    room?: Nullable<Room>;
}

export class ClassTeacher {
    __typename?: 'ClassTeacher';
    schoolId?: Nullable<string>;
    teacher?: Nullable<Nullable<Teacher>[]>;
    groups?: Nullable<Group[]>;
    classes?: Nullable<Nullable<Class>[]>;
}

export class TeacherAssignments {
    __typename?: 'TeacherAssignments';
    id: string;
    teacher?: Nullable<Teacher>;
    teacherId: string;
    classSubjectId: string;
    classSubjects?: Nullable<ClassSubject>;
    lessons?: Nullable<Lesson[]>;
    schoolId?: Nullable<string>;
}

export class Teacher {
    __typename?: 'Teacher';
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

export class Staff {
    __typename?: 'Staff';
    id: string;
    schoolUserId: string;
    position: string;
    hireDate?: Nullable<DateTime>;
    salary?: Nullable<number>;
    departement?: Nullable<string>;
}

export class TeachingTeamMember {
    __typename?: 'TeachingTeamMember';
    teacher: Teacher;
    assignments: SubjectAssignments[];
}

export class SubjectAssignments {
    __typename?: 'SubjectAssignments';
    id: string;
    subject: Subject;
}

export class Class {
    __typename?: 'Class';
    id: string;
    name: string;
    level: string;
    section?: Nullable<string>;
    students?: Nullable<Student[]>;
    defaultRoom?: Nullable<Room>;
    groupId: string;
    group?: Nullable<Group>;
    teachingTeamMembers?: Nullable<TeachingTeamMember[]>;
    supervisor?: Nullable<Teacher>;
    _count?: Nullable<ClassCount>;
    totalCoefficient?: Nullable<number>;
    totalWeeklyHours?: Nullable<number>;
}

export class Group {
    __typename?: 'Group';
    id: string;
    name: string;
    type?: Nullable<GroupType>;
    classes: Class[];
    classSubjects?: Nullable<Nullable<ClassSubject>[]>;
}

export class ClassCount {
    __typename?: 'ClassCount';
    students?: Nullable<GenderStats>;
    teachers?: Nullable<number>;
    subjects?: Nullable<number>;
}

export class GenderStats {
    __typename?: 'GenderStats';
    male: number;
    female: number;
}

export class MonthlyStats {
    __typename?: 'MonthlyStats';
    month: string;
    count: number;
}

export class ClassStats {
    __typename?: 'ClassStats';
    className: string;
    studentCount: number;
}

export class DailyAttendance {
    __typename?: 'DailyAttendance';
    date: string;
    rate: number;
    present: number;
    absent: number;
    late: number;
}

export class MonthlyRevenue {
    __typename?: 'MonthlyRevenue';
    currentMonth: number;
    previousMonth?: Nullable<number>;
}

export class AttendanceStats {
    __typename?: 'AttendanceStats';
    rate: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    totalExpected: number;
    history?: Nullable<DailyAttendance[]>;
}

export class SchoolStats {
    __typename?: 'SchoolStats';
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    monthlyRevenue?: Nullable<MonthlyRevenue>;
    pendingPaymentsCount?: Nullable<number>;
    attendance?: Nullable<AttendanceStats>;
    studentGender?: Nullable<GenderStats>;
    enrollmentPerMonth?: Nullable<MonthlyStats[]>;
    classesOccupancy?: Nullable<ClassStats[]>;
}

export class RoomList {
    __typename?: 'RoomList';
    data: Nullable<Room>[];
    meta?: Nullable<PaginationMeta>;
}

export class Profile {
    __typename?: 'Profile';
    id: string;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    photo?: Nullable<string>;
    gender?: Nullable<string>;
    address?: Nullable<string>;
}

export class Permission {
    __typename?: 'Permission';
    id?: Nullable<string>;
    code?: Nullable<PermissionCode>;
    module?: Nullable<PermissionModule>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    user?: Nullable<User>;
}

export class SchoolMembership {
    __typename?: 'SchoolMembership';
    id: string;
    role: SchoolRole;
    schoolId?: Nullable<string>;
    school?: Nullable<School>;
    permissions?: Nullable<Nullable<Permission>[]>;
    teacher?: Nullable<Teacher>;
    student?: Nullable<Student>;
    parent?: Nullable<Parent>;
    staff?: Nullable<Staff>;
}

export class User {
    __typename?: 'User';
    id: string;
    email?: Nullable<string>;
    username?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    profileCompleted?: Nullable<boolean>;
    hasMembership?: Nullable<boolean>;
    profile?: Nullable<Profile>;
    isActive?: Nullable<boolean>;
    memberships?: Nullable<Nullable<SchoolMembership>[]>;
    schoolContext?: Nullable<SchoolMembership>;
}

export type DateTime = any;
export type SchoolId = any;
export type Person = Student | Teacher | Staff;
type Nullable<T> = T | null;
