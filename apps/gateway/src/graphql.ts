
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum SchoolRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    STAFF = "STAFF"
}

export enum LessonStatus {
    PLANNED = "PLANNED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED"
}

export enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    EXCUSED = "EXCUSED"
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

export enum PermissionModule {
    ATTENDANCE = "ATTENDANCE",
    ACADEMICS = "ACADEMICS",
    USERS = "USERS",
    FINANCE = "FINANCE",
    SETTINGS = "SETTINGS"
}

export enum AttendanceType {
    SUBJECT = "SUBJECT",
    DAILY = "DAILY"
}

export enum AssessmentType {
    EXAM = "EXAM",
    ASSIGNMENT = "ASSIGNMENT",
    QUIZ = "QUIZ",
    TEST = "TEST",
    PRACTICAL = "PRACTICAL",
    ORAL = "ORAL"
}

export enum AssessmentStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CLOSED = "CLOSED"
}

export enum SubjectCategory {
    SCIENTIFIC = "SCIENTIFIC",
    LITERARY = "LITERARY",
    GENERAL = "GENERAL",
    SPORT = "SPORT"
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

export enum UpdateMode {
    CREATE = "CREATE",
    CONNECT = "CONNECT"
}

export enum ContactPreference {
    WHATSAPP = "WHATSAPP",
    EMAIL = "EMAIL",
    PHONE = "PHONE"
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

export enum SubjectSortField {
    coefficient = "coefficient",
    name = "name",
    ponderation = "ponderation"
}

export enum DisciplinaryType {
    SUSPENSION = "SUSPENSION",
    EXPULSION = "EXPULSION",
    WARNING = "WARNING"
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

export enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum ResourceMode {
    TEACHER = "TEACHER",
    CLASS = "CLASS"
}

export enum GroupType {
    SOLO = "SOLO",
    MULTIPLE = "MULTIPLE"
}

export interface MarkAttendanceInput {
    id: string;
    classId?: Nullable<string>;
    status: AttendanceStatus;
    date: Date;
    userType: SchoolRole;
    isSubjectMode: boolean;
    subjectId?: Nullable<string>;
}

export interface MarkEmployeeAttendanceInput {
    schoolUserId: string;
    status: AttendanceStatus;
    date?: Nullable<Date>;
}

export interface GetTeacherForAttendanceInput {
    search?: Nullable<string>;
    day?: Nullable<Day>;
    page: number;
    limit: number;
    attendanceDate?: Nullable<Date>;
}

export interface GenerateSessionInput {
    targetRole: string;
    durationMinutes?: Nullable<number>;
}

export interface Role {
    role?: Nullable<SchoolRole>;
}

export interface CreateInvitationInput {
    schoolId: string;
    role?: Nullable<SchoolRole>;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    message: string;
}

export interface InvitationCodeInput {
    code: string;
}

export interface CreateLessonInput {
    day: Day;
    mode: ResourceMode;
    startTime: DateTime;
    endTime: DateTime;
    subjectId: string;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
}

export interface UpdateLessonInput {
    id: string;
    startTime?: Nullable<DateTime>;
    endTime?: Nullable<DateTime>;
    groupId?: Nullable<string>;
    teacherId?: Nullable<string>;
    subjectId?: Nullable<string>;
    day?: Nullable<Day>;
    mode: ResourceMode;
}

export interface CreateTeacherAssignmentInput {
    classId: string;
    subjectIds: string[];
    teacherId: string;
}

export interface GetLessonsInput {
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

export interface GetSubjectInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    sort?: Nullable<SubjectSortInput>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
}

export interface GetAssignmentInput {
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    limit?: Nullable<number>;
}

export interface GetSchoolTeachersInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId?: Nullable<string>;
    isActive?: Nullable<boolean>;
    isSupervisor?: Nullable<boolean>;
    day?: Nullable<Day>;
}

export interface GetSchoolClassesInput {
    page: number;
    limit: number;
    level?: Nullable<string>;
    section?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
}

export interface GetSchoolRoomInput {
    page: number;
    limit: number;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
}

export interface CreateStudentInput {
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

export interface UpdateStudentParentData {
    mode?: Nullable<UpdateMode>;
    parentId?: Nullable<string>;
    newParent?: Nullable<CreateParentInput>;
}

export interface CreateParentInput {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    isDelegate?: Nullable<boolean>;
    email?: Nullable<string>;
    address: string;
    profession: string;
    children?: Nullable<ParentStudentInput[]>;
}

export interface ParentStudentInput {
    id: string;
    relationType: RelationType;
}

export interface CreateTeacherInput {
    firstname: string;
    lastname: string;
    email?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    gender: Gender;
    diploma?: Nullable<string>;
    specialization: string;
}

export interface CreateClassInput {
    section?: Nullable<string>;
    name: string;
    level: string;
    supervisorId?: Nullable<string>;
}

export interface GetSchoolParentsInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    studentId?: Nullable<string>;
}

export interface StudentSortInput {
    field?: Nullable<StudentSortField>;
    order?: Nullable<SortOrder>;
}

export interface SubjectSortInput {
    field?: Nullable<SubjectSortField>;
    order?: Nullable<SortOrder>;
}

export interface GetSchoolStudentsInput {
    page: number;
    limit: number;
    teacherId?: Nullable<string>;
    sort?: Nullable<StudentSortInput>;
    classId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    level?: Nullable<string>;
    section?: Nullable<string>;
}

export interface CreateSubjectInput {
    name: string;
    code: string;
    mainTeacherId?: Nullable<string>;
    category: SubjectCategory;
    classSubject?: Nullable<ClassSubjectInput[]>;
}

export interface CreateRoomInput {
    id?: Nullable<string>;
    name: string;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    code?: Nullable<string>;
    defaultClassId?: Nullable<string>;
}

export interface CreateGroupInput {
    name: string;
    classIds: string[];
}

export interface ClassSubjectInput {
    id?: Nullable<string>;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId: string;
    coefficient: number;
    weeklyHours?: Nullable<number>;
}

export interface SchoolSearchInput {
    searchTerm?: Nullable<string>;
}

export interface StudentSearchInput {
    schoolId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    getSubject?: Nullable<boolean>;
    limit?: Nullable<number>;
}

export interface AttendanceSessionPayload {
    sessionId: string;
    qrCodeDataUrl: string;
    secretCode: string;
    expiresAt: DateTime;
}

export interface AttendanceRecord {
    id?: Nullable<string>;
    person?: Nullable<Person>;
    status?: Nullable<AttendanceStatus>;
    date?: Nullable<DateTime>;
    checkInTime?: Nullable<DateTime>;
    recordedBy?: Nullable<User>;
    type?: Nullable<AttendanceType>;
}

export interface UserPayload {
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    user?: Nullable<User>;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TeacherList {
    data: Teacher[];
    meta: PaginationMeta;
}

export interface ApiResponse {
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    details?: Nullable<Nullable<string>[]>;
}

export interface ClassAndSubject {
    classes?: Nullable<Class[]>;
    subjects?: Nullable<Subject[]>;
}

export interface LessonsData {
    events?: Nullable<LessonsEvents[]>;
    resources?: Nullable<LessonResources[]>;
}

export interface LessonsList {
    data: LessonsData;
    meta?: Nullable<PaginationMeta>;
}

export interface LessonResources {
    id: string;
    title: string;
    weeklyHours?: Nullable<number>;
}

export interface LessonsEvents {
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

export interface LessonTeacher {
    id: string;
    firstname: string;
    lastname: string;
    weeklyHours?: Nullable<number>;
}

export interface ParentList {
    data?: Nullable<Parent[]>;
    meta?: Nullable<PaginationMeta>;
}

export interface StudentList {
    data?: Nullable<Student[]>;
    meta: PaginationMeta;
}

export interface ClassList {
    data?: Nullable<Class[]>;
    meta: PaginationMeta;
}

export interface SubjectList {
    data: Subject[];
    meta: PaginationMeta;
}

export interface SearchClassesAndSubjects {
    searchClasses?: Nullable<Nullable<Class>[]>;
    searchSubjects?: Nullable<Nullable<Subject>[]>;
}

export interface IMutation {
    confirmCompleteProfile(): Nullable<UserPayload> | Promise<Nullable<UserPayload>>;
    createTeacher(input?: Nullable<CreateTeacherInput>): Nullable<Teacher> | Promise<Nullable<Teacher>>;
    createTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    syncTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    deleteTeacherAssignment(id: string, subjectIds?: Nullable<string[]>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    updateTeacher(teacherId: string, data: CreateTeacherInput): Nullable<Teacher> | Promise<Nullable<Teacher>>;
    deleteTeachers(teacherIds: string[], soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    deleteStudents(studentIds: string[], schoolId: string, soft?: Nullable<boolean>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    createListStudent(data: CreateStudentInput, schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    updateStudent(studentId: string, data: CreateStudentInput, schoolId: string): Nullable<Student> | Promise<Nullable<Student>>;
    createClass(data: CreateClassInput): Class | Promise<Class>;
    updateClass(data: CreateClassInput, schoolId: string, classId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    deleteClasses(classIds: string[], schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    createSubject(input: CreateSubjectInput): Nullable<Subject> | Promise<Nullable<Subject>>;
    deleteSubjects(subjectIds: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    createClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;
    updateClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;
    deleteClassSubjects(ids: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    createLesson(input: CreateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;
    updateLessonStatus(status: LessonStatus, id: string): Nullable<Lesson> | Promise<Nullable<Lesson>>;
    updateLesson(input: UpdateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;
    deleteLesson(id: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
    createRoom(input: CreateRoomInput): Room | Promise<Room>;
    updateRoom(input: CreateRoomInput): Room | Promise<Room>;
    createGroup(input: CreateGroupInput): Group | Promise<Group>;
    createParent(input: CreateParentInput): Parent | Promise<Parent>;
    markAttendance(input?: Nullable<MarkAttendanceInput[]>): AttendanceRecord | Promise<AttendanceRecord>;
    generateAttendanceSession(input: GenerateSessionInput): AttendanceSessionPayload | Promise<AttendanceSessionPayload>;
    registerPresence(sessionId: string): AttendanceRecord | Promise<AttendanceRecord>;
}

export interface IQuery {
    searchStudent(filter: StudentSearchInput): Nullable<Student[]> | Promise<Nullable<Student[]>>;
    searchSchool(filter: SchoolSearchInput): Nullable<School[]> | Promise<Nullable<School[]>>;
    getClassSubjects(classId?: Nullable<string>, teacherId?: Nullable<string>, groupId?: Nullable<string>, searchTerm?: Nullable<string>): Nullable<ClassSubject[]> | Promise<Nullable<ClassSubject[]>>;
    getAssignments(filter: GetAssignmentInput): Nullable<TeacherAssignments[]> | Promise<Nullable<TeacherAssignments[]>>;
    me(): Nullable<User> | Promise<Nullable<User>>;
    school(schoolId: string): School | Promise<School>;
    verifyInvitationCode(code: InvitationCodeInput): Nullable<User> | Promise<Nullable<User>>;
    getLessons(filter: GetLessonsInput): Nullable<LessonsList> | Promise<Nullable<LessonsList>>;
    teacher(id: string): Nullable<Teacher> | Promise<Nullable<Teacher>>;
    student(id: string): Nullable<Student> | Promise<Nullable<Student>>;
    class(id: string): Nullable<Class> | Promise<Nullable<Class>>;
    getSchoolTeachers(input: GetSchoolTeachersInput): TeacherList | Promise<TeacherList>;
    getSchoolStudents(input: GetSchoolStudentsInput): StudentList | Promise<StudentList>;
    getSchoolClasses(input: GetSchoolClassesInput): ClassList | Promise<ClassList>;
    getSchoolSubjects(input: GetSubjectInput): Nullable<SubjectList> | Promise<Nullable<SubjectList>>;
    getTeachersForAttendance(filter: GetTeacherForAttendanceInput): Nullable<Nullable<TeacherTodaySubject>[]> | Promise<Nullable<Nullable<TeacherTodaySubject>[]>>;
    getSchoolRooms(filter: GetSchoolRoomInput): RoomList | Promise<RoomList>;
    getSchoolParents(filter: GetSchoolParentsInput): Nullable<ParentList> | Promise<Nullable<ParentList>>;
}

export interface TeacherTodaySubject {
    teachers?: Nullable<Teacher>;
    classes?: Nullable<ClassLessons>;
}

export interface ClassLessons {
    classSubject?: Nullable<ClassSubject>;
    lesson?: Nullable<Lesson>;
}

export interface Student {
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

export interface StudentDisciplinaryAction {
    id?: Nullable<string>;
    studentId?: Nullable<string>;
    type?: Nullable<DisciplinaryType>;
    reason?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
}

export interface School {
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

export interface SchoolSettings {
    id?: Nullable<string>;
    schoolId?: Nullable<string>;
    lessonDuration?: Nullable<number>;
    startHour?: Nullable<number>;
    endHour?: Nullable<number>;
    daysOfWeek?: Nullable<Nullable<Day>[]>;
}

export interface Subject {
    id: string;
    name: string;
    code?: Nullable<string>;
    category?: Nullable<SubjectCategory>;
    totalWeeklyHours?: Nullable<number>;
    mainTeacherId?: Nullable<string>;
    mainTeacher?: Nullable<Teacher>;
    classSubject?: Nullable<Nullable<ClassSubject>[]>;
}

export interface Room {
    id: string;
    name: string;
    code?: Nullable<string>;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    class?: Nullable<Nullable<Class>[]>;
    defaultForClass?: Nullable<Class>;
}

export interface ClassSubject {
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

export interface Parent {
    id: string;
    profession?: Nullable<string>;
    isDelegate?: Nullable<boolean>;
    parentStudent?: Nullable<Nullable<ParentStudent>[]>;
    schoolUserId?: Nullable<string>;
    user?: Nullable<User>;
}

export interface ParentStudent {
    relationType?: Nullable<RelationType>;
    student?: Nullable<Student>;
    studentId?: Nullable<string>;
    parentId?: Nullable<string>;
    parent?: Nullable<Parent>;
}

export interface Assessment {
    id: string;
    type?: Nullable<AssessmentType>;
    description?: Nullable<string>;
    status?: Nullable<AssessmentStatus>;
    weight?: Nullable<number>;
    maxScore?: Nullable<number>;
}

export interface Lesson {
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

export interface ClassTeacher {
    schoolId?: Nullable<string>;
    teacher?: Nullable<Nullable<Teacher>[]>;
    groups?: Nullable<Group[]>;
    classes?: Nullable<Nullable<Class>[]>;
}

export interface TeacherAssignments {
    id: string;
    teacher?: Nullable<Teacher>;
    teacherId: string;
    classSubjectId: string;
    classSubjects?: Nullable<ClassSubject>;
    lessons?: Nullable<Lesson[]>;
    schoolId?: Nullable<string>;
}

export interface Teacher {
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

export interface Staff {
    id: string;
    schoolUserId: string;
    position: string;
    hireDate?: Nullable<DateTime>;
    salary?: Nullable<number>;
    departement?: Nullable<string>;
}

export interface TeachingTeamMember {
    teacher: Teacher;
    assignments: SubjectAssignments[];
}

export interface SubjectAssignments {
    id: string;
    subject: Subject;
}

export interface Class {
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

export interface Group {
    id: string;
    name: string;
    type?: Nullable<GroupType>;
    classes: Class[];
    classSubjects?: Nullable<Nullable<ClassSubject>[]>;
}

export interface ClassCount {
    students?: Nullable<GenderStats>;
    teachers?: Nullable<number>;
    subjects?: Nullable<number>;
}

export interface GenderStats {
    male: number;
    female: number;
}

export interface MonthlyStats {
    month: string;
    count: number;
}

export interface ClassStats {
    className: string;
    studentCount: number;
}

export interface DailyAttendance {
    date: string;
    rate: number;
    present: number;
    absent: number;
    late: number;
}

export interface MonthlyRevenue {
    currentMonth: number;
    previousMonth?: Nullable<number>;
}

export interface AttendanceStats {
    rate: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    totalExpected: number;
    history?: Nullable<DailyAttendance[]>;
}

export interface SchoolStats {
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

export interface RoomList {
    data: Nullable<Room>[];
    meta?: Nullable<PaginationMeta>;
}

export interface Profile {
    id: string;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    photo?: Nullable<string>;
    gender?: Nullable<string>;
    address?: Nullable<string>;
}

export interface Permission {
    id?: Nullable<string>;
    code?: Nullable<PermissionCode>;
    module?: Nullable<PermissionModule>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    user?: Nullable<User>;
}

export interface SchoolMembership {
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

export interface Account {
    id: string;
    provider?: Nullable<string>;
    userId?: Nullable<string>;
}

export interface User {
    id: string;
    email?: Nullable<string>;
    username?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    profileCompleted?: Nullable<boolean>;
    hasMembership?: Nullable<boolean>;
    profile?: Nullable<Profile>;
    isActive?: Nullable<boolean>;
    memberships?: Nullable<Nullable<SchoolMembership>[]>;
    accounts?: Nullable<Nullable<Account>[]>;
    schoolContext?: Nullable<SchoolMembership>;
}

export type DateTime = any;
export type SchoolId = any;
export type Person = Student | Teacher | Staff;
type Nullable<T> = T | null;
