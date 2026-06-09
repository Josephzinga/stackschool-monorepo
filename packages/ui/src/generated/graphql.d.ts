import { UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends {
    [key: string]: unknown;
}, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> = T | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
};
export type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    Date: {
        input: Date;
        output: Date;
    };
    DateTime: {
        input: Date;
        output: Date;
    };
    SchoolId: {
        input: string;
        output: string;
    };
};
export type ApiResponse = {
    __typename?: 'ApiResponse';
    details?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
    message?: Maybe<Scalars['String']['output']>;
    ok?: Maybe<Scalars['Boolean']['output']>;
};
export type Assessment = {
    __typename?: 'Assessment';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    maxScore?: Maybe<Scalars['Float']['output']>;
    status?: Maybe<AssessmentStatus>;
    type?: Maybe<AssessmentType>;
    weight?: Maybe<Scalars['Float']['output']>;
};
export declare enum AssessmentStatus {
    Closed = "CLOSED",
    Draft = "DRAFT",
    Published = "PUBLISHED"
}
export declare enum AssessmentType {
    Assignment = "ASSIGNMENT",
    Exam = "EXAM",
    Oral = "ORAL",
    Practical = "PRACTICAL",
    Quiz = "QUIZ",
    Test = "TEST"
}
export type AttendanceRecord = {
    __typename?: 'AttendanceRecord';
    checkInTime?: Maybe<Scalars['DateTime']['output']>;
    date?: Maybe<Scalars['DateTime']['output']>;
    id?: Maybe<Scalars['String']['output']>;
    person?: Maybe<Person>;
    recordedBy?: Maybe<User>;
    status?: Maybe<AttendanceStatus>;
};
export type AttendanceSessionPayload = {
    __typename?: 'AttendanceSessionPayload';
    expiresAt: Scalars['DateTime']['output'];
    qrCodeDataUrl: Scalars['String']['output'];
    secretCode: Scalars['String']['output'];
    sessionId: Scalars['String']['output'];
};
export type AttendanceStats = {
    __typename?: 'AttendanceStats';
    absentCount: Scalars['Int']['output'];
    history?: Maybe<Array<DailyAttendance>>;
    lateCount: Scalars['Int']['output'];
    presentCount: Scalars['Int']['output'];
    rate: Scalars['Float']['output'];
    totalExpected: Scalars['Int']['output'];
};
export declare enum AttendanceStatus {
    Absent = "ABSENT",
    Excused = "EXCUSED",
    Late = "LATE",
    Present = "PRESENT"
}
export type Class = {
    __typename?: 'Class';
    _count?: Maybe<ClassCount>;
    defaultRoom?: Maybe<Room>;
    group?: Maybe<Group>;
    groupId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    level: Scalars['String']['output'];
    name: Scalars['String']['output'];
    section?: Maybe<Scalars['String']['output']>;
    students?: Maybe<Array<Student>>;
    supervisor?: Maybe<Teacher>;
    teachingTeamMembers?: Maybe<Array<TeachingTeamMember>>;
    totalCoefficient?: Maybe<Scalars['Int']['output']>;
    totalWeeklyHours?: Maybe<Scalars['Float']['output']>;
};
export type ClassAndSubject = {
    __typename?: 'ClassAndSubject';
    classes?: Maybe<Array<Class>>;
    subjects?: Maybe<Array<Subject>>;
};
export type ClassCount = {
    __typename?: 'ClassCount';
    students?: Maybe<GenderStats>;
    subjects?: Maybe<Scalars['Int']['output']>;
    teachers?: Maybe<Scalars['Int']['output']>;
};
export type ClassList = {
    __typename?: 'ClassList';
    data?: Maybe<Array<Class>>;
    meta: PaginationMeta;
};
export type ClassStats = {
    __typename?: 'ClassStats';
    className: Scalars['String']['output'];
    studentCount: Scalars['Int']['output'];
};
export type ClassSubject = {
    __typename?: 'ClassSubject';
    assessments?: Maybe<Array<Assessment>>;
    assignment?: Maybe<TeacherAssignments>;
    coefficient?: Maybe<Scalars['Int']['output']>;
    group: Group;
    groupId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    subject: Subject;
    subjectId?: Maybe<Scalars['ID']['output']>;
    teacherId?: Maybe<Scalars['ID']['output']>;
    weeklyHours?: Maybe<Scalars['Float']['output']>;
};
export type ClassSubjectInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    coefficient: Scalars['Int']['input'];
    groupId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    subjectId: Scalars['ID']['input'];
    teacherId?: InputMaybe<Scalars['ID']['input']>;
    weeklyHours?: InputMaybe<Scalars['Float']['input']>;
};
export type ClassTeacher = {
    __typename?: 'ClassTeacher';
    classes?: Maybe<Array<Maybe<Class>>>;
    groups?: Maybe<Array<Group>>;
    schoolId?: Maybe<Scalars['ID']['output']>;
    teacher?: Maybe<Array<Maybe<Teacher>>>;
};
export declare enum ContactPreference {
    Email = "EMAIL",
    Phone = "PHONE",
    Whatsapp = "WHATSAPP"
}
export type CreateClassInput = {
    level: Scalars['String']['input'];
    name: Scalars['String']['input'];
    section?: InputMaybe<Scalars['String']['input']>;
    supervisorId?: InputMaybe<Scalars['String']['input']>;
};
export type CreateGroupInput = {
    classIds: Array<Scalars['ID']['input']>;
    name: Scalars['String']['input'];
};
export type CreateInvitationInput = {
    email?: InputMaybe<Scalars['String']['input']>;
    message: Scalars['String']['input'];
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    role?: InputMaybe<SchoolRole>;
    schoolId: Scalars['ID']['input'];
};
export type CreateLessonInput = {
    day: Day;
    endTime: Scalars['DateTime']['input'];
    groupId?: InputMaybe<Scalars['ID']['input']>;
    mode: ResourceMode;
    startTime: Scalars['DateTime']['input'];
    subjectId: Scalars['ID']['input'];
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export type CreateParentInput = {
    address: Scalars['String']['input'];
    children?: InputMaybe<Array<ParentStudentInput>>;
    email?: InputMaybe<Scalars['String']['input']>;
    firstname: Scalars['String']['input'];
    isDelegate?: InputMaybe<Scalars['Boolean']['input']>;
    lastname: Scalars['String']['input'];
    phoneNumber: Scalars['String']['input'];
    profession: Scalars['String']['input'];
};
export type CreateRoomInput = {
    capacity?: InputMaybe<Scalars['Int']['input']>;
    code?: InputMaybe<Scalars['String']['input']>;
    defaultClassId?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    name: Scalars['String']['input'];
    type?: InputMaybe<Scalars['String']['input']>;
};
export type CreateStudentInput = {
    address?: InputMaybe<Scalars['String']['input']>;
    allergies?: InputMaybe<Scalars['String']['input']>;
    birthCertificateNumber?: InputMaybe<Scalars['String']['input']>;
    birthDate?: InputMaybe<Scalars['DateTime']['input']>;
    birthPlace?: InputMaybe<Scalars['DateTime']['input']>;
    bloodGroup?: InputMaybe<Scalars['String']['input']>;
    classId: Scalars['ID']['input'];
    email?: InputMaybe<Scalars['String']['input']>;
    enrollmentDate?: InputMaybe<Scalars['DateTime']['input']>;
    enrollmentYear?: InputMaybe<Scalars['String']['input']>;
    firstname: Scalars['String']['input'];
    gender: Gender;
    lastname: Scalars['String']['input'];
    matricule: Scalars['String']['input'];
    medicalCondition?: InputMaybe<Scalars['String']['input']>;
    nationality?: InputMaybe<Scalars['String']['input']>;
    parentData?: InputMaybe<UpdateStudentParentData>;
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    previousClass?: InputMaybe<Scalars['String']['input']>;
    previousSchool?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<StudentStatus>;
    studentNumber?: InputMaybe<Scalars['Int']['input']>;
    transportMode?: InputMaybe<TransportMode>;
};
export type CreateSubjectInput = {
    category: SubjectCategory;
    classSubject?: InputMaybe<Array<ClassSubjectInput>>;
    code: Scalars['String']['input'];
    mainTeacherId?: InputMaybe<Scalars['ID']['input']>;
    name: Scalars['String']['input'];
};
export type CreateTeacherAssignmentInput = {
    classId: Scalars['ID']['input'];
    subjectIds: Array<Scalars['ID']['input']>;
    teacherId: Scalars['ID']['input'];
};
export type CreateTeacherInput = {
    diploma?: InputMaybe<Scalars['String']['input']>;
    email?: InputMaybe<Scalars['String']['input']>;
    firstname: Scalars['String']['input'];
    gender: Gender;
    lastname: Scalars['String']['input'];
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    specialization: Scalars['String']['input'];
};
export type DailyAttendance = {
    __typename?: 'DailyAttendance';
    absent: Scalars['Int']['output'];
    date: Scalars['String']['output'];
    late: Scalars['Int']['output'];
    present: Scalars['Int']['output'];
    rate: Scalars['Float']['output'];
};
export declare enum Day {
    Friday = "FRIDAY",
    Monday = "MONDAY",
    Saturday = "SATURDAY",
    Sunday = "SUNDAY",
    Thursday = "THURSDAY",
    Tuesday = "TUESDAY",
    Wednesday = "WEDNESDAY"
}
export declare enum DisciplinaryType {
    Expulsion = "EXPULSION",
    Suspension = "SUSPENSION",
    Warning = "WARNING"
}
export declare enum Gender {
    Female = "FEMALE",
    Male = "MALE"
}
export type GenderStats = {
    __typename?: 'GenderStats';
    female: Scalars['Int']['output'];
    male: Scalars['Int']['output'];
};
export type GenerateSessionInput = {
    durationMinutes?: InputMaybe<Scalars['Int']['input']>;
    targetRole: Scalars['String']['input'];
};
export type GetAssignmentInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    groupId?: InputMaybe<Scalars['ID']['input']>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export type GetLessonsInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    department?: InputMaybe<Scalars['String']['input']>;
    groupId?: InputMaybe<Scalars['ID']['input']>;
    hasLessonOnly?: InputMaybe<Scalars['Boolean']['input']>;
    level?: InputMaybe<Scalars['String']['input']>;
    limit?: Scalars['Int']['input'];
    mode: ResourceMode;
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    section?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<LessonStatus>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export type GetSchoolClassesInput = {
    level?: InputMaybe<Scalars['String']['input']>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    section?: InputMaybe<Scalars['String']['input']>;
    teacherId?: InputMaybe<Scalars['String']['input']>;
};
export type GetSchoolParentsInput = {
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    studentId?: InputMaybe<Scalars['String']['input']>;
};
export type GetSchoolRoomInput = {
    classId?: InputMaybe<Scalars['String']['input']>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    teacherId?: InputMaybe<Scalars['String']['input']>;
};
export type GetSchoolStudentsInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    level?: InputMaybe<Scalars['String']['input']>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    section?: InputMaybe<Scalars['String']['input']>;
    sort?: InputMaybe<StudentSortInput>;
    teacherId?: InputMaybe<Scalars['String']['input']>;
};
export type GetSchoolTeachersInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    day?: InputMaybe<Day>;
    isActive?: InputMaybe<Scalars['Boolean']['input']>;
    isSupervisor?: InputMaybe<Scalars['Boolean']['input']>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    subjectId?: InputMaybe<Scalars['ID']['input']>;
};
export type GetSubjectInput = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    sort?: InputMaybe<SubjectSortInput>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export type GetTeacherForAttendanceInput = {
    attendanceDate?: InputMaybe<Scalars['Date']['input']>;
    day?: InputMaybe<Day>;
    limit?: Scalars['Int']['input'];
    page?: Scalars['Int']['input'];
    search?: InputMaybe<Scalars['String']['input']>;
};
export type Group = {
    __typename?: 'Group';
    classSubjects?: Maybe<Array<Maybe<ClassSubject>>>;
    classes: Array<Class>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    type?: Maybe<GroupType>;
};
export declare enum GroupType {
    Multiple = "MULTIPLE",
    Solo = "SOLO"
}
export type InvitationCodeInput = {
    code: Scalars['String']['input'];
};
export type Lesson = {
    __typename?: 'Lesson';
    day?: Maybe<Day>;
    endTime?: Maybe<Scalars['DateTime']['output']>;
    id: Scalars['ID']['output'];
    room?: Maybe<Room>;
    startTime?: Maybe<Scalars['DateTime']['output']>;
    status: LessonStatus;
    teacherAssignment?: Maybe<TeacherAssignments>;
    teacherAssignmentId: Scalars['ID']['output'];
    title?: Maybe<Scalars['String']['output']>;
};
export type LessonResources = {
    __typename?: 'LessonResources';
    id: Scalars['ID']['output'];
    title: Scalars['String']['output'];
    weeklyHours?: Maybe<Scalars['Int']['output']>;
};
export declare enum LessonStatus {
    Cancelled = "CANCELLED",
    Completed = "COMPLETED",
    Ongoing = "ONGOING",
    Planned = "PLANNED",
    Postponed = "POSTPONED"
}
export type LessonTeacher = {
    __typename?: 'LessonTeacher';
    firstname: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastname: Scalars['String']['output'];
    weeklyHours?: Maybe<Scalars['Float']['output']>;
};
export type LessonsData = {
    __typename?: 'LessonsData';
    events?: Maybe<Array<LessonsEvents>>;
    resources?: Maybe<Array<LessonResources>>;
};
export type LessonsEvents = {
    __typename?: 'LessonsEvents';
    day: Day;
    endTime: Scalars['String']['output'];
    group?: Maybe<Group>;
    id: Scalars['ID']['output'];
    resourceId?: Maybe<Scalars['ID']['output']>;
    room?: Maybe<Room>;
    startTime: Scalars['String']['output'];
    status?: Maybe<LessonStatus>;
    subject: Subject;
    teacher?: Maybe<LessonTeacher>;
    title: Scalars['String']['output'];
};
export type LessonsList = {
    __typename?: 'LessonsList';
    data: LessonsData;
    meta?: Maybe<PaginationMeta>;
};
export type MarkEmployeeAttendanceInput = {
    date?: InputMaybe<Scalars['Date']['input']>;
    schoolUserId: Scalars['String']['input'];
    status: AttendanceStatus;
};
export type MarkStudentAttendanceInput = {
    date?: InputMaybe<Scalars['Date']['input']>;
    status: AttendanceStatus;
    studentId: Scalars['String']['input'];
};
export type MonthlyRevenue = {
    __typename?: 'MonthlyRevenue';
    currentMonth: Scalars['Float']['output'];
    previousMonth?: Maybe<Scalars['Float']['output']>;
};
export type MonthlyStats = {
    __typename?: 'MonthlyStats';
    count: Scalars['Int']['output'];
    month: Scalars['String']['output'];
};
export type Mutation = {
    __typename?: 'Mutation';
    confirmCompleteProfile?: Maybe<UserPayload>;
    createClass: Class;
    createClassSubject: ClassSubject;
    createGroup: Group;
    createLesson?: Maybe<Lesson>;
    createListStudent?: Maybe<ApiResponse>;
    createParent: Parent;
    createRoom: Room;
    createSubject?: Maybe<Subject>;
    createTeacher?: Maybe<Teacher>;
    createTeacherAssignment?: Maybe<ApiResponse>;
    deleteClassSubjects?: Maybe<ApiResponse>;
    deleteClasses?: Maybe<ApiResponse>;
    deleteLesson?: Maybe<ApiResponse>;
    deleteStudents?: Maybe<ApiResponse>;
    deleteSubjects?: Maybe<ApiResponse>;
    deleteTeacherAssignment?: Maybe<ApiResponse>;
    deleteTeachers?: Maybe<ApiResponse>;
    generateAttendanceSession: AttendanceSessionPayload;
    markEmployeeAttendance: AttendanceRecord;
    markStudentAttendance: AttendanceRecord;
    registerPresence: AttendanceRecord;
    syncTeacherAssignment?: Maybe<ApiResponse>;
    updateClass?: Maybe<ApiResponse>;
    updateClassSubject: ClassSubject;
    updateLesson?: Maybe<Lesson>;
    updateLessonStatus?: Maybe<Lesson>;
    updateRoom: Room;
    updateStudent?: Maybe<Student>;
    updateTeacher?: Maybe<Teacher>;
};
export type MutationCreateClassArgs = {
    data: CreateClassInput;
};
export type MutationCreateClassSubjectArgs = {
    input: ClassSubjectInput;
};
export type MutationCreateGroupArgs = {
    input: CreateGroupInput;
};
export type MutationCreateLessonArgs = {
    input: CreateLessonInput;
};
export type MutationCreateListStudentArgs = {
    data: CreateStudentInput;
    schoolId: Scalars['ID']['input'];
};
export type MutationCreateParentArgs = {
    input: CreateParentInput;
};
export type MutationCreateRoomArgs = {
    input: CreateRoomInput;
};
export type MutationCreateSubjectArgs = {
    input: CreateSubjectInput;
};
export type MutationCreateTeacherArgs = {
    input?: InputMaybe<CreateTeacherInput>;
};
export type MutationCreateTeacherAssignmentArgs = {
    input: CreateTeacherAssignmentInput;
};
export type MutationDeleteClassSubjectsArgs = {
    ids: Array<Scalars['ID']['input']>;
};
export type MutationDeleteClassesArgs = {
    classIds: Array<Scalars['ID']['input']>;
    schoolId: Scalars['ID']['input'];
};
export type MutationDeleteLessonArgs = {
    id: Scalars['ID']['input'];
};
export type MutationDeleteStudentsArgs = {
    schoolId: Scalars['ID']['input'];
    soft?: InputMaybe<Scalars['Boolean']['input']>;
    studentIds: Array<Scalars['ID']['input']>;
};
export type MutationDeleteSubjectsArgs = {
    subjectIds: Array<Scalars['ID']['input']>;
};
export type MutationDeleteTeacherAssignmentArgs = {
    id: Scalars['ID']['input'];
    subjectIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};
export type MutationDeleteTeachersArgs = {
    soft?: InputMaybe<Scalars['Boolean']['input']>;
    teacherIds: Array<Scalars['ID']['input']>;
};
export type MutationGenerateAttendanceSessionArgs = {
    input: GenerateSessionInput;
};
export type MutationMarkEmployeeAttendanceArgs = {
    input: MarkEmployeeAttendanceInput;
};
export type MutationMarkStudentAttendanceArgs = {
    input: MarkStudentAttendanceInput;
};
export type MutationRegisterPresenceArgs = {
    sessionId: Scalars['String']['input'];
};
export type MutationSyncTeacherAssignmentArgs = {
    input: CreateTeacherAssignmentInput;
};
export type MutationUpdateClassArgs = {
    classId: Scalars['ID']['input'];
    data: CreateClassInput;
    schoolId: Scalars['ID']['input'];
};
export type MutationUpdateClassSubjectArgs = {
    input: ClassSubjectInput;
};
export type MutationUpdateLessonArgs = {
    input: UpdateLessonInput;
};
export type MutationUpdateLessonStatusArgs = {
    id: Scalars['ID']['input'];
    status: LessonStatus;
};
export type MutationUpdateRoomArgs = {
    input: CreateRoomInput;
};
export type MutationUpdateStudentArgs = {
    data: CreateStudentInput;
    schoolId: Scalars['ID']['input'];
    studentId: Scalars['ID']['input'];
};
export type MutationUpdateTeacherArgs = {
    data: CreateTeacherInput;
    teacherId: Scalars['ID']['input'];
};
export type PaginationMeta = {
    __typename?: 'PaginationMeta';
    limit: Scalars['Int']['output'];
    page: Scalars['Int']['output'];
    total: Scalars['Int']['output'];
    totalPages: Scalars['Int']['output'];
};
export type Parent = {
    __typename?: 'Parent';
    id: Scalars['ID']['output'];
    isDelegate?: Maybe<Scalars['Boolean']['output']>;
    parentStudent?: Maybe<Array<Maybe<ParentStudent>>>;
    profession?: Maybe<Scalars['String']['output']>;
    schoolUserId?: Maybe<Scalars['ID']['output']>;
    user?: Maybe<User>;
};
export type ParentList = {
    __typename?: 'ParentList';
    data?: Maybe<Array<Parent>>;
    meta?: Maybe<PaginationMeta>;
};
export type ParentStudent = {
    __typename?: 'ParentStudent';
    parent?: Maybe<Parent>;
    parentId?: Maybe<Scalars['ID']['output']>;
    relationType?: Maybe<RelationType>;
    student?: Maybe<Student>;
    studentId?: Maybe<Scalars['ID']['output']>;
};
export type ParentStudentInput = {
    id: Scalars['ID']['input'];
    relationType: RelationType;
};
export type Person = Staff | Student | Teacher;
export type Profile = {
    __typename?: 'Profile';
    address?: Maybe<Scalars['String']['output']>;
    firstname?: Maybe<Scalars['String']['output']>;
    gender?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    lastname?: Maybe<Scalars['String']['output']>;
    photo?: Maybe<Scalars['String']['output']>;
};
export type Query = {
    __typename?: 'Query';
    class?: Maybe<Class>;
    getAssignments?: Maybe<Array<TeacherAssignments>>;
    getClassSubjects?: Maybe<Array<ClassSubject>>;
    getLessons?: Maybe<LessonsList>;
    getSchoolClasses: ClassList;
    getSchoolParents?: Maybe<ParentList>;
    getSchoolRooms: RoomList;
    getSchoolStudents: StudentList;
    getSchoolSubjects?: Maybe<SubjectList>;
    getSchoolTeachers: TeacherList;
    getTeachersForAttendance?: Maybe<TeacherList>;
    me?: Maybe<User>;
    school: School;
    searchSchool?: Maybe<Array<School>>;
    searchStudent?: Maybe<Array<Student>>;
    student?: Maybe<Student>;
    teacher?: Maybe<Teacher>;
    verifyInvitationCode?: Maybe<User>;
};
export type QueryClassArgs = {
    id: Scalars['ID']['input'];
};
export type QueryGetAssignmentsArgs = {
    filter: GetAssignmentInput;
};
export type QueryGetClassSubjectsArgs = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    groupId?: InputMaybe<Scalars['ID']['input']>;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryGetLessonsArgs = {
    filter: GetLessonsInput;
};
export type QueryGetSchoolClassesArgs = {
    input: GetSchoolClassesInput;
};
export type QueryGetSchoolParentsArgs = {
    filter: GetSchoolParentsInput;
};
export type QueryGetSchoolRoomsArgs = {
    filter: GetSchoolRoomInput;
};
export type QueryGetSchoolStudentsArgs = {
    input: GetSchoolStudentsInput;
};
export type QueryGetSchoolSubjectsArgs = {
    input: GetSubjectInput;
};
export type QueryGetSchoolTeachersArgs = {
    input: GetSchoolTeachersInput;
};
export type QueryGetTeachersForAttendanceArgs = {
    filter: GetTeacherForAttendanceInput;
};
export type QuerySchoolArgs = {
    schoolId: Scalars['ID']['input'];
};
export type QuerySearchSchoolArgs = {
    filter: SchoolSearchInput;
};
export type QuerySearchStudentArgs = {
    filter: StudentSearchInput;
};
export type QueryStudentArgs = {
    id: Scalars['ID']['input'];
};
export type QueryTeacherArgs = {
    id: Scalars['ID']['input'];
};
export type QueryVerifyInvitationCodeArgs = {
    code: InvitationCodeInput;
};
export declare enum RelationType {
    Aunt = "AUNT",
    Father = "FATHER",
    GrandFather = "GRAND_FATHER",
    GrandMother = "GRAND_MOTHER",
    Guardian = "GUARDIAN",
    Mother = "MOTHER",
    Other = "OTHER",
    Uncle = "UNCLE"
}
export declare enum ResourceMode {
    Class = "CLASS",
    Teacher = "TEACHER"
}
export type Role = {
    role?: InputMaybe<SchoolRole>;
};
export type Room = {
    __typename?: 'Room';
    capacity?: Maybe<Scalars['Int']['output']>;
    class?: Maybe<Array<Maybe<Class>>>;
    code?: Maybe<Scalars['String']['output']>;
    defaultForClass?: Maybe<Class>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    type?: Maybe<Scalars['String']['output']>;
};
export type RoomList = {
    __typename?: 'RoomList';
    data: Array<Maybe<Room>>;
    meta?: Maybe<PaginationMeta>;
};
export type School = {
    __typename?: 'School';
    address: Scalars['String']['output'];
    code?: Maybe<Scalars['String']['output']>;
    id?: Maybe<Scalars['ID']['output']>;
    lessons?: Maybe<Array<Maybe<Lesson>>>;
    logo?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    settings?: Maybe<SchoolSettings>;
    slug?: Maybe<Scalars['String']['output']>;
    stats?: Maybe<SchoolStats>;
    teachers?: Maybe<Array<Maybe<Teacher>>>;
};
export type SchoolMembership = {
    __typename?: 'SchoolMembership';
    id: Scalars['ID']['output'];
    parent?: Maybe<Parent>;
    role: Scalars['String']['output'];
    school: School;
    staff?: Maybe<Staff>;
    student?: Maybe<Student>;
    teacher?: Maybe<Teacher>;
};
export declare enum SchoolRole {
    Admin = "ADMIN",
    Parent = "PARENT",
    Staff = "STAFF",
    Student = "STUDENT",
    Teacher = "TEACHER"
}
export type SchoolSearchInput = {
    searchTerm?: InputMaybe<Scalars['String']['input']>;
};
export type SchoolSettings = {
    __typename?: 'SchoolSettings';
    daysOfWeek?: Maybe<Array<Maybe<Day>>>;
    endHour?: Maybe<Scalars['Int']['output']>;
    id?: Maybe<Scalars['ID']['output']>;
    lessonDuration?: Maybe<Scalars['Int']['output']>;
    schoolId?: Maybe<Scalars['ID']['output']>;
    startHour?: Maybe<Scalars['Int']['output']>;
};
export type SchoolStats = {
    __typename?: 'SchoolStats';
    attendance?: Maybe<AttendanceStats>;
    classesOccupancy?: Maybe<Array<ClassStats>>;
    enrollmentPerMonth?: Maybe<Array<MonthlyStats>>;
    monthlyRevenue?: Maybe<MonthlyRevenue>;
    pendingPaymentsCount?: Maybe<Scalars['Int']['output']>;
    studentGender?: Maybe<GenderStats>;
    totalClasses: Scalars['Int']['output'];
    totalStudents: Scalars['Int']['output'];
    totalTeachers: Scalars['Int']['output'];
};
export type SearchClassesAndSubjects = {
    __typename?: 'SearchClassesAndSubjects';
    searchClasses?: Maybe<Array<Maybe<Class>>>;
    searchSubjects?: Maybe<Array<Maybe<Subject>>>;
};
export type SearchClassesAndSubjectsSearchClassesArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    search?: InputMaybe<Scalars['String']['input']>;
};
export type SearchClassesAndSubjectsSearchSubjectsArgs = {
    classId?: InputMaybe<Scalars['ID']['input']>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    search?: InputMaybe<Scalars['String']['input']>;
};
export declare enum SortOrder {
    Asc = "ASC",
    Desc = "DESC"
}
export type Staff = {
    __typename?: 'Staff';
    departement?: Maybe<Scalars['String']['output']>;
    hireDate?: Maybe<Scalars['DateTime']['output']>;
    id: Scalars['ID']['output'];
    position: Scalars['String']['output'];
    salary?: Maybe<Scalars['Float']['output']>;
    schoolUserId: Scalars['String']['output'];
};
export type Student = {
    __typename?: 'Student';
    allergies?: Maybe<Scalars['String']['output']>;
    attendances?: Maybe<Array<AttendanceRecord>>;
    birthCertificateNumber?: Maybe<Scalars['String']['output']>;
    birthDate?: Maybe<Scalars['DateTime']['output']>;
    birthPlace?: Maybe<Scalars['DateTime']['output']>;
    bloodGroup?: Maybe<Scalars['String']['output']>;
    classId?: Maybe<Scalars['ID']['output']>;
    disciplinaryActions?: Maybe<StudentDisciplinaryAction>;
    enrollmentDate?: Maybe<Scalars['DateTime']['output']>;
    enrollmentYear: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    matricule: Scalars['String']['output'];
    medicalCondition?: Maybe<Scalars['String']['output']>;
    nationality?: Maybe<Scalars['String']['output']>;
    parentStudent?: Maybe<Array<Maybe<ParentStudent>>>;
    previousClass?: Maybe<Scalars['String']['output']>;
    previousSchool?: Maybe<Scalars['String']['output']>;
    profile?: Maybe<Profile>;
    profileId?: Maybe<Scalars['ID']['output']>;
    schoolClass?: Maybe<Class>;
    schoolUserId?: Maybe<Scalars['ID']['output']>;
    status?: Maybe<StudentStatus>;
    studentNumber?: Maybe<Scalars['Int']['output']>;
    transportMode?: Maybe<TransportMode>;
    user?: Maybe<User>;
};
export type StudentAttendancesArgs = {
    date?: InputMaybe<Scalars['Date']['input']>;
};
export type StudentDisciplinaryAction = {
    __typename?: 'StudentDisciplinaryAction';
    endDate?: Maybe<Scalars['DateTime']['output']>;
    id?: Maybe<Scalars['String']['output']>;
    reason?: Maybe<Scalars['String']['output']>;
    startDate?: Maybe<Scalars['DateTime']['output']>;
    studentId?: Maybe<Scalars['ID']['output']>;
    type?: Maybe<DisciplinaryType>;
};
export type StudentList = {
    __typename?: 'StudentList';
    data?: Maybe<Array<Student>>;
    meta: PaginationMeta;
};
export type StudentSearchInput = {
    getSubject?: InputMaybe<Scalars['Boolean']['input']>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    schoolId?: InputMaybe<Scalars['ID']['input']>;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
};
export declare enum StudentSortField {
    EnrolementYear = "enrolementYear",
    Firstname = "firstname",
    Lastname = "lastname"
}
export type StudentSortInput = {
    field?: InputMaybe<StudentSortField>;
    order?: InputMaybe<SortOrder>;
};
export declare enum StudentStatus {
    Active = "ACTIVE",
    Deceased = "DECEASED",
    DroppedOut = "DROPPED_OUT",
    Expelled = "EXPELLED",
    Graduated = "GRADUATED",
    Inactive = "INACTIVE",
    Suspended = "SUSPENDED",
    Transferred = "TRANSFERRED"
}
export type Subject = {
    __typename?: 'Subject';
    category?: Maybe<SubjectCategory>;
    classSubject?: Maybe<Array<Maybe<ClassSubject>>>;
    code?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    mainTeacher?: Maybe<Teacher>;
    mainTeacherId?: Maybe<Scalars['ID']['output']>;
    name: Scalars['String']['output'];
    totalWeeklyHours?: Maybe<Scalars['Float']['output']>;
};
export type SubjectAssignments = {
    __typename?: 'SubjectAssignments';
    id: Scalars['ID']['output'];
    subject: Subject;
};
export declare enum SubjectCategory {
    General = "GENERAL",
    Literary = "LITERARY",
    Scientific = "SCIENTIFIC",
    Sport = "SPORT"
}
export type SubjectList = {
    __typename?: 'SubjectList';
    data: Array<Subject>;
    meta: PaginationMeta;
};
export declare enum SubjectSortField {
    Coefficient = "coefficient",
    Name = "name",
    Ponderation = "ponderation"
}
export type SubjectSortInput = {
    field?: InputMaybe<SubjectSortField>;
    order?: InputMaybe<SortOrder>;
};
export type Teacher = {
    __typename?: 'Teacher';
    assignments?: Maybe<Array<Maybe<TeacherAssignments>>>;
    attendances?: Maybe<Array<AttendanceRecord>>;
    bio?: Maybe<Scalars['String']['output']>;
    createdAt?: Maybe<Scalars['DateTime']['output']>;
    department?: Maybe<Scalars['String']['output']>;
    diploma?: Maybe<Scalars['String']['output']>;
    experience?: Maybe<Scalars['String']['output']>;
    hireDate?: Maybe<Scalars['DateTime']['output']>;
    id: Scalars['ID']['output'];
    isActive?: Maybe<Scalars['Boolean']['output']>;
    salary?: Maybe<Scalars['Float']['output']>;
    schoolUserId?: Maybe<Scalars['ID']['output']>;
    specialization?: Maybe<Scalars['String']['output']>;
    supervisedClasses?: Maybe<Array<Maybe<Class>>>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    user?: Maybe<User>;
    weeklyHours?: Maybe<Scalars['Float']['output']>;
};
export type TeacherAttendancesArgs = {
    date?: InputMaybe<Scalars['Date']['input']>;
};
export type TeacherAssignments = {
    __typename?: 'TeacherAssignments';
    classSubjectId: Scalars['ID']['output'];
    classSubjects?: Maybe<ClassSubject>;
    id: Scalars['ID']['output'];
    lessons?: Maybe<Array<Lesson>>;
    schoolId?: Maybe<Scalars['ID']['output']>;
    teacher?: Maybe<Teacher>;
    teacherId: Scalars['ID']['output'];
};
export type TeacherList = {
    __typename?: 'TeacherList';
    data: Array<Teacher>;
    meta: PaginationMeta;
};
export type TeachingTeamMember = {
    __typename?: 'TeachingTeamMember';
    assignments: Array<SubjectAssignments>;
    teacher: Teacher;
};
export declare enum TransportMode {
    Bus = "BUS",
    Car = "CAR",
    Moto = "MOTO",
    Other = "OTHER",
    Parent = "PARENT",
    Taxi = "TAXI",
    Walk = "WALK"
}
export type UpdateLessonInput = {
    day?: InputMaybe<Day>;
    endTime?: InputMaybe<Scalars['DateTime']['input']>;
    groupId?: InputMaybe<Scalars['ID']['input']>;
    id: Scalars['ID']['input'];
    mode: ResourceMode;
    startTime?: InputMaybe<Scalars['DateTime']['input']>;
    subjectId?: InputMaybe<Scalars['ID']['input']>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
};
export declare enum UpdateMode {
    Connect = "CONNECT",
    Create = "CREATE"
}
export type UpdateStudentParentData = {
    mode?: InputMaybe<UpdateMode>;
    newParent?: InputMaybe<CreateParentInput>;
    parentId?: InputMaybe<Scalars['ID']['input']>;
};
export type User = {
    __typename?: 'User';
    email?: Maybe<Scalars['String']['output']>;
    hasMembership?: Maybe<Scalars['Boolean']['output']>;
    id: Scalars['ID']['output'];
    isActive?: Maybe<Scalars['Boolean']['output']>;
    memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
    phoneNumber?: Maybe<Scalars['String']['output']>;
    profile?: Maybe<Profile>;
    profileCompleted?: Maybe<Scalars['Boolean']['output']>;
    schoolContext?: Maybe<SchoolMembership>;
    username?: Maybe<Scalars['String']['output']>;
};
export type UserSchoolContextArgs = {
    schoolId?: InputMaybe<Scalars['SchoolId']['input']>;
};
export type UserPayload = {
    __typename?: 'UserPayload';
    message?: Maybe<Scalars['String']['output']>;
    ok?: Maybe<Scalars['Boolean']['output']>;
    user?: Maybe<User>;
};
export type GetAdminDashboardStatsQueryVariables = Exact<{
    schoolId: Scalars['ID']['input'];
}>;
export type GetAdminDashboardStatsQuery = {
    __typename?: 'Query';
    school: {
        __typename?: 'School';
        id?: string | null;
        name: string;
        logo?: string | null;
        stats?: {
            __typename?: 'SchoolStats';
            totalStudents: number;
            totalTeachers: number;
            totalClasses: number;
            pendingPaymentsCount?: number | null;
            monthlyRevenue?: {
                __typename?: 'MonthlyRevenue';
                previousMonth?: number | null;
                currentMonth: number;
            } | null;
            attendance?: {
                __typename?: 'AttendanceStats';
                rate: number;
                presentCount: number;
                absentCount: number;
                totalExpected: number;
                lateCount: number;
                history?: Array<{
                    __typename?: 'DailyAttendance';
                    date: string;
                    rate: number;
                    present: number;
                    absent: number;
                    late: number;
                }> | null;
            } | null;
            studentGender?: {
                __typename?: 'GenderStats';
                male: number;
                female: number;
            } | null;
            classesOccupancy?: Array<{
                __typename?: 'ClassStats';
                className: string;
                studentCount: number;
            }> | null;
            enrollmentPerMonth?: Array<{
                __typename?: 'MonthlyStats';
                month: string;
                count: number;
            }> | null;
        } | null;
    };
};
export type GetSchoolSettingsQueryVariables = Exact<{
    schoolId: Scalars['ID']['input'];
}>;
export type GetSchoolSettingsQuery = {
    __typename?: 'Query';
    school: {
        __typename?: 'School';
        settings?: {
            __typename?: 'SchoolSettings';
            id?: string | null;
            startHour?: number | null;
            endHour?: number | null;
            daysOfWeek?: Array<Day | null> | null;
            lessonDuration?: number | null;
        } | null;
    };
};
export type MarkStudentAttendanceMutationVariables = Exact<{
    input: MarkStudentAttendanceInput;
}>;
export type MarkStudentAttendanceMutation = {
    __typename?: 'Mutation';
    markStudentAttendance: {
        __typename?: 'AttendanceRecord';
        id?: string | null;
        date?: Date | null;
        checkInTime?: Date | null;
        recordedBy?: {
            __typename?: 'User';
            id: string;
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
            } | null;
        } | null;
        person?: {
            __typename?: 'Staff';
        } | {
            __typename?: 'Student';
            id: string;
            schoolClass?: {
                __typename?: 'Class';
                name: string;
            } | null;
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
            } | null;
        } | {
            __typename?: 'Teacher';
        } | null;
    };
};
export type GetSchoolClassesQueryVariables = Exact<{
    input: GetSchoolClassesInput;
}>;
export type GetSchoolClassesQuery = {
    __typename?: 'Query';
    getSchoolClasses: {
        __typename?: 'ClassList';
        meta: {
            __typename?: 'PaginationMeta';
            limit: number;
            totalPages: number;
            total: number;
        };
        data?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            section?: string | null;
            level: string;
            supervisor?: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    id: string;
                    profile?: {
                        __typename?: 'Profile';
                        id: string;
                        lastname?: string | null;
                        firstname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
            group?: {
                __typename?: 'Group';
                classSubjects?: Array<{
                    __typename?: 'ClassSubject';
                    subject: {
                        __typename?: 'Subject';
                        id: string;
                        name: string;
                        code?: string | null;
                    };
                    assignment?: {
                        __typename?: 'TeacherAssignments';
                        teacher?: {
                            __typename?: 'Teacher';
                            id: string;
                            user?: {
                                __typename?: 'User';
                                profile?: {
                                    __typename?: 'Profile';
                                    lastname?: string | null;
                                    firstname?: string | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null> | null;
            } | null;
            _count?: {
                __typename?: 'ClassCount';
                teachers?: number | null;
                subjects?: number | null;
                students?: {
                    __typename?: 'GenderStats';
                    male: number;
                    female: number;
                } | null;
            } | null;
        }> | null;
    };
};
export type ClassListFragmentFragment = {
    __typename?: 'Class';
    id: string;
    name: string;
    section?: string | null;
    level: string;
    supervisor?: {
        __typename?: 'Teacher';
        id: string;
        user?: {
            __typename?: 'User';
            id: string;
            profile?: {
                __typename?: 'Profile';
                id: string;
                lastname?: string | null;
                firstname?: string | null;
                photo?: string | null;
            } | null;
        } | null;
    } | null;
    group?: {
        __typename?: 'Group';
        classSubjects?: Array<{
            __typename?: 'ClassSubject';
            subject: {
                __typename?: 'Subject';
                id: string;
                name: string;
                code?: string | null;
            };
            assignment?: {
                __typename?: 'TeacherAssignments';
                teacher?: {
                    __typename?: 'Teacher';
                    id: string;
                    user?: {
                        __typename?: 'User';
                        profile?: {
                            __typename?: 'Profile';
                            lastname?: string | null;
                            firstname?: string | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    _count?: {
        __typename?: 'ClassCount';
        teachers?: number | null;
        subjects?: number | null;
        students?: {
            __typename?: 'GenderStats';
            male: number;
            female: number;
        } | null;
    } | null;
};
export type GetClassDetailsQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
export type GetClassDetailsQuery = {
    __typename?: 'Query';
    class?: {
        __typename?: 'Class';
        id: string;
        name: string;
        level: string;
        section?: string | null;
        totalCoefficient?: number | null;
        totalWeeklyHours?: number | null;
        group?: {
            __typename?: 'Group';
            id: string;
            type?: GroupType | null;
        } | null;
        supervisor?: {
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                email?: string | null;
                phoneNumber?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
        _count?: {
            __typename?: 'ClassCount';
            subjects?: number | null;
            teachers?: number | null;
            students?: {
                __typename?: 'GenderStats';
                male: number;
                female: number;
            } | null;
        } | null;
    } | null;
};
export type GetClassStudentsQueryVariables = Exact<{
    input: GetSchoolStudentsInput;
}>;
export type GetClassStudentsQuery = {
    __typename?: 'Query';
    getSchoolStudents: {
        __typename?: 'StudentList';
        meta: {
            __typename?: 'PaginationMeta';
            page: number;
            totalPages: number;
            total: number;
            limit: number;
        };
        data?: Array<{
            __typename?: 'Student';
            id: string;
            matricule: string;
            status?: StudentStatus | null;
            studentNumber?: number | null;
            user?: {
                __typename?: 'User';
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                    gender?: string | null;
                } | null;
            } | null;
        }> | null;
    };
};
export type GetTeachersTeamQueryVariables = Exact<{
    classId: Scalars['ID']['input'];
}>;
export type GetTeachersTeamQuery = {
    __typename?: 'Query';
    class?: {
        __typename?: 'Class';
        id: string;
        teachingTeamMembers?: Array<{
            __typename?: 'TeachingTeamMember';
            teacher: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            };
            assignments: Array<{
                __typename?: 'SubjectAssignments';
                id: string;
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                    code?: string | null;
                };
            }>;
        }> | null;
    } | null;
};
export type SubjectWithTeacherFragment = {
    __typename?: 'ClassSubject';
    id: string;
    coefficient?: number | null;
    weeklyHours?: number | null;
    assignment?: {
        __typename?: 'TeacherAssignments';
        id: string;
        teacher?: {
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                id: string;
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
    } | null;
    subject: {
        __typename?: 'Subject';
        id: string;
        name: string;
        code?: string | null;
    };
};
export type UserProfileFragment = {
    __typename?: 'User';
    id: string;
    email?: string | null;
    profile?: {
        __typename?: 'Profile';
        firstname?: string | null;
        lastname?: string | null;
        photo?: string | null;
    } | null;
};
export type CreateClassMutationVariables = Exact<{
    data: CreateClassInput;
}>;
export type CreateClassMutation = {
    __typename?: 'Mutation';
    createClass: {
        __typename?: 'Class';
        id: string;
        name: string;
        section?: string | null;
        level: string;
        supervisor?: {
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                id: string;
                profile?: {
                    __typename?: 'Profile';
                    id: string;
                    lastname?: string | null;
                    firstname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
        group?: {
            __typename?: 'Group';
            classSubjects?: Array<{
                __typename?: 'ClassSubject';
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                    code?: string | null;
                };
                assignment?: {
                    __typename?: 'TeacherAssignments';
                    teacher?: {
                        __typename?: 'Teacher';
                        id: string;
                        user?: {
                            __typename?: 'User';
                            profile?: {
                                __typename?: 'Profile';
                                lastname?: string | null;
                                firstname?: string | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
        _count?: {
            __typename?: 'ClassCount';
            teachers?: number | null;
            subjects?: number | null;
            students?: {
                __typename?: 'GenderStats';
                male: number;
                female: number;
            } | null;
        } | null;
    };
};
export type GetClassesOptionsQueryVariables = Exact<{
    input: GetSchoolClassesInput;
}>;
export type GetClassesOptionsQuery = {
    __typename?: 'Query';
    getSchoolClasses: {
        __typename?: 'ClassList';
        data?: Array<{
            __typename?: 'Class';
            id: string;
            level: string;
            name: string;
            section?: string | null;
            group?: {
                __typename?: 'Group';
                id: string;
                name: string;
                type?: GroupType | null;
            } | null;
        }> | null;
    };
};
export type UpdateClassMutationVariables = Exact<{
    classId: Scalars['ID']['input'];
    data: CreateClassInput;
    schoolId: Scalars['ID']['input'];
}>;
export type UpdateClassMutation = {
    __typename?: 'Mutation';
    updateClass?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type DeleteClassesMutationVariables = Exact<{
    classIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
    schoolId: Scalars['ID']['input'];
}>;
export type DeleteClassesMutation = {
    __typename?: 'Mutation';
    deleteClasses?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type DeleteClassSubjectsMutationVariables = Exact<{
    ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;
export type DeleteClassSubjectsMutation = {
    __typename?: 'Mutation';
    deleteClassSubjects?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type GetClassSubjectTableQueryVariables = Exact<{
    classId: Scalars['ID']['input'];
}>;
export type GetClassSubjectTableQuery = {
    __typename?: 'Query';
    class?: {
        __typename?: 'Class';
        totalWeeklyHours?: number | null;
        totalCoefficient?: number | null;
        group?: {
            __typename?: 'Group';
            classSubjects?: Array<{
                __typename?: 'ClassSubject';
                id: string;
                coefficient?: number | null;
                weeklyHours?: number | null;
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                    code?: string | null;
                };
                assignment?: {
                    __typename?: 'TeacherAssignments';
                    id: string;
                    teacher?: {
                        __typename?: 'Teacher';
                        id: string;
                        user?: {
                            __typename?: 'User';
                            profile?: {
                                __typename?: 'Profile';
                                firstname?: string | null;
                                lastname?: string | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type GetClassSubjectsOptionQueryVariables = Exact<{
    classId: Scalars['ID']['input'];
}>;
export type GetClassSubjectsOptionQuery = {
    __typename?: 'Query';
    getClassSubjects?: Array<{
        __typename?: 'ClassSubject';
        assignment?: {
            __typename?: 'TeacherAssignments';
            id: string;
        } | null;
        subject: {
            __typename?: 'Subject';
            id: string;
            name: string;
            code?: string | null;
        };
    }> | null;
};
export type CreateClassSubjectMutationVariables = Exact<{
    input: ClassSubjectInput;
}>;
export type CreateClassSubjectMutation = {
    __typename?: 'Mutation';
    createClassSubject: {
        __typename?: 'ClassSubject';
        id: string;
        coefficient?: number | null;
        weeklyHours?: number | null;
        assignment?: {
            __typename?: 'TeacherAssignments';
            id: string;
            teacher?: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    id: string;
                    email?: string | null;
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null;
        subject: {
            __typename?: 'Subject';
            id: string;
            name: string;
            code?: string | null;
        };
    };
};
export type UpdateClassSubjectMutationVariables = Exact<{
    input: ClassSubjectInput;
}>;
export type UpdateClassSubjectMutation = {
    __typename?: 'Mutation';
    updateClassSubject: {
        __typename?: 'ClassSubject';
        id: string;
        coefficient?: number | null;
        weeklyHours?: number | null;
        assignment?: {
            __typename?: 'TeacherAssignments';
            id: string;
            teacher?: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    id: string;
                    email?: string | null;
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null;
        subject: {
            __typename?: 'Subject';
            id: string;
            name: string;
            code?: string | null;
        };
    };
};
export type SearchStudentQueryVariables = Exact<{
    input: StudentSearchInput;
}>;
export type SearchStudentQuery = {
    __typename?: 'Query';
    searchStudent?: Array<{
        __typename?: 'Student';
        id: string;
        matricule: string;
        user?: {
            __typename?: 'User';
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
            } | null;
        } | null;
        schoolClass?: {
            __typename?: 'Class';
            name: string;
        } | null;
    }> | null;
};
export type SearchSchoolQueryVariables = Exact<{
    input: SchoolSearchInput;
}>;
export type SearchSchoolQuery = {
    __typename?: 'Query';
    searchSchool?: Array<{
        __typename?: 'School';
        id?: string | null;
        name: string;
        address: string;
        code?: string | null;
        logo?: string | null;
    }> | null;
};
export type ConfirmCompleteProfileMutationVariables = Exact<{
    [key: string]: never;
}>;
export type ConfirmCompleteProfileMutation = {
    __typename?: 'Mutation';
    confirmCompleteProfile?: {
        __typename?: 'UserPayload';
        ok?: boolean | null;
        message?: string | null;
        user?: {
            __typename?: 'User';
            id: string;
            email?: string | null;
            profileCompleted?: boolean | null;
            hasMembership?: boolean | null;
        } | null;
    } | null;
};
export type GetMeQueryVariables = Exact<{
    [key: string]: never;
}>;
export type GetMeQuery = {
    __typename?: 'Query';
    me?: {
        __typename?: 'User';
        id: string;
        username?: string | null;
        phoneNumber?: string | null;
        email?: string | null;
        profileCompleted?: boolean | null;
        hasMembership?: boolean | null;
        profile?: {
            __typename?: 'Profile';
            id: string;
            address?: string | null;
            firstname?: string | null;
            lastname?: string | null;
            gender?: string | null;
            photo?: string | null;
        } | null;
        memberships?: Array<{
            __typename?: 'SchoolMembership';
            id: string;
            role: string;
            school: {
                __typename?: 'School';
                id?: string | null;
                name: string;
                logo?: string | null;
                slug?: string | null;
                address: string;
            };
        } | null> | null;
    } | null;
};
export type GetDashboardContextQueryVariables = Exact<{
    input: Scalars['SchoolId']['input'];
}>;
export type GetDashboardContextQuery = {
    __typename?: 'Query';
    me?: {
        __typename?: 'User';
        schoolContext?: {
            __typename?: 'SchoolMembership';
            id: string;
            role: string;
            teacher?: {
                __typename?: 'Teacher';
                id: string;
                department?: string | null;
                specialization?: string | null;
                supervisedClasses?: Array<{
                    __typename?: 'Class';
                    id: string;
                    section?: string | null;
                } | null> | null;
            } | null;
            staff?: {
                __typename?: 'Staff';
                id: string;
                position: string;
                departement?: string | null;
                schoolUserId: string;
            } | null;
            parent?: {
                __typename?: 'Parent';
                id: string;
                isDelegate?: boolean | null;
                parentStudent?: Array<{
                    __typename?: 'ParentStudent';
                    student?: {
                        __typename?: 'Student';
                        id: string;
                        matricule: string;
                        user?: {
                            __typename?: 'User';
                            id: string;
                            profile?: {
                                __typename?: 'Profile';
                                lastname?: string | null;
                                firstname?: string | null;
                                photo?: string | null;
                            } | null;
                        } | null;
                    } | null;
                } | null> | null;
            } | null;
            student?: {
                __typename?: 'Student';
                id: string;
                matricule: string;
                user?: {
                    __typename?: 'User';
                    id: string;
                    profile?: {
                        __typename?: 'Profile';
                        id: string;
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type GetClassesAndTeachersQueryVariables = Exact<{
    limit: Scalars['Int']['input'];
}>;
export type GetClassesAndTeachersQuery = {
    __typename?: 'Query';
    getSchoolTeachers: {
        __typename?: 'TeacherList';
        data: Array<{
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                id: string;
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        }>;
    };
    getSchoolClasses: {
        __typename?: 'ClassList';
        data?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        }> | null;
    };
};
export type GetAssignmentsQueryVariables = Exact<{
    filter: GetAssignmentInput;
}>;
export type GetAssignmentsQuery = {
    __typename?: 'Query';
    getAssignments?: Array<{
        __typename?: 'TeacherAssignments';
        id: string;
        teacher?: {
            __typename?: 'Teacher';
            id: string;
            department?: string | null;
            user?: {
                __typename?: 'User';
                id: string;
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
        classSubjects?: {
            __typename?: 'ClassSubject';
            subject: {
                __typename?: 'Subject';
                id: string;
                name: string;
                code?: string | null;
            };
            group: {
                __typename?: 'Group';
                id: string;
                type?: GroupType | null;
                name: string;
                classes: Array<{
                    __typename?: 'Class';
                    id: string;
                    name: string;
                    level: string;
                    section?: string | null;
                }>;
            };
        } | null;
    }> | null;
};
export type GetSchoolLessonsQueryVariables = Exact<{
    filter: GetLessonsInput;
}>;
export type GetSchoolLessonsQuery = {
    __typename?: 'Query';
    getLessons?: {
        __typename?: 'LessonsList';
        meta?: {
            __typename?: 'PaginationMeta';
            page: number;
            totalPages: number;
            total: number;
            limit: number;
        } | null;
        data: {
            __typename?: 'LessonsData';
            resources?: Array<{
                __typename?: 'LessonResources';
                id: string;
                title: string;
                weeklyHours?: number | null;
            }> | null;
            events?: Array<{
                __typename?: 'LessonsEvents';
                id: string;
                resourceId?: string | null;
                title: string;
                status?: LessonStatus | null;
                startTime: string;
                day: Day;
                endTime: string;
                group?: {
                    __typename?: 'Group';
                    id: string;
                    name: string;
                    type?: GroupType | null;
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                    }>;
                } | null;
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                };
                teacher?: {
                    __typename?: 'LessonTeacher';
                    id: string;
                    firstname: string;
                    lastname: string;
                    weeklyHours?: number | null;
                } | null;
            }> | null;
        };
    } | null;
};
export type CreateLessonMutationVariables = Exact<{
    input: CreateLessonInput;
}>;
export type CreateLessonMutation = {
    __typename?: 'Mutation';
    createLesson?: {
        __typename?: 'Lesson';
        id: string;
        status: LessonStatus;
        startTime?: Date | null;
        endTime?: Date | null;
        day?: Day | null;
        teacherAssignment?: {
            __typename?: 'TeacherAssignments';
            classSubjects?: {
                __typename?: 'ClassSubject';
                id: string;
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                    code?: string | null;
                };
                group: {
                    __typename?: 'Group';
                    classes: Array<{
                        __typename?: 'Class';
                        name: string;
                        level: string;
                    }>;
                };
                assignment?: {
                    __typename?: 'TeacherAssignments';
                    id: string;
                    teacher?: {
                        __typename?: 'Teacher';
                        id: string;
                        user?: {
                            __typename?: 'User';
                            profile?: {
                                __typename?: 'Profile';
                                firstname?: string | null;
                                lastname?: string | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type UpdateLessonStatusMutationVariables = Exact<{
    status: LessonStatus;
    id: Scalars['ID']['input'];
}>;
export type UpdateLessonStatusMutation = {
    __typename?: 'Mutation';
    updateLessonStatus?: {
        __typename?: 'Lesson';
        id: string;
        status: LessonStatus;
    } | null;
};
export type UpdateLessonMutationVariables = Exact<{
    input: UpdateLessonInput;
}>;
export type UpdateLessonMutation = {
    __typename?: 'Mutation';
    updateLesson?: {
        __typename?: 'Lesson';
        id: string;
        status: LessonStatus;
        startTime?: Date | null;
        endTime?: Date | null;
        day?: Day | null;
    } | null;
};
export type DeleteLessonMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
export type DeleteLessonMutation = {
    __typename?: 'Mutation';
    deleteLesson?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
        details?: Array<string | null> | null;
    } | null;
};
export type GetSchoolParentsQueryVariables = Exact<{
    filter: GetSchoolParentsInput;
}>;
export type GetSchoolParentsQuery = {
    __typename?: 'Query';
    getSchoolParents?: {
        __typename?: 'ParentList';
        meta?: {
            __typename?: 'PaginationMeta';
            page: number;
            total: number;
            totalPages: number;
            limit: number;
        } | null;
        data?: Array<{
            __typename?: 'Parent';
            id: string;
            profession?: string | null;
            user?: {
                __typename?: 'User';
                id: string;
                phoneNumber?: string | null;
                email?: string | null;
                isActive?: boolean | null;
                profile?: {
                    __typename?: 'Profile';
                    id: string;
                    firstname?: string | null;
                    lastname?: string | null;
                    address?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
            parentStudent?: Array<{
                __typename?: 'ParentStudent';
                student?: {
                    __typename?: 'Student';
                    id: string;
                    user?: {
                        __typename?: 'User';
                        profile?: {
                            __typename?: 'Profile';
                            firstname?: string | null;
                            lastname?: string | null;
                        } | null;
                    } | null;
                    schoolClass?: {
                        __typename?: 'Class';
                        id: string;
                        name: string;
                        level: string;
                    } | null;
                } | null;
            } | null> | null;
        }> | null;
    } | null;
};
export type CreateParentMutationVariables = Exact<{
    input: CreateParentInput;
}>;
export type CreateParentMutation = {
    __typename?: 'Mutation';
    createParent: {
        __typename?: 'Parent';
        id: string;
        profession?: string | null;
        user?: {
            __typename?: 'User';
            id: string;
            phoneNumber?: string | null;
            email?: string | null;
            isActive?: boolean | null;
            profile?: {
                __typename?: 'Profile';
                id: string;
                firstname?: string | null;
                lastname?: string | null;
                address?: string | null;
                photo?: string | null;
            } | null;
        } | null;
        parentStudent?: Array<{
            __typename?: 'ParentStudent';
            student?: {
                __typename?: 'Student';
                id: string;
                user?: {
                    __typename?: 'User';
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                    } | null;
                } | null;
                schoolClass?: {
                    __typename?: 'Class';
                    id: string;
                    name: string;
                    level: string;
                } | null;
            } | null;
        } | null> | null;
    };
};
export type ParentListFragment = {
    __typename?: 'Parent';
    id: string;
    profession?: string | null;
    user?: {
        __typename?: 'User';
        id: string;
        phoneNumber?: string | null;
        email?: string | null;
        isActive?: boolean | null;
        profile?: {
            __typename?: 'Profile';
            id: string;
            firstname?: string | null;
            lastname?: string | null;
            address?: string | null;
            photo?: string | null;
        } | null;
    } | null;
    parentStudent?: Array<{
        __typename?: 'ParentStudent';
        student?: {
            __typename?: 'Student';
            id: string;
            user?: {
                __typename?: 'User';
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                } | null;
            } | null;
            schoolClass?: {
                __typename?: 'Class';
                id: string;
                name: string;
                level: string;
            } | null;
        } | null;
    } | null> | null;
};
export type GetSchoolRoomQueryVariables = Exact<{
    filter: GetSchoolRoomInput;
}>;
export type GetSchoolRoomQuery = {
    __typename?: 'Query';
    getSchoolRooms: {
        __typename?: 'RoomList';
        meta?: {
            __typename?: 'PaginationMeta';
            totalPages: number;
            limit: number;
            total: number;
        } | null;
        data: Array<{
            __typename?: 'Room';
            id: string;
            name: string;
            code?: string | null;
            capacity?: number | null;
            type?: string | null;
            defaultForClass?: {
                __typename?: 'Class';
                id: string;
                name: string;
                level: string;
            } | null;
            class?: Array<{
                __typename?: 'Class';
                id: string;
                name: string;
                level: string;
            } | null> | null;
        } | null>;
    };
};
export type CreateRoomMutationVariables = Exact<{
    input: CreateRoomInput;
}>;
export type CreateRoomMutation = {
    __typename?: 'Mutation';
    createRoom: {
        __typename?: 'Room';
        id: string;
        name: string;
        code?: string | null;
        capacity?: number | null;
        type?: string | null;
        defaultForClass?: {
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null;
        class?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null> | null;
    };
};
export type UpdateRoomMutationVariables = Exact<{
    input: CreateRoomInput;
}>;
export type UpdateRoomMutation = {
    __typename?: 'Mutation';
    updateRoom: {
        __typename?: 'Room';
        id: string;
        name: string;
        code?: string | null;
        capacity?: number | null;
        type?: string | null;
        defaultForClass?: {
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null;
        class?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null> | null;
    };
};
export type RoomFragmentFragment = {
    __typename?: 'Room';
    id: string;
    name: string;
    code?: string | null;
    capacity?: number | null;
    type?: string | null;
    defaultForClass?: {
        __typename?: 'Class';
        id: string;
        name: string;
        level: string;
    } | null;
    class?: Array<{
        __typename?: 'Class';
        id: string;
        name: string;
        level: string;
    } | null> | null;
};
export type GetSchoolStudentsQueryVariables = Exact<{
    input: GetSchoolStudentsInput;
}>;
export type GetSchoolStudentsQuery = {
    __typename?: 'Query';
    getSchoolStudents: {
        __typename?: 'StudentList';
        meta: {
            __typename?: 'PaginationMeta';
            total: number;
            totalPages: number;
            limit: number;
            page: number;
        };
        data?: Array<{
            __typename?: 'Student';
            id: string;
            matricule: string;
            enrollmentYear: string;
            user?: {
                __typename?: 'User';
                id: string;
                email?: string | null;
                phoneNumber?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    id: string;
                    photo?: string | null;
                    firstname?: string | null;
                    lastname?: string | null;
                    address?: string | null;
                } | null;
            } | null;
            parentStudent?: Array<{
                __typename?: 'ParentStudent';
                relationType?: RelationType | null;
                parent?: {
                    __typename?: 'Parent';
                    id: string;
                } | null;
            } | null> | null;
            schoolClass?: {
                __typename?: 'Class';
                id: string;
                name: string;
                section?: string | null;
                level: string;
            } | null;
        }> | null;
    };
};
export type GetStudentDetailsQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
export type GetStudentDetailsQuery = {
    __typename?: 'Query';
    student?: {
        __typename?: 'Student';
        id: string;
        matricule: string;
        enrollmentYear: string;
        birthDate?: Date | null;
        birthPlace?: Date | null;
        nationality?: string | null;
        status?: StudentStatus | null;
        previousClass?: string | null;
        previousSchool?: string | null;
        bloodGroup?: string | null;
        allergies?: string | null;
        medicalCondition?: string | null;
        studentNumber?: number | null;
        birthCertificateNumber?: string | null;
        enrollmentDate?: Date | null;
        transportMode?: TransportMode | null;
        parentStudent?: Array<{
            __typename?: 'ParentStudent';
            relationType?: RelationType | null;
            parent?: {
                __typename?: 'Parent';
                id: string;
                profession?: string | null;
                user?: {
                    __typename?: 'User';
                    phoneNumber?: string | null;
                    isActive?: boolean | null;
                    id: string;
                    email?: string | null;
                    profile?: {
                        __typename?: 'Profile';
                        address?: string | null;
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
        schoolClass?: {
            __typename?: 'Class';
            id: string;
            name: string;
            section?: string | null;
            level: string;
        } | null;
        user?: {
            __typename?: 'User';
            id: string;
            phoneNumber?: string | null;
            email?: string | null;
            username?: string | null;
            isActive?: boolean | null;
            profile?: {
                __typename?: 'Profile';
                id: string;
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
                gender?: string | null;
                address?: string | null;
            } | null;
        } | null;
    } | null;
};
export type GetStudentForAttendanceQueryVariables = Exact<{
    input: GetSchoolStudentsInput;
    date?: InputMaybe<Scalars['Date']['input']>;
}>;
export type GetStudentForAttendanceQuery = {
    __typename?: 'Query';
    getSchoolStudents: {
        __typename?: 'StudentList';
        data?: Array<{
            __typename?: 'Student';
            id: string;
            user?: {
                __typename?: 'User';
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
            schoolClass?: {
                __typename?: 'Class';
                id: string;
                name: string;
            } | null;
            attendances?: Array<{
                __typename?: 'AttendanceRecord';
                status?: AttendanceStatus | null;
            }> | null;
        }> | null;
    };
};
export type UpdateStudentMutationVariables = Exact<{
    studentId: Scalars['ID']['input'];
    data: CreateStudentInput;
    schoolId: Scalars['ID']['input'];
}>;
export type UpdateStudentMutation = {
    __typename?: 'Mutation';
    updateStudent?: {
        __typename?: 'Student';
        id: string;
        matricule: string;
        enrollmentYear: string;
        birthDate?: Date | null;
        birthPlace?: Date | null;
        nationality?: string | null;
        status?: StudentStatus | null;
        previousClass?: string | null;
        previousSchool?: string | null;
        bloodGroup?: string | null;
        allergies?: string | null;
        medicalCondition?: string | null;
        studentNumber?: number | null;
        birthCertificateNumber?: string | null;
        enrollmentDate?: Date | null;
        transportMode?: TransportMode | null;
        parentStudent?: Array<{
            __typename?: 'ParentStudent';
            relationType?: RelationType | null;
            parent?: {
                __typename?: 'Parent';
                id: string;
                profession?: string | null;
                user?: {
                    __typename?: 'User';
                    phoneNumber?: string | null;
                    isActive?: boolean | null;
                    id: string;
                    email?: string | null;
                    profile?: {
                        __typename?: 'Profile';
                        address?: string | null;
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
        schoolClass?: {
            __typename?: 'Class';
            id: string;
            name: string;
            section?: string | null;
            level: string;
        } | null;
        user?: {
            __typename?: 'User';
            id: string;
            phoneNumber?: string | null;
            email?: string | null;
            username?: string | null;
            isActive?: boolean | null;
            profile?: {
                __typename?: 'Profile';
                id: string;
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
                gender?: string | null;
                address?: string | null;
            } | null;
        } | null;
    } | null;
};
export type CreateListStudentMutationVariables = Exact<{
    schoolId: Scalars['ID']['input'];
    data: CreateStudentInput;
}>;
export type CreateListStudentMutation = {
    __typename?: 'Mutation';
    createListStudent?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type DeleteStudentsMutationVariables = Exact<{
    schoolId: Scalars['ID']['input'];
    studentIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
    soft?: InputMaybe<Scalars['Boolean']['input']>;
}>;
export type DeleteStudentsMutation = {
    __typename?: 'Mutation';
    deleteStudents?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type StudentDetailsFragment = {
    __typename?: 'Student';
    id: string;
    matricule: string;
    enrollmentYear: string;
    birthDate?: Date | null;
    birthPlace?: Date | null;
    nationality?: string | null;
    status?: StudentStatus | null;
    previousClass?: string | null;
    previousSchool?: string | null;
    bloodGroup?: string | null;
    allergies?: string | null;
    medicalCondition?: string | null;
    studentNumber?: number | null;
    birthCertificateNumber?: string | null;
    enrollmentDate?: Date | null;
    transportMode?: TransportMode | null;
    parentStudent?: Array<{
        __typename?: 'ParentStudent';
        relationType?: RelationType | null;
        parent?: {
            __typename?: 'Parent';
            id: string;
            profession?: string | null;
            user?: {
                __typename?: 'User';
                phoneNumber?: string | null;
                isActive?: boolean | null;
                id: string;
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    address?: string | null;
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
    } | null> | null;
    schoolClass?: {
        __typename?: 'Class';
        id: string;
        name: string;
        section?: string | null;
        level: string;
    } | null;
    user?: {
        __typename?: 'User';
        id: string;
        phoneNumber?: string | null;
        email?: string | null;
        username?: string | null;
        isActive?: boolean | null;
        profile?: {
            __typename?: 'Profile';
            id: string;
            firstname?: string | null;
            lastname?: string | null;
            photo?: string | null;
            gender?: string | null;
            address?: string | null;
        } | null;
    } | null;
};
export type GetSchoolSubjectsQueryVariables = Exact<{
    input: GetSubjectInput;
}>;
export type GetSchoolSubjectsQuery = {
    __typename?: 'Query';
    getSchoolSubjects?: {
        __typename?: 'SubjectList';
        meta: {
            __typename?: 'PaginationMeta';
            page: number;
            totalPages: number;
            total: number;
            limit: number;
        };
        data: Array<{
            __typename?: 'Subject';
            id: string;
            name: string;
            code?: string | null;
            category?: SubjectCategory | null;
            totalWeeklyHours?: number | null;
            mainTeacher?: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    id: string;
                    email?: string | null;
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                        photo?: string | null;
                    } | null;
                } | null;
            } | null;
            classSubject?: Array<{
                __typename?: 'ClassSubject';
                id: string;
                group: {
                    __typename?: 'Group';
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                        level: string;
                        section?: string | null;
                    }>;
                };
            } | null> | null;
        }>;
    } | null;
};
export type GetSubjectsOptionsQueryVariables = Exact<{
    input: GetSubjectInput;
}>;
export type GetSubjectsOptionsQuery = {
    __typename?: 'Query';
    getSchoolSubjects?: {
        __typename?: 'SubjectList';
        data: Array<{
            __typename?: 'Subject';
            id: string;
            name: string;
            code?: string | null;
        }>;
    } | null;
};
export type GetClassSubjectOptionsQueryVariables = Exact<{
    classId?: InputMaybe<Scalars['ID']['input']>;
    teacherId?: InputMaybe<Scalars['ID']['input']>;
    groupId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type GetClassSubjectOptionsQuery = {
    __typename?: 'Query';
    getClassSubjects?: Array<{
        __typename?: 'ClassSubject';
        id: string;
        assignment?: {
            __typename?: 'TeacherAssignments';
            id: string;
            teacher?: {
                __typename?: 'Teacher';
                id: string;
                user?: {
                    __typename?: 'User';
                    profile?: {
                        __typename?: 'Profile';
                        firstname?: string | null;
                        lastname?: string | null;
                    } | null;
                } | null;
            } | null;
        } | null;
        group: {
            __typename?: 'Group';
            id: string;
            name: string;
            type?: GroupType | null;
            classes: Array<{
                __typename?: 'Class';
                id: string;
                name: string;
            }>;
        };
        subject: {
            __typename?: 'Subject';
            id: string;
            name: string;
        };
    }> | null;
};
export type CreateSubjectMutationVariables = Exact<{
    input: CreateSubjectInput;
}>;
export type CreateSubjectMutation = {
    __typename?: 'Mutation';
    createSubject?: {
        __typename?: 'Subject';
        id: string;
        name: string;
        code?: string | null;
        totalWeeklyHours?: number | null;
        mainTeacher?: {
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                id: string;
                email?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                } | null;
            } | null;
        } | null;
        classSubject?: Array<{
            __typename?: 'ClassSubject';
            id: string;
            group: {
                __typename?: 'Group';
                classes: Array<{
                    __typename?: 'Class';
                    id: string;
                    name: string;
                    level: string;
                }>;
            };
            assignment?: {
                __typename?: 'TeacherAssignments';
                id: string;
                teacher?: {
                    __typename?: 'Teacher';
                    id: string;
                    user?: {
                        __typename?: 'User';
                        id: string;
                        email?: string | null;
                        profile?: {
                            __typename?: 'Profile';
                            firstname?: string | null;
                            lastname?: string | null;
                            photo?: string | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
};
export type DeleteSubjectsMutationVariables = Exact<{
    subjectIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;
export type DeleteSubjectsMutation = {
    __typename?: 'Mutation';
    deleteSubjects?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type GetSchoolTeachersQueryVariables = Exact<{
    input: GetSchoolTeachersInput;
}>;
export type GetSchoolTeachersQuery = {
    __typename?: 'Query';
    getSchoolTeachers: {
        __typename?: 'TeacherList';
        meta: {
            __typename?: 'PaginationMeta';
            limit: number;
            total: number;
            totalPages: number;
        };
        data: Array<{
            __typename?: 'Teacher';
            id: string;
            schoolUserId?: string | null;
            weeklyHours?: number | null;
            specialization?: string | null;
            diploma?: string | null;
            department?: string | null;
            experience?: string | null;
            isActive?: boolean | null;
            supervisedClasses?: Array<{
                __typename?: 'Class';
                id: string;
                name: string;
                level: string;
            } | null> | null;
            user?: {
                __typename?: 'User';
                email?: string | null;
                phoneNumber?: string | null;
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                    photo?: string | null;
                    gender?: string | null;
                } | null;
            } | null;
            assignments?: Array<{
                __typename?: 'TeacherAssignments';
                classSubjects?: {
                    __typename?: 'ClassSubject';
                    group: {
                        __typename?: 'Group';
                        type?: GroupType | null;
                        classes: Array<{
                            __typename?: 'Class';
                            id: string;
                            name: string;
                        }>;
                    };
                    subject: {
                        __typename?: 'Subject';
                        id: string;
                        name: string;
                    };
                } | null;
            } | null> | null;
        }>;
    };
};
export type GetTeacherOptionsQueryVariables = Exact<{
    input: GetSchoolTeachersInput;
}>;
export type GetTeacherOptionsQuery = {
    __typename?: 'Query';
    getSchoolTeachers: {
        __typename?: 'TeacherList';
        data: Array<{
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                } | null;
            } | null;
        }>;
    };
};
export type GetTeacherForAttendanceQueryVariables = Exact<{
    input: GetSchoolTeachersInput;
    date?: InputMaybe<Scalars['Date']['input']>;
}>;
export type GetTeacherForAttendanceQuery = {
    __typename?: 'Query';
    getSchoolTeachers: {
        __typename?: 'TeacherList';
        data: Array<{
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                profile?: {
                    __typename?: 'Profile';
                    firstname?: string | null;
                    lastname?: string | null;
                } | null;
            } | null;
            attendances?: Array<{
                __typename?: 'AttendanceRecord';
                status?: AttendanceStatus | null;
            }> | null;
            assignments?: Array<{
                __typename?: 'TeacherAssignments';
                classSubjects?: {
                    __typename?: 'ClassSubject';
                    subject: {
                        __typename?: 'Subject';
                        id: string;
                        name: string;
                    };
                    group: {
                        __typename?: 'Group';
                        classes: Array<{
                            __typename?: 'Class';
                            id: string;
                            name: string;
                        }>;
                    };
                } | null;
            } | null> | null;
        }>;
    };
};
export type TeacherForAttendancesQueryVariables = Exact<{
    filter: GetTeacherForAttendanceInput;
}>;
export type TeacherForAttendancesQuery = {
    __typename?: 'Query';
    getTeachersForAttendance?: {
        __typename?: 'TeacherList';
        data: Array<{
            __typename?: 'Teacher';
            id: string;
            user?: {
                __typename?: 'User';
                profile?: {
                    __typename?: 'Profile';
                    lastname?: string | null;
                    firstname?: string | null;
                } | null;
            } | null;
            assignments?: Array<{
                __typename?: 'TeacherAssignments';
                classSubjects?: {
                    __typename?: 'ClassSubject';
                    subject: {
                        __typename?: 'Subject';
                        id: string;
                        name: string;
                    };
                    group: {
                        __typename?: 'Group';
                        classes: Array<{
                            __typename?: 'Class';
                            id: string;
                            name: string;
                        }>;
                    };
                } | null;
            } | null> | null;
        }>;
    } | null;
};
export type GetTeacherScheduleQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
export type GetTeacherScheduleQuery = {
    __typename?: 'Query';
    teacher?: {
        __typename?: 'Teacher';
        assignments?: Array<{
            __typename?: 'TeacherAssignments';
            classSubjects?: {
                __typename?: 'ClassSubject';
                group: {
                    __typename?: 'Group';
                    id: string;
                    type?: GroupType | null;
                    name: string;
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                    }>;
                };
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                };
            } | null;
            lessons?: Array<{
                __typename?: 'Lesson';
                id: string;
                endTime?: Date | null;
                startTime?: Date | null;
                status: LessonStatus;
                day?: Day | null;
            }> | null;
        } | null> | null;
    } | null;
};
export type GetTeacherDetailsQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
export type GetTeacherDetailsQuery = {
    __typename?: 'Query';
    teacher?: {
        __typename?: 'Teacher';
        id: string;
        specialization?: string | null;
        diploma?: string | null;
        experience?: string | null;
        bio?: string | null;
        hireDate?: Date | null;
        salary?: number | null;
        department?: string | null;
        weeklyHours?: number | null;
        isActive?: boolean | null;
        createdAt?: Date | null;
        user?: {
            __typename?: 'User';
            id: string;
            email?: string | null;
            phoneNumber?: string | null;
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
                gender?: string | null;
                address?: string | null;
            } | null;
        } | null;
        assignments?: Array<{
            __typename?: 'TeacherAssignments';
            classSubjects?: {
                __typename?: 'ClassSubject';
                id: string;
                group: {
                    __typename?: 'Group';
                    id: string;
                    type?: GroupType | null;
                    name: string;
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                        level: string;
                    }>;
                };
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                    code?: string | null;
                };
            } | null;
        } | null> | null;
    } | null;
};
export type DeleteTeachersMutationVariables = Exact<{
    teacherIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
    soft?: InputMaybe<Scalars['Boolean']['input']>;
}>;
export type DeleteTeachersMutation = {
    __typename?: 'Mutation';
    deleteTeachers?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
    } | null;
};
export type CreateTeacherMutationVariables = Exact<{
    input: CreateTeacherInput;
}>;
export type CreateTeacherMutation = {
    __typename?: 'Mutation';
    createTeacher?: {
        __typename?: 'Teacher';
        id: string;
        schoolUserId?: string | null;
        weeklyHours?: number | null;
        specialization?: string | null;
        diploma?: string | null;
        department?: string | null;
        experience?: string | null;
        isActive?: boolean | null;
        supervisedClasses?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null> | null;
        user?: {
            __typename?: 'User';
            email?: string | null;
            phoneNumber?: string | null;
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
                gender?: string | null;
            } | null;
        } | null;
        assignments?: Array<{
            __typename?: 'TeacherAssignments';
            classSubjects?: {
                __typename?: 'ClassSubject';
                group: {
                    __typename?: 'Group';
                    type?: GroupType | null;
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                    }>;
                };
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                };
            } | null;
        } | null> | null;
    } | null;
};
export type CreateTeacherAssignmentMutationVariables = Exact<{
    input: CreateTeacherAssignmentInput;
}>;
export type CreateTeacherAssignmentMutation = {
    __typename?: 'Mutation';
    createTeacherAssignment?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
        details?: Array<string | null> | null;
    } | null;
};
export type SyncTeacherAssignmentMutationVariables = Exact<{
    input: CreateTeacherAssignmentInput;
}>;
export type SyncTeacherAssignmentMutation = {
    __typename?: 'Mutation';
    syncTeacherAssignment?: {
        __typename?: 'ApiResponse';
        ok?: boolean | null;
        message?: string | null;
        details?: Array<string | null> | null;
    } | null;
};
export type TeacherListDataFragment = {
    __typename?: 'Teacher';
    id: string;
    schoolUserId?: string | null;
    weeklyHours?: number | null;
    specialization?: string | null;
    diploma?: string | null;
    department?: string | null;
    experience?: string | null;
    isActive?: boolean | null;
    supervisedClasses?: Array<{
        __typename?: 'Class';
        id: string;
        name: string;
        level: string;
    } | null> | null;
    user?: {
        __typename?: 'User';
        email?: string | null;
        phoneNumber?: string | null;
        profile?: {
            __typename?: 'Profile';
            firstname?: string | null;
            lastname?: string | null;
            photo?: string | null;
            gender?: string | null;
        } | null;
    } | null;
    assignments?: Array<{
        __typename?: 'TeacherAssignments';
        classSubjects?: {
            __typename?: 'ClassSubject';
            group: {
                __typename?: 'Group';
                type?: GroupType | null;
                classes: Array<{
                    __typename?: 'Class';
                    id: string;
                    name: string;
                }>;
            };
            subject: {
                __typename?: 'Subject';
                id: string;
                name: string;
            };
        } | null;
    } | null> | null;
};
export type UpdateTeacherMutationVariables = Exact<{
    teacherId: Scalars['ID']['input'];
    data: CreateTeacherInput;
}>;
export type UpdateTeacherMutation = {
    __typename?: 'Mutation';
    updateTeacher?: {
        __typename?: 'Teacher';
        id: string;
        schoolUserId?: string | null;
        weeklyHours?: number | null;
        specialization?: string | null;
        diploma?: string | null;
        department?: string | null;
        experience?: string | null;
        isActive?: boolean | null;
        supervisedClasses?: Array<{
            __typename?: 'Class';
            id: string;
            name: string;
            level: string;
        } | null> | null;
        user?: {
            __typename?: 'User';
            email?: string | null;
            phoneNumber?: string | null;
            profile?: {
                __typename?: 'Profile';
                firstname?: string | null;
                lastname?: string | null;
                photo?: string | null;
                gender?: string | null;
            } | null;
        } | null;
        assignments?: Array<{
            __typename?: 'TeacherAssignments';
            classSubjects?: {
                __typename?: 'ClassSubject';
                group: {
                    __typename?: 'Group';
                    type?: GroupType | null;
                    classes: Array<{
                        __typename?: 'Class';
                        id: string;
                        name: string;
                    }>;
                };
                subject: {
                    __typename?: 'Subject';
                    id: string;
                    name: string;
                };
            } | null;
        } | null> | null;
    } | null;
};
export declare const ClassListFragmentFragmentDoc = "\n    fragment ClassListFragment on Class {\n  id\n  name\n  section\n  level\n  supervisor {\n    id\n    user {\n      id\n      profile {\n        id\n        lastname\n        firstname\n        photo\n      }\n    }\n  }\n  group {\n    classSubjects {\n      subject {\n        id\n        name\n        code\n      }\n      assignment {\n        teacher {\n          id\n          user {\n            profile {\n              lastname\n              firstname\n            }\n          }\n        }\n      }\n    }\n  }\n  _count {\n    students {\n      male\n      female\n    }\n    teachers\n    subjects\n  }\n}\n    ";
export declare const UserProfileFragmentDoc = "\n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const SubjectWithTeacherFragmentDoc = "\n    fragment SubjectWithTeacher on ClassSubject {\n  id\n  coefficient\n  weeklyHours\n  assignment {\n    id\n    teacher {\n      id\n      user {\n        ...UserProfile\n      }\n    }\n  }\n  subject {\n    id\n    name\n    code\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const ParentListFragmentDoc = "\n    fragment ParentList on Parent {\n  id\n  profession\n  user {\n    id\n    phoneNumber\n    email\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      address\n      photo\n    }\n  }\n  parentStudent {\n    student {\n      id\n      user {\n        profile {\n          firstname\n          lastname\n        }\n      }\n      schoolClass {\n        id\n        name\n        level\n      }\n    }\n  }\n}\n    ";
export declare const RoomFragmentFragmentDoc = "\n    fragment RoomFragment on Room {\n  id\n  name\n  code\n  capacity\n  type\n  defaultForClass {\n    id\n    name\n    level\n  }\n  class {\n    id\n    name\n    level\n  }\n}\n    ";
export declare const StudentDetailsFragmentDoc = "\n    fragment StudentDetails on Student {\n  id\n  matricule\n  enrollmentYear\n  birthDate\n  birthPlace\n  nationality\n  status\n  previousClass\n  previousSchool\n  bloodGroup\n  allergies\n  medicalCondition\n  studentNumber\n  birthCertificateNumber\n  enrollmentDate\n  transportMode\n  parentStudent {\n    relationType\n    parent {\n      id\n      profession\n      user {\n        phoneNumber\n        isActive\n        ...UserProfile\n        profile {\n          address\n        }\n      }\n    }\n  }\n  schoolClass {\n    id\n    name\n    section\n    level\n  }\n  user {\n    id\n    phoneNumber\n    email\n    username\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      photo\n      gender\n      address\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const TeacherListDataFragmentDoc = "\n    fragment TeacherListData on Teacher {\n  id\n  schoolUserId\n  supervisedClasses {\n    id\n    name\n    level\n  }\n  weeklyHours\n  specialization\n  diploma\n  department\n  experience\n  isActive\n  user {\n    email\n    phoneNumber\n    profile {\n      firstname\n      lastname\n      photo\n      gender\n    }\n  }\n  assignments {\n    classSubjects {\n      group {\n        type\n        classes {\n          id\n          name\n        }\n      }\n      subject {\n        id\n        name\n      }\n    }\n  }\n}\n    ";
export declare const GetAdminDashboardStatsDocument = "\n    query GetAdminDashboardStats($schoolId: ID!) {\n  school(schoolId: $schoolId) {\n    id\n    name\n    logo\n    stats {\n      totalStudents\n      totalTeachers\n      totalClasses\n      monthlyRevenue {\n        previousMonth\n        currentMonth\n      }\n      pendingPaymentsCount\n      attendance {\n        rate\n        presentCount\n        absentCount\n        totalExpected\n        lateCount\n        history {\n          date\n          rate\n          present\n          absent\n          late\n        }\n      }\n      studentGender {\n        male\n        female\n      }\n      classesOccupancy {\n        className\n        studentCount\n      }\n      enrollmentPerMonth {\n        month\n        count\n      }\n    }\n  }\n}\n    ";
export declare const useGetAdminDashboardStatsQuery: {
    <TData = GetAdminDashboardStatsQuery, TError = unknown>(variables: GetAdminDashboardStatsQueryVariables, options?: Omit<UseQueryOptions<GetAdminDashboardStatsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetAdminDashboardStatsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetAdminDashboardStatsQueryVariables): (string | Exact<{
        schoolId: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetAdminDashboardStatsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetAdminDashboardStatsQuery>;
};
export declare const useInfiniteGetAdminDashboardStatsQuery: {
    <TData = InfiniteData<GetAdminDashboardStatsQuery, unknown>, TError = unknown>(variables: GetAdminDashboardStatsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetAdminDashboardStatsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetAdminDashboardStatsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetAdminDashboardStatsQueryVariables): (string | Exact<{
        schoolId: Scalars["ID"]["input"];
    }>)[];
};
export declare const GetSchoolSettingsDocument = "\n    query GetSchoolSettings($schoolId: ID!) {\n  school(schoolId: $schoolId) {\n    settings {\n      id\n      startHour\n      endHour\n      daysOfWeek\n      lessonDuration\n    }\n  }\n}\n    ";
export declare const useGetSchoolSettingsQuery: {
    <TData = GetSchoolSettingsQuery, TError = unknown>(variables: GetSchoolSettingsQueryVariables, options?: Omit<UseQueryOptions<GetSchoolSettingsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolSettingsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolSettingsQueryVariables): (string | Exact<{
        schoolId: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetSchoolSettingsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolSettingsQuery>;
};
export declare const useInfiniteGetSchoolSettingsQuery: {
    <TData = InfiniteData<GetSchoolSettingsQuery, unknown>, TError = unknown>(variables: GetSchoolSettingsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolSettingsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolSettingsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolSettingsQueryVariables): (string | Exact<{
        schoolId: Scalars["ID"]["input"];
    }>)[];
};
export declare const MarkStudentAttendanceDocument = "\n    mutation MarkStudentAttendance($input: MarkStudentAttendanceInput!) {\n  markStudentAttendance(input: $input) {\n    id\n    date\n    checkInTime\n    recordedBy {\n      id\n      profile {\n        firstname\n        lastname\n      }\n    }\n    person {\n      ... on Student {\n        id\n        schoolClass {\n          name\n        }\n        profile {\n          firstname\n          lastname\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useMarkStudentAttendanceMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<MarkStudentAttendanceMutation, TError, MarkStudentAttendanceMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<MarkStudentAttendanceMutation, TError, Exact<{
        input: MarkStudentAttendanceInput;
    }>, TContext>;
    fetcher(variables: MarkStudentAttendanceMutationVariables, options?: RequestInit["headers"]): () => Promise<MarkStudentAttendanceMutation>;
};
export declare const GetSchoolClassesDocument = "\n    query GetSchoolClasses($input: GetSchoolClassesInput!) {\n  getSchoolClasses(input: $input) {\n    meta {\n      limit\n      totalPages\n      total\n    }\n    data {\n      ...ClassListFragment\n    }\n  }\n}\n    \n    fragment ClassListFragment on Class {\n  id\n  name\n  section\n  level\n  supervisor {\n    id\n    user {\n      id\n      profile {\n        id\n        lastname\n        firstname\n        photo\n      }\n    }\n  }\n  group {\n    classSubjects {\n      subject {\n        id\n        name\n        code\n      }\n      assignment {\n        teacher {\n          id\n          user {\n            profile {\n              lastname\n              firstname\n            }\n          }\n        }\n      }\n    }\n  }\n  _count {\n    students {\n      male\n      female\n    }\n    teachers\n    subjects\n  }\n}\n    ";
export declare const useGetSchoolClassesQuery: {
    <TData = GetSchoolClassesQuery, TError = unknown>(variables: GetSchoolClassesQueryVariables, options?: Omit<UseQueryOptions<GetSchoolClassesQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolClassesQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolClassesQueryVariables): (string | Exact<{
        input: GetSchoolClassesInput;
    }>)[];
    fetcher(variables: GetSchoolClassesQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolClassesQuery>;
};
export declare const useInfiniteGetSchoolClassesQuery: {
    <TData = InfiniteData<GetSchoolClassesQuery, unknown>, TError = unknown>(variables: GetSchoolClassesQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolClassesQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolClassesQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolClassesQueryVariables): (string | Exact<{
        input: GetSchoolClassesInput;
    }>)[];
};
export declare const GetClassDetailsDocument = "\n    query GetClassDetails($id: ID!) {\n  class(id: $id) {\n    id\n    name\n    level\n    section\n    totalCoefficient\n    totalWeeklyHours\n    group {\n      id\n      type\n    }\n    supervisor {\n      id\n      user {\n        email\n        phoneNumber\n        profile {\n          firstname\n          lastname\n          photo\n        }\n      }\n    }\n    _count {\n      students {\n        male\n        female\n      }\n      subjects\n      teachers\n    }\n  }\n}\n    ";
export declare const useGetClassDetailsQuery: {
    <TData = GetClassDetailsQuery, TError = unknown>(variables: GetClassDetailsQueryVariables, options?: Omit<UseQueryOptions<GetClassDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetClassDetailsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassDetailsQuery>;
};
export declare const useInfiniteGetClassDetailsQuery: {
    <TData = InfiniteData<GetClassDetailsQuery, unknown>, TError = unknown>(variables: GetClassDetailsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
};
export declare const GetClassStudentsDocument = "\n    query GetClassStudents($input: GetSchoolStudentsInput!) {\n  getSchoolStudents(input: $input) {\n    meta {\n      page\n      totalPages\n      total\n      limit\n    }\n    data {\n      id\n      matricule\n      status\n      studentNumber\n      user {\n        profile {\n          firstname\n          lastname\n          photo\n          gender\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetClassStudentsQuery: {
    <TData = GetClassStudentsQuery, TError = unknown>(variables: GetClassStudentsQueryVariables, options?: Omit<UseQueryOptions<GetClassStudentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassStudentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassStudentsQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
    }>)[];
    fetcher(variables: GetClassStudentsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassStudentsQuery>;
};
export declare const useInfiniteGetClassStudentsQuery: {
    <TData = InfiniteData<GetClassStudentsQuery, unknown>, TError = unknown>(variables: GetClassStudentsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassStudentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassStudentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassStudentsQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
    }>)[];
};
export declare const GetTeachersTeamDocument = "\n    query getTeachersTeam($classId: ID!) {\n  class(id: $classId) {\n    id\n    teachingTeamMembers {\n      teacher {\n        id\n        user {\n          profile {\n            firstname\n            lastname\n            photo\n          }\n        }\n      }\n      assignments {\n        id\n        subject {\n          id\n          name\n          code\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetTeachersTeamQuery: {
    <TData = GetTeachersTeamQuery, TError = unknown>(variables: GetTeachersTeamQueryVariables, options?: Omit<UseQueryOptions<GetTeachersTeamQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetTeachersTeamQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetTeachersTeamQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetTeachersTeamQueryVariables, options?: RequestInit["headers"]): () => Promise<GetTeachersTeamQuery>;
};
export declare const useInfiniteGetTeachersTeamQuery: {
    <TData = InfiniteData<GetTeachersTeamQuery, unknown>, TError = unknown>(variables: GetTeachersTeamQueryVariables, options: Omit<UseInfiniteQueryOptions<GetTeachersTeamQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetTeachersTeamQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetTeachersTeamQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
};
export declare const CreateClassDocument = "\n    mutation CreateClass($data: CreateClassInput!) {\n  createClass(data: $data) {\n    ...ClassListFragment\n  }\n}\n    \n    fragment ClassListFragment on Class {\n  id\n  name\n  section\n  level\n  supervisor {\n    id\n    user {\n      id\n      profile {\n        id\n        lastname\n        firstname\n        photo\n      }\n    }\n  }\n  group {\n    classSubjects {\n      subject {\n        id\n        name\n        code\n      }\n      assignment {\n        teacher {\n          id\n          user {\n            profile {\n              lastname\n              firstname\n            }\n          }\n        }\n      }\n    }\n  }\n  _count {\n    students {\n      male\n      female\n    }\n    teachers\n    subjects\n  }\n}\n    ";
export declare const useCreateClassMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateClassMutation, TError, CreateClassMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateClassMutation, TError, Exact<{
        data: CreateClassInput;
    }>, TContext>;
    fetcher(variables: CreateClassMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateClassMutation>;
};
export declare const GetClassesOptionsDocument = "\n    query GetClassesOptions($input: GetSchoolClassesInput!) {\n  getSchoolClasses(input: $input) {\n    data {\n      id\n      level\n      name\n      section\n      group {\n        id\n        name\n        type\n      }\n    }\n  }\n}\n    ";
export declare const useGetClassesOptionsQuery: {
    <TData = GetClassesOptionsQuery, TError = unknown>(variables: GetClassesOptionsQueryVariables, options?: Omit<UseQueryOptions<GetClassesOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassesOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassesOptionsQueryVariables): (string | Exact<{
        input: GetSchoolClassesInput;
    }>)[];
    fetcher(variables: GetClassesOptionsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassesOptionsQuery>;
};
export declare const useInfiniteGetClassesOptionsQuery: {
    <TData = InfiniteData<GetClassesOptionsQuery, unknown>, TError = unknown>(variables: GetClassesOptionsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassesOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassesOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassesOptionsQueryVariables): (string | Exact<{
        input: GetSchoolClassesInput;
    }>)[];
};
export declare const UpdateClassDocument = "\n    mutation UpdateClass($classId: ID!, $data: CreateClassInput!, $schoolId: ID!) {\n  updateClass(classId: $classId, data: $data, schoolId: $schoolId) {\n    ok\n    message\n  }\n}\n    ";
export declare const useUpdateClassMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateClassMutation, TError, UpdateClassMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateClassMutation, TError, Exact<{
        classId: Scalars["ID"]["input"];
        data: CreateClassInput;
        schoolId: Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: UpdateClassMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateClassMutation>;
};
export declare const DeleteClassesDocument = "\n    mutation DeleteClasses($classIds: [ID!]!, $schoolId: ID!) {\n  deleteClasses(classIds: $classIds, schoolId: $schoolId) {\n    ok\n    message\n  }\n}\n    ";
export declare const useDeleteClassesMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteClassesMutation, TError, DeleteClassesMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteClassesMutation, TError, Exact<{
        classIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
        schoolId: Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: DeleteClassesMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteClassesMutation>;
};
export declare const DeleteClassSubjectsDocument = "\n    mutation DeleteClassSubjects($ids: [ID!]!) {\n  deleteClassSubjects(ids: $ids) {\n    ok\n    message\n  }\n}\n    ";
export declare const useDeleteClassSubjectsMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteClassSubjectsMutation, TError, DeleteClassSubjectsMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteClassSubjectsMutation, TError, Exact<{
        ids: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: DeleteClassSubjectsMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteClassSubjectsMutation>;
};
export declare const GetClassSubjectTableDocument = "\n    query GetClassSubjectTable($classId: ID!) {\n  class(id: $classId) {\n    totalWeeklyHours\n    totalCoefficient\n    group {\n      classSubjects {\n        id\n        coefficient\n        weeklyHours\n        subject {\n          id\n          name\n          code\n        }\n        assignment {\n          id\n          teacher {\n            id\n            user {\n              profile {\n                firstname\n                lastname\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetClassSubjectTableQuery: {
    <TData = GetClassSubjectTableQuery, TError = unknown>(variables: GetClassSubjectTableQueryVariables, options?: Omit<UseQueryOptions<GetClassSubjectTableQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassSubjectTableQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassSubjectTableQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetClassSubjectTableQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassSubjectTableQuery>;
};
export declare const useInfiniteGetClassSubjectTableQuery: {
    <TData = InfiniteData<GetClassSubjectTableQuery, unknown>, TError = unknown>(variables: GetClassSubjectTableQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassSubjectTableQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassSubjectTableQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassSubjectTableQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
};
export declare const GetClassSubjectsOptionDocument = "\n    query GetClassSubjectsOption($classId: ID!) {\n  getClassSubjects(classId: $classId) {\n    assignment {\n      id\n    }\n    subject {\n      id\n      name\n      code\n    }\n  }\n}\n    ";
export declare const useGetClassSubjectsOptionQuery: {
    <TData = GetClassSubjectsOptionQuery, TError = unknown>(variables: GetClassSubjectsOptionQueryVariables, options?: Omit<UseQueryOptions<GetClassSubjectsOptionQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassSubjectsOptionQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassSubjectsOptionQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetClassSubjectsOptionQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassSubjectsOptionQuery>;
};
export declare const useInfiniteGetClassSubjectsOptionQuery: {
    <TData = InfiniteData<GetClassSubjectsOptionQuery, unknown>, TError = unknown>(variables: GetClassSubjectsOptionQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassSubjectsOptionQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassSubjectsOptionQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassSubjectsOptionQueryVariables): (string | Exact<{
        classId: Scalars["ID"]["input"];
    }>)[];
};
export declare const CreateClassSubjectDocument = "\n    mutation CreateClassSubject($input: ClassSubjectInput!) {\n  createClassSubject(input: $input) {\n    ...SubjectWithTeacher\n  }\n}\n    \n    fragment SubjectWithTeacher on ClassSubject {\n  id\n  coefficient\n  weeklyHours\n  assignment {\n    id\n    teacher {\n      id\n      user {\n        ...UserProfile\n      }\n    }\n  }\n  subject {\n    id\n    name\n    code\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useCreateClassSubjectMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateClassSubjectMutation, TError, CreateClassSubjectMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateClassSubjectMutation, TError, Exact<{
        input: ClassSubjectInput;
    }>, TContext>;
    fetcher(variables: CreateClassSubjectMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateClassSubjectMutation>;
};
export declare const UpdateClassSubjectDocument = "\n    mutation UpdateClassSubject($input: ClassSubjectInput!) {\n  updateClassSubject(input: $input) {\n    ...SubjectWithTeacher\n  }\n}\n    \n    fragment SubjectWithTeacher on ClassSubject {\n  id\n  coefficient\n  weeklyHours\n  assignment {\n    id\n    teacher {\n      id\n      user {\n        ...UserProfile\n      }\n    }\n  }\n  subject {\n    id\n    name\n    code\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useUpdateClassSubjectMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateClassSubjectMutation, TError, UpdateClassSubjectMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateClassSubjectMutation, TError, Exact<{
        input: ClassSubjectInput;
    }>, TContext>;
    fetcher(variables: UpdateClassSubjectMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateClassSubjectMutation>;
};
export declare const SearchStudentDocument = "\n    query SearchStudent($input: StudentSearchInput!) {\n  searchStudent(filter: $input) {\n    id\n    user {\n      profile {\n        firstname\n        lastname\n        photo\n      }\n    }\n    schoolClass {\n      name\n    }\n    matricule\n  }\n}\n    ";
export declare const useSearchStudentQuery: {
    <TData = SearchStudentQuery, TError = unknown>(variables: SearchStudentQueryVariables, options?: Omit<UseQueryOptions<SearchStudentQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<SearchStudentQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: SearchStudentQueryVariables): (string | Exact<{
        input: StudentSearchInput;
    }>)[];
    fetcher(variables: SearchStudentQueryVariables, options?: RequestInit["headers"]): () => Promise<SearchStudentQuery>;
};
export declare const useInfiniteSearchStudentQuery: {
    <TData = InfiniteData<SearchStudentQuery, unknown>, TError = unknown>(variables: SearchStudentQueryVariables, options: Omit<UseInfiniteQueryOptions<SearchStudentQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<SearchStudentQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: SearchStudentQueryVariables): (string | Exact<{
        input: StudentSearchInput;
    }>)[];
};
export declare const SearchSchoolDocument = "\n    query SearchSchool($input: SchoolSearchInput!) {\n  searchSchool(filter: $input) {\n    id\n    name\n    address\n    code\n    logo\n  }\n}\n    ";
export declare const useSearchSchoolQuery: {
    <TData = SearchSchoolQuery, TError = unknown>(variables: SearchSchoolQueryVariables, options?: Omit<UseQueryOptions<SearchSchoolQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<SearchSchoolQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: SearchSchoolQueryVariables): (string | Exact<{
        input: SchoolSearchInput;
    }>)[];
    fetcher(variables: SearchSchoolQueryVariables, options?: RequestInit["headers"]): () => Promise<SearchSchoolQuery>;
};
export declare const useInfiniteSearchSchoolQuery: {
    <TData = InfiniteData<SearchSchoolQuery, unknown>, TError = unknown>(variables: SearchSchoolQueryVariables, options: Omit<UseInfiniteQueryOptions<SearchSchoolQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<SearchSchoolQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: SearchSchoolQueryVariables): (string | Exact<{
        input: SchoolSearchInput;
    }>)[];
};
export declare const ConfirmCompleteProfileDocument = "\n    mutation ConfirmCompleteProfile {\n  confirmCompleteProfile {\n    ok\n    message\n    user {\n      id\n      email\n      profileCompleted\n      hasMembership\n    }\n  }\n}\n    ";
export declare const useConfirmCompleteProfileMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<ConfirmCompleteProfileMutation, TError, ConfirmCompleteProfileMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<ConfirmCompleteProfileMutation, TError, Exact<{
        [key: string]: never;
    }>, TContext>;
    fetcher(variables?: ConfirmCompleteProfileMutationVariables, options?: RequestInit["headers"]): () => Promise<ConfirmCompleteProfileMutation>;
};
export declare const GetMeDocument = "\n    query GetMe {\n  me {\n    id\n    username\n    phoneNumber\n    email\n    profileCompleted\n    hasMembership\n    profile {\n      id\n      address\n      firstname\n      lastname\n      gender\n      photo\n    }\n    memberships {\n      id\n      role\n      school {\n        id\n        name\n        logo\n        slug\n        address\n      }\n    }\n  }\n}\n    ";
export declare const useGetMeQuery: {
    <TData = GetMeQuery, TError = unknown>(variables?: GetMeQueryVariables, options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetMeQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables?: GetMeQueryVariables): (string | Exact<{
        [key: string]: never;
    }>)[];
    fetcher(variables?: GetMeQueryVariables, options?: RequestInit["headers"]): () => Promise<GetMeQuery>;
};
export declare const useInfiniteGetMeQuery: {
    <TData = InfiniteData<GetMeQuery, unknown>, TError = unknown>(variables: GetMeQueryVariables, options: Omit<UseInfiniteQueryOptions<GetMeQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetMeQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables?: GetMeQueryVariables): (string | Exact<{
        [key: string]: never;
    }>)[];
};
export declare const GetDashboardContextDocument = "\n    query GetDashboardContext($input: SchoolId!) {\n  me {\n    schoolContext(schoolId: $input) {\n      id\n      role\n      teacher {\n        id\n        department\n        specialization\n        supervisedClasses {\n          id\n          section\n          section\n        }\n      }\n      staff {\n        id\n        position\n        departement\n        schoolUserId\n      }\n      parent {\n        id\n        isDelegate\n        parentStudent {\n          student {\n            id\n            user {\n              id\n              profile {\n                lastname\n                firstname\n                photo\n              }\n            }\n            matricule\n          }\n        }\n      }\n      student {\n        id\n        user {\n          id\n          profile {\n            id\n            firstname\n            lastname\n            photo\n          }\n        }\n        matricule\n      }\n    }\n  }\n}\n    ";
export declare const useGetDashboardContextQuery: {
    <TData = GetDashboardContextQuery, TError = unknown>(variables: GetDashboardContextQueryVariables, options?: Omit<UseQueryOptions<GetDashboardContextQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetDashboardContextQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetDashboardContextQueryVariables): (string | Exact<{
        input: Scalars["SchoolId"]["input"];
    }>)[];
    fetcher(variables: GetDashboardContextQueryVariables, options?: RequestInit["headers"]): () => Promise<GetDashboardContextQuery>;
};
export declare const useInfiniteGetDashboardContextQuery: {
    <TData = InfiniteData<GetDashboardContextQuery, unknown>, TError = unknown>(variables: GetDashboardContextQueryVariables, options: Omit<UseInfiniteQueryOptions<GetDashboardContextQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetDashboardContextQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetDashboardContextQueryVariables): (string | Exact<{
        input: Scalars["SchoolId"]["input"];
    }>)[];
};
export declare const GetClassesAndTeachersDocument = "\n    query GetClassesAndTeachers($limit: Int!) {\n  getSchoolTeachers(input: {limit: $limit}) {\n    data {\n      id\n      user {\n        ...UserProfile\n      }\n    }\n  }\n  getSchoolClasses(input: {limit: $limit}) {\n    data {\n      id\n      name\n      level\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useGetClassesAndTeachersQuery: {
    <TData = GetClassesAndTeachersQuery, TError = unknown>(variables: GetClassesAndTeachersQueryVariables, options?: Omit<UseQueryOptions<GetClassesAndTeachersQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassesAndTeachersQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetClassesAndTeachersQueryVariables): (string | Exact<{
        limit: Scalars["Int"]["input"];
    }>)[];
    fetcher(variables: GetClassesAndTeachersQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassesAndTeachersQuery>;
};
export declare const useInfiniteGetClassesAndTeachersQuery: {
    <TData = InfiniteData<GetClassesAndTeachersQuery, unknown>, TError = unknown>(variables: GetClassesAndTeachersQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassesAndTeachersQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassesAndTeachersQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetClassesAndTeachersQueryVariables): (string | Exact<{
        limit: Scalars["Int"]["input"];
    }>)[];
};
export declare const GetAssignmentsDocument = "\n    query GetAssignments($filter: GetAssignmentInput!) {\n  getAssignments(filter: $filter) {\n    id\n    teacher {\n      id\n      department\n      user {\n        ...UserProfile\n      }\n    }\n    classSubjects {\n      subject {\n        id\n        name\n        code\n      }\n      group {\n        id\n        type\n        name\n        classes {\n          id\n          name\n          level\n          section\n        }\n      }\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useGetAssignmentsQuery: {
    <TData = GetAssignmentsQuery, TError = unknown>(variables: GetAssignmentsQueryVariables, options?: Omit<UseQueryOptions<GetAssignmentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetAssignmentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetAssignmentsQueryVariables): (string | Exact<{
        filter: GetAssignmentInput;
    }>)[];
    fetcher(variables: GetAssignmentsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetAssignmentsQuery>;
};
export declare const useInfiniteGetAssignmentsQuery: {
    <TData = InfiniteData<GetAssignmentsQuery, unknown>, TError = unknown>(variables: GetAssignmentsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetAssignmentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetAssignmentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetAssignmentsQueryVariables): (string | Exact<{
        filter: GetAssignmentInput;
    }>)[];
};
export declare const GetSchoolLessonsDocument = "\n    query GetSchoolLessons($filter: GetLessonsInput!) {\n  getLessons(filter: $filter) {\n    meta {\n      page\n      totalPages\n      total\n      limit\n    }\n    data {\n      resources {\n        id\n        title\n        weeklyHours\n      }\n      events {\n        id\n        resourceId\n        title\n        status\n        startTime\n        day\n        endTime\n        group {\n          id\n          name\n          type\n          classes {\n            id\n            name\n          }\n        }\n        subject {\n          id\n          name\n        }\n        teacher {\n          id\n          firstname\n          lastname\n          weeklyHours\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetSchoolLessonsQuery: {
    <TData = GetSchoolLessonsQuery, TError = unknown>(variables: GetSchoolLessonsQueryVariables, options?: Omit<UseQueryOptions<GetSchoolLessonsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolLessonsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolLessonsQueryVariables): (string | Exact<{
        filter: GetLessonsInput;
    }>)[];
    fetcher(variables: GetSchoolLessonsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolLessonsQuery>;
};
export declare const useInfiniteGetSchoolLessonsQuery: {
    <TData = InfiniteData<GetSchoolLessonsQuery, unknown>, TError = unknown>(variables: GetSchoolLessonsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolLessonsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolLessonsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolLessonsQueryVariables): (string | Exact<{
        filter: GetLessonsInput;
    }>)[];
};
export declare const CreateLessonDocument = "\n    mutation CreateLesson($input: CreateLessonInput!) {\n  createLesson(input: $input) {\n    id\n    status\n    startTime\n    endTime\n    day\n    teacherAssignment {\n      classSubjects {\n        id\n        subject {\n          id\n          name\n          code\n        }\n        group {\n          classes {\n            name\n            level\n          }\n        }\n        assignment {\n          id\n          teacher {\n            id\n            user {\n              profile {\n                firstname\n                lastname\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useCreateLessonMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateLessonMutation, TError, CreateLessonMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateLessonMutation, TError, Exact<{
        input: CreateLessonInput;
    }>, TContext>;
    fetcher(variables: CreateLessonMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateLessonMutation>;
};
export declare const UpdateLessonStatusDocument = "\n    mutation UpdateLessonStatus($status: LessonStatus!, $id: ID!) {\n  updateLessonStatus(status: $status, id: $id) {\n    id\n    status\n  }\n}\n    ";
export declare const useUpdateLessonStatusMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateLessonStatusMutation, TError, UpdateLessonStatusMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateLessonStatusMutation, TError, Exact<{
        status: LessonStatus;
        id: Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: UpdateLessonStatusMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateLessonStatusMutation>;
};
export declare const UpdateLessonDocument = "\n    mutation UpdateLesson($input: UpdateLessonInput!) {\n  updateLesson(input: $input) {\n    id\n    status\n    startTime\n    endTime\n    day\n  }\n}\n    ";
export declare const useUpdateLessonMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateLessonMutation, TError, UpdateLessonMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateLessonMutation, TError, Exact<{
        input: UpdateLessonInput;
    }>, TContext>;
    fetcher(variables: UpdateLessonMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateLessonMutation>;
};
export declare const DeleteLessonDocument = "\n    mutation DeleteLesson($id: ID!) {\n  deleteLesson(id: $id) {\n    ok\n    message\n    details\n  }\n}\n    ";
export declare const useDeleteLessonMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteLessonMutation, TError, DeleteLessonMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteLessonMutation, TError, Exact<{
        id: Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: DeleteLessonMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteLessonMutation>;
};
export declare const GetSchoolParentsDocument = "\n    query GetSchoolParents($filter: GetSchoolParentsInput!) {\n  getSchoolParents(filter: $filter) {\n    meta {\n      page\n      total\n      totalPages\n      limit\n    }\n    data {\n      ...ParentList\n    }\n  }\n}\n    \n    fragment ParentList on Parent {\n  id\n  profession\n  user {\n    id\n    phoneNumber\n    email\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      address\n      photo\n    }\n  }\n  parentStudent {\n    student {\n      id\n      user {\n        profile {\n          firstname\n          lastname\n        }\n      }\n      schoolClass {\n        id\n        name\n        level\n      }\n    }\n  }\n}\n    ";
export declare const useGetSchoolParentsQuery: {
    <TData = GetSchoolParentsQuery, TError = unknown>(variables: GetSchoolParentsQueryVariables, options?: Omit<UseQueryOptions<GetSchoolParentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolParentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolParentsQueryVariables): (string | Exact<{
        filter: GetSchoolParentsInput;
    }>)[];
    fetcher(variables: GetSchoolParentsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolParentsQuery>;
};
export declare const useInfiniteGetSchoolParentsQuery: {
    <TData = InfiniteData<GetSchoolParentsQuery, unknown>, TError = unknown>(variables: GetSchoolParentsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolParentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolParentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolParentsQueryVariables): (string | Exact<{
        filter: GetSchoolParentsInput;
    }>)[];
};
export declare const CreateParentDocument = "\n    mutation CreateParent($input: CreateParentInput!) {\n  createParent(input: $input) {\n    ...ParentList\n  }\n}\n    \n    fragment ParentList on Parent {\n  id\n  profession\n  user {\n    id\n    phoneNumber\n    email\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      address\n      photo\n    }\n  }\n  parentStudent {\n    student {\n      id\n      user {\n        profile {\n          firstname\n          lastname\n        }\n      }\n      schoolClass {\n        id\n        name\n        level\n      }\n    }\n  }\n}\n    ";
export declare const useCreateParentMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateParentMutation, TError, CreateParentMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateParentMutation, TError, Exact<{
        input: CreateParentInput;
    }>, TContext>;
    fetcher(variables: CreateParentMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateParentMutation>;
};
export declare const GetSchoolRoomDocument = "\n    query GetSchoolRoom($filter: GetSchoolRoomInput!) {\n  getSchoolRooms(filter: $filter) {\n    meta {\n      totalPages\n      limit\n      total\n    }\n    data {\n      ...RoomFragment\n    }\n  }\n}\n    \n    fragment RoomFragment on Room {\n  id\n  name\n  code\n  capacity\n  type\n  defaultForClass {\n    id\n    name\n    level\n  }\n  class {\n    id\n    name\n    level\n  }\n}\n    ";
export declare const useGetSchoolRoomQuery: {
    <TData = GetSchoolRoomQuery, TError = unknown>(variables: GetSchoolRoomQueryVariables, options?: Omit<UseQueryOptions<GetSchoolRoomQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolRoomQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolRoomQueryVariables): (string | Exact<{
        filter: GetSchoolRoomInput;
    }>)[];
    fetcher(variables: GetSchoolRoomQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolRoomQuery>;
};
export declare const useInfiniteGetSchoolRoomQuery: {
    <TData = InfiniteData<GetSchoolRoomQuery, unknown>, TError = unknown>(variables: GetSchoolRoomQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolRoomQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolRoomQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolRoomQueryVariables): (string | Exact<{
        filter: GetSchoolRoomInput;
    }>)[];
};
export declare const CreateRoomDocument = "\n    mutation CreateRoom($input: CreateRoomInput!) {\n  createRoom(input: $input) {\n    ...RoomFragment\n  }\n}\n    \n    fragment RoomFragment on Room {\n  id\n  name\n  code\n  capacity\n  type\n  defaultForClass {\n    id\n    name\n    level\n  }\n  class {\n    id\n    name\n    level\n  }\n}\n    ";
export declare const useCreateRoomMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateRoomMutation, TError, CreateRoomMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateRoomMutation, TError, Exact<{
        input: CreateRoomInput;
    }>, TContext>;
    fetcher(variables: CreateRoomMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateRoomMutation>;
};
export declare const UpdateRoomDocument = "\n    mutation UpdateRoom($input: CreateRoomInput!) {\n  updateRoom(input: $input) {\n    ...RoomFragment\n  }\n}\n    \n    fragment RoomFragment on Room {\n  id\n  name\n  code\n  capacity\n  type\n  defaultForClass {\n    id\n    name\n    level\n  }\n  class {\n    id\n    name\n    level\n  }\n}\n    ";
export declare const useUpdateRoomMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateRoomMutation, TError, UpdateRoomMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateRoomMutation, TError, Exact<{
        input: CreateRoomInput;
    }>, TContext>;
    fetcher(variables: UpdateRoomMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateRoomMutation>;
};
export declare const GetSchoolStudentsDocument = "\n    query GetSchoolStudents($input: GetSchoolStudentsInput!) {\n  getSchoolStudents(input: $input) {\n    meta {\n      total\n      totalPages\n      limit\n      page\n    }\n    data {\n      id\n      matricule\n      enrollmentYear\n      user {\n        id\n        email\n        phoneNumber\n        profile {\n          id\n          photo\n          firstname\n          lastname\n          address\n        }\n      }\n      parentStudent {\n        relationType\n        parent {\n          id\n        }\n      }\n      schoolClass {\n        id\n        name\n        section\n        level\n      }\n    }\n  }\n}\n    ";
export declare const useGetSchoolStudentsQuery: {
    <TData = GetSchoolStudentsQuery, TError = unknown>(variables: GetSchoolStudentsQueryVariables, options?: Omit<UseQueryOptions<GetSchoolStudentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolStudentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolStudentsQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
    }>)[];
    fetcher(variables: GetSchoolStudentsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolStudentsQuery>;
};
export declare const useInfiniteGetSchoolStudentsQuery: {
    <TData = InfiniteData<GetSchoolStudentsQuery, unknown>, TError = unknown>(variables: GetSchoolStudentsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolStudentsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolStudentsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolStudentsQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
    }>)[];
};
export declare const GetStudentDetailsDocument = "\n    query GetStudentDetails($id: ID!) {\n  student(id: $id) {\n    ...StudentDetails\n  }\n}\n    \n    fragment StudentDetails on Student {\n  id\n  matricule\n  enrollmentYear\n  birthDate\n  birthPlace\n  nationality\n  status\n  previousClass\n  previousSchool\n  bloodGroup\n  allergies\n  medicalCondition\n  studentNumber\n  birthCertificateNumber\n  enrollmentDate\n  transportMode\n  parentStudent {\n    relationType\n    parent {\n      id\n      profession\n      user {\n        phoneNumber\n        isActive\n        ...UserProfile\n        profile {\n          address\n        }\n      }\n    }\n  }\n  schoolClass {\n    id\n    name\n    section\n    level\n  }\n  user {\n    id\n    phoneNumber\n    email\n    username\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      photo\n      gender\n      address\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useGetStudentDetailsQuery: {
    <TData = GetStudentDetailsQuery, TError = unknown>(variables: GetStudentDetailsQueryVariables, options?: Omit<UseQueryOptions<GetStudentDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetStudentDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetStudentDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetStudentDetailsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetStudentDetailsQuery>;
};
export declare const useInfiniteGetStudentDetailsQuery: {
    <TData = InfiniteData<GetStudentDetailsQuery, unknown>, TError = unknown>(variables: GetStudentDetailsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetStudentDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetStudentDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetStudentDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
};
export declare const GetStudentForAttendanceDocument = "\n    query GetStudentForAttendance($input: GetSchoolStudentsInput!, $date: Date) {\n  getSchoolStudents(input: $input) {\n    data {\n      id\n      user {\n        email\n        profile {\n          firstname\n          lastname\n          photo\n        }\n      }\n      schoolClass {\n        id\n        name\n      }\n      attendances(date: $date) {\n        status\n      }\n    }\n  }\n}\n    ";
export declare const useGetStudentForAttendanceQuery: {
    <TData = GetStudentForAttendanceQuery, TError = unknown>(variables: GetStudentForAttendanceQueryVariables, options?: Omit<UseQueryOptions<GetStudentForAttendanceQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetStudentForAttendanceQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetStudentForAttendanceQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
        date?: InputMaybe<Scalars["Date"]["input"]>;
    }>)[];
    fetcher(variables: GetStudentForAttendanceQueryVariables, options?: RequestInit["headers"]): () => Promise<GetStudentForAttendanceQuery>;
};
export declare const useInfiniteGetStudentForAttendanceQuery: {
    <TData = InfiniteData<GetStudentForAttendanceQuery, unknown>, TError = unknown>(variables: GetStudentForAttendanceQueryVariables, options: Omit<UseInfiniteQueryOptions<GetStudentForAttendanceQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetStudentForAttendanceQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetStudentForAttendanceQueryVariables): (string | Exact<{
        input: GetSchoolStudentsInput;
        date?: InputMaybe<Scalars["Date"]["input"]>;
    }>)[];
};
export declare const UpdateStudentDocument = "\n    mutation UpdateStudent($studentId: ID!, $data: CreateStudentInput!, $schoolId: ID!) {\n  updateStudent(studentId: $studentId, data: $data, schoolId: $schoolId) {\n    ...StudentDetails\n  }\n}\n    \n    fragment StudentDetails on Student {\n  id\n  matricule\n  enrollmentYear\n  birthDate\n  birthPlace\n  nationality\n  status\n  previousClass\n  previousSchool\n  bloodGroup\n  allergies\n  medicalCondition\n  studentNumber\n  birthCertificateNumber\n  enrollmentDate\n  transportMode\n  parentStudent {\n    relationType\n    parent {\n      id\n      profession\n      user {\n        phoneNumber\n        isActive\n        ...UserProfile\n        profile {\n          address\n        }\n      }\n    }\n  }\n  schoolClass {\n    id\n    name\n    section\n    level\n  }\n  user {\n    id\n    phoneNumber\n    email\n    username\n    isActive\n    profile {\n      id\n      firstname\n      lastname\n      photo\n      gender\n      address\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useUpdateStudentMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateStudentMutation, TError, UpdateStudentMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateStudentMutation, TError, Exact<{
        studentId: Scalars["ID"]["input"];
        data: CreateStudentInput;
        schoolId: Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: UpdateStudentMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateStudentMutation>;
};
export declare const CreateListStudentDocument = "\n    mutation CreateListStudent($schoolId: ID!, $data: CreateStudentInput!) {\n  createListStudent(schoolId: $schoolId, data: $data) {\n    ok\n    message\n  }\n}\n    ";
export declare const useCreateListStudentMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateListStudentMutation, TError, CreateListStudentMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateListStudentMutation, TError, Exact<{
        schoolId: Scalars["ID"]["input"];
        data: CreateStudentInput;
    }>, TContext>;
    fetcher(variables: CreateListStudentMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateListStudentMutation>;
};
export declare const DeleteStudentsDocument = "\n    mutation DeleteStudents($schoolId: ID!, $studentIds: [ID!]!, $soft: Boolean) {\n  deleteStudents(schoolId: $schoolId, studentIds: $studentIds, soft: $soft) {\n    ok\n    message\n  }\n}\n    ";
export declare const useDeleteStudentsMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteStudentsMutation, TError, DeleteStudentsMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteStudentsMutation, TError, Exact<{
        schoolId: Scalars["ID"]["input"];
        studentIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
        soft?: InputMaybe<Scalars["Boolean"]["input"]>;
    }>, TContext>;
    fetcher(variables: DeleteStudentsMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteStudentsMutation>;
};
export declare const GetSchoolSubjectsDocument = "\n    query GetSchoolSubjects($input: GetSubjectInput!) {\n  getSchoolSubjects(input: $input) {\n    meta {\n      page\n      totalPages\n      total\n      limit\n    }\n    data {\n      id\n      name\n      code\n      category\n      totalWeeklyHours\n      mainTeacher {\n        id\n        user {\n          ...UserProfile\n        }\n      }\n      classSubject {\n        id\n        group {\n          classes {\n            id\n            name\n            level\n            section\n          }\n        }\n      }\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useGetSchoolSubjectsQuery: {
    <TData = GetSchoolSubjectsQuery, TError = unknown>(variables: GetSchoolSubjectsQueryVariables, options?: Omit<UseQueryOptions<GetSchoolSubjectsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolSubjectsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolSubjectsQueryVariables): (string | Exact<{
        input: GetSubjectInput;
    }>)[];
    fetcher(variables: GetSchoolSubjectsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolSubjectsQuery>;
};
export declare const useInfiniteGetSchoolSubjectsQuery: {
    <TData = InfiniteData<GetSchoolSubjectsQuery, unknown>, TError = unknown>(variables: GetSchoolSubjectsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolSubjectsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolSubjectsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolSubjectsQueryVariables): (string | Exact<{
        input: GetSubjectInput;
    }>)[];
};
export declare const GetSubjectsOptionsDocument = "\n    query GetSubjectsOptions($input: GetSubjectInput!) {\n  getSchoolSubjects(input: $input) {\n    data {\n      id\n      name\n      code\n    }\n  }\n}\n    ";
export declare const useGetSubjectsOptionsQuery: {
    <TData = GetSubjectsOptionsQuery, TError = unknown>(variables: GetSubjectsOptionsQueryVariables, options?: Omit<UseQueryOptions<GetSubjectsOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSubjectsOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSubjectsOptionsQueryVariables): (string | Exact<{
        input: GetSubjectInput;
    }>)[];
    fetcher(variables: GetSubjectsOptionsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSubjectsOptionsQuery>;
};
export declare const useInfiniteGetSubjectsOptionsQuery: {
    <TData = InfiniteData<GetSubjectsOptionsQuery, unknown>, TError = unknown>(variables: GetSubjectsOptionsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSubjectsOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSubjectsOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSubjectsOptionsQueryVariables): (string | Exact<{
        input: GetSubjectInput;
    }>)[];
};
export declare const GetClassSubjectOptionsDocument = "\n    query GetClassSubjectOptions($classId: ID, $teacherId: ID, $groupId: ID) {\n  getClassSubjects(classId: $classId, teacherId: $teacherId, groupId: $groupId) {\n    id\n    assignment {\n      id\n      teacher {\n        id\n        user {\n          profile {\n            firstname\n            lastname\n          }\n        }\n      }\n    }\n    group {\n      id\n      name\n      type\n      classes {\n        id\n        name\n      }\n    }\n    subject {\n      id\n      name\n    }\n  }\n}\n    ";
export declare const useGetClassSubjectOptionsQuery: {
    <TData = GetClassSubjectOptionsQuery, TError = unknown>(variables?: GetClassSubjectOptionsQueryVariables, options?: Omit<UseQueryOptions<GetClassSubjectOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetClassSubjectOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables?: GetClassSubjectOptionsQueryVariables): (string | Exact<{
        classId?: InputMaybe<Scalars["ID"]["input"]>;
        teacherId?: InputMaybe<Scalars["ID"]["input"]>;
        groupId?: InputMaybe<Scalars["ID"]["input"]>;
    }>)[];
    fetcher(variables?: GetClassSubjectOptionsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetClassSubjectOptionsQuery>;
};
export declare const useInfiniteGetClassSubjectOptionsQuery: {
    <TData = InfiniteData<GetClassSubjectOptionsQuery, unknown>, TError = unknown>(variables: GetClassSubjectOptionsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetClassSubjectOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetClassSubjectOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables?: GetClassSubjectOptionsQueryVariables): (string | Exact<{
        classId?: InputMaybe<Scalars["ID"]["input"]>;
        teacherId?: InputMaybe<Scalars["ID"]["input"]>;
        groupId?: InputMaybe<Scalars["ID"]["input"]>;
    }>)[];
};
export declare const CreateSubjectDocument = "\n    mutation CreateSubject($input: CreateSubjectInput!) {\n  createSubject(input: $input) {\n    id\n    name\n    code\n    totalWeeklyHours\n    mainTeacher {\n      id\n      user {\n        ...UserProfile\n      }\n    }\n    classSubject {\n      id\n      group {\n        classes {\n          id\n          name\n          level\n        }\n      }\n      assignment {\n        id\n        teacher {\n          id\n          user {\n            ...UserProfile\n          }\n        }\n      }\n    }\n  }\n}\n    \n    fragment UserProfile on User {\n  id\n  email\n  profile {\n    firstname\n    lastname\n    photo\n  }\n}\n    ";
export declare const useCreateSubjectMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateSubjectMutation, TError, CreateSubjectMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateSubjectMutation, TError, Exact<{
        input: CreateSubjectInput;
    }>, TContext>;
    fetcher(variables: CreateSubjectMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateSubjectMutation>;
};
export declare const DeleteSubjectsDocument = "\n    mutation DeleteSubjects($subjectIds: [ID!]!) {\n  deleteSubjects(subjectIds: $subjectIds) {\n    ok\n    message\n  }\n}\n    ";
export declare const useDeleteSubjectsMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteSubjectsMutation, TError, DeleteSubjectsMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteSubjectsMutation, TError, Exact<{
        subjectIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
    }>, TContext>;
    fetcher(variables: DeleteSubjectsMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteSubjectsMutation>;
};
export declare const GetSchoolTeachersDocument = "\n    query GetSchoolTeachers($input: GetSchoolTeachersInput!) {\n  getSchoolTeachers(input: $input) {\n    meta {\n      limit\n      total\n      totalPages\n    }\n    data {\n      ...TeacherListData\n    }\n  }\n}\n    \n    fragment TeacherListData on Teacher {\n  id\n  schoolUserId\n  supervisedClasses {\n    id\n    name\n    level\n  }\n  weeklyHours\n  specialization\n  diploma\n  department\n  experience\n  isActive\n  user {\n    email\n    phoneNumber\n    profile {\n      firstname\n      lastname\n      photo\n      gender\n    }\n  }\n  assignments {\n    classSubjects {\n      group {\n        type\n        classes {\n          id\n          name\n        }\n      }\n      subject {\n        id\n        name\n      }\n    }\n  }\n}\n    ";
export declare const useGetSchoolTeachersQuery: {
    <TData = GetSchoolTeachersQuery, TError = unknown>(variables: GetSchoolTeachersQueryVariables, options?: Omit<UseQueryOptions<GetSchoolTeachersQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetSchoolTeachersQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetSchoolTeachersQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
    }>)[];
    fetcher(variables: GetSchoolTeachersQueryVariables, options?: RequestInit["headers"]): () => Promise<GetSchoolTeachersQuery>;
};
export declare const useInfiniteGetSchoolTeachersQuery: {
    <TData = InfiniteData<GetSchoolTeachersQuery, unknown>, TError = unknown>(variables: GetSchoolTeachersQueryVariables, options: Omit<UseInfiniteQueryOptions<GetSchoolTeachersQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetSchoolTeachersQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetSchoolTeachersQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
    }>)[];
};
export declare const GetTeacherOptionsDocument = "\n    query GetTeacherOptions($input: GetSchoolTeachersInput!) {\n  getSchoolTeachers(input: $input) {\n    data {\n      id\n      user {\n        profile {\n          firstname\n          lastname\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetTeacherOptionsQuery: {
    <TData = GetTeacherOptionsQuery, TError = unknown>(variables: GetTeacherOptionsQueryVariables, options?: Omit<UseQueryOptions<GetTeacherOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetTeacherOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetTeacherOptionsQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
    }>)[];
    fetcher(variables: GetTeacherOptionsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetTeacherOptionsQuery>;
};
export declare const useInfiniteGetTeacherOptionsQuery: {
    <TData = InfiniteData<GetTeacherOptionsQuery, unknown>, TError = unknown>(variables: GetTeacherOptionsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetTeacherOptionsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetTeacherOptionsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetTeacherOptionsQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
    }>)[];
};
export declare const GetTeacherForAttendanceDocument = "\n    query GetTeacherForAttendance($input: GetSchoolTeachersInput!, $date: Date) {\n  getSchoolTeachers(input: $input) {\n    data {\n      id\n      user {\n        profile {\n          firstname\n          lastname\n        }\n      }\n      attendances(date: $date) {\n        status\n      }\n      assignments {\n        classSubjects {\n          subject {\n            id\n            name\n          }\n          group {\n            classes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetTeacherForAttendanceQuery: {
    <TData = GetTeacherForAttendanceQuery, TError = unknown>(variables: GetTeacherForAttendanceQueryVariables, options?: Omit<UseQueryOptions<GetTeacherForAttendanceQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetTeacherForAttendanceQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetTeacherForAttendanceQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
        date?: InputMaybe<Scalars["Date"]["input"]>;
    }>)[];
    fetcher(variables: GetTeacherForAttendanceQueryVariables, options?: RequestInit["headers"]): () => Promise<GetTeacherForAttendanceQuery>;
};
export declare const useInfiniteGetTeacherForAttendanceQuery: {
    <TData = InfiniteData<GetTeacherForAttendanceQuery, unknown>, TError = unknown>(variables: GetTeacherForAttendanceQueryVariables, options: Omit<UseInfiniteQueryOptions<GetTeacherForAttendanceQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetTeacherForAttendanceQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetTeacherForAttendanceQueryVariables): (string | Exact<{
        input: GetSchoolTeachersInput;
        date?: InputMaybe<Scalars["Date"]["input"]>;
    }>)[];
};
export declare const TeacherForAttendancesDocument = "\n    query TeacherForAttendances($filter: GetTeacherForAttendanceInput!) {\n  getTeachersForAttendance(filter: $filter) {\n    data {\n      id\n      user {\n        profile {\n          lastname\n          firstname\n        }\n      }\n      assignments {\n        classSubjects {\n          subject {\n            id\n            name\n          }\n          group {\n            classes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useTeacherForAttendancesQuery: {
    <TData = TeacherForAttendancesQuery, TError = unknown>(variables: TeacherForAttendancesQueryVariables, options?: Omit<UseQueryOptions<TeacherForAttendancesQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<TeacherForAttendancesQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: TeacherForAttendancesQueryVariables): (string | Exact<{
        filter: GetTeacherForAttendanceInput;
    }>)[];
    fetcher(variables: TeacherForAttendancesQueryVariables, options?: RequestInit["headers"]): () => Promise<TeacherForAttendancesQuery>;
};
export declare const useInfiniteTeacherForAttendancesQuery: {
    <TData = InfiniteData<TeacherForAttendancesQuery, unknown>, TError = unknown>(variables: TeacherForAttendancesQueryVariables, options: Omit<UseInfiniteQueryOptions<TeacherForAttendancesQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<TeacherForAttendancesQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: TeacherForAttendancesQueryVariables): (string | Exact<{
        filter: GetTeacherForAttendanceInput;
    }>)[];
};
export declare const GetTeacherScheduleDocument = "\n    query GetTeacherSchedule($id: ID!) {\n  teacher(id: $id) {\n    assignments {\n      classSubjects {\n        group {\n          id\n          type\n          name\n          classes {\n            id\n            name\n          }\n        }\n        subject {\n          id\n          name\n        }\n      }\n      lessons {\n        id\n        endTime\n        startTime\n        status\n        day\n      }\n    }\n  }\n}\n    ";
export declare const useGetTeacherScheduleQuery: {
    <TData = GetTeacherScheduleQuery, TError = unknown>(variables: GetTeacherScheduleQueryVariables, options?: Omit<UseQueryOptions<GetTeacherScheduleQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetTeacherScheduleQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetTeacherScheduleQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetTeacherScheduleQueryVariables, options?: RequestInit["headers"]): () => Promise<GetTeacherScheduleQuery>;
};
export declare const useInfiniteGetTeacherScheduleQuery: {
    <TData = InfiniteData<GetTeacherScheduleQuery, unknown>, TError = unknown>(variables: GetTeacherScheduleQueryVariables, options: Omit<UseInfiniteQueryOptions<GetTeacherScheduleQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetTeacherScheduleQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetTeacherScheduleQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
};
export declare const GetTeacherDetailsDocument = "\n    query GetTeacherDetails($id: ID!) {\n  teacher(id: $id) {\n    id\n    specialization\n    diploma\n    experience\n    bio\n    hireDate\n    salary\n    department\n    weeklyHours\n    isActive\n    createdAt\n    user {\n      id\n      email\n      phoneNumber\n      profile {\n        firstname\n        lastname\n        photo\n        gender\n        address\n      }\n    }\n    assignments {\n      classSubjects {\n        id\n        group {\n          id\n          type\n          name\n          classes {\n            id\n            name\n            level\n          }\n        }\n        subject {\n          id\n          name\n          code\n        }\n      }\n    }\n  }\n}\n    ";
export declare const useGetTeacherDetailsQuery: {
    <TData = GetTeacherDetailsQuery, TError = unknown>(variables: GetTeacherDetailsQueryVariables, options?: Omit<UseQueryOptions<GetTeacherDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseQueryOptions<GetTeacherDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseQueryResult<NoInfer<TData>, TError>;
    getKey(variables: GetTeacherDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
    fetcher(variables: GetTeacherDetailsQueryVariables, options?: RequestInit["headers"]): () => Promise<GetTeacherDetailsQuery>;
};
export declare const useInfiniteGetTeacherDetailsQuery: {
    <TData = InfiniteData<GetTeacherDetailsQuery, unknown>, TError = unknown>(variables: GetTeacherDetailsQueryVariables, options: Omit<UseInfiniteQueryOptions<GetTeacherDetailsQuery, TError, TData>, "queryKey"> & {
        queryKey?: UseInfiniteQueryOptions<GetTeacherDetailsQuery, TError, TData>["queryKey"];
    }): import("@tanstack/react-query").UseInfiniteQueryResult<TData, TError>;
    getKey(variables: GetTeacherDetailsQueryVariables): (string | Exact<{
        id: Scalars["ID"]["input"];
    }>)[];
};
export declare const DeleteTeachersDocument = "\n    mutation DeleteTeachers($teacherIds: [ID!]!, $soft: Boolean) {\n  deleteTeachers(teacherIds: $teacherIds, soft: $soft) {\n    ok\n    message\n  }\n}\n    ";
export declare const useDeleteTeachersMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<DeleteTeachersMutation, TError, DeleteTeachersMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<DeleteTeachersMutation, TError, Exact<{
        teacherIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
        soft?: InputMaybe<Scalars["Boolean"]["input"]>;
    }>, TContext>;
    fetcher(variables: DeleteTeachersMutationVariables, options?: RequestInit["headers"]): () => Promise<DeleteTeachersMutation>;
};
export declare const CreateTeacherDocument = "\n    mutation CreateTeacher($input: CreateTeacherInput!) {\n  createTeacher(input: $input) {\n    ...TeacherListData\n  }\n}\n    \n    fragment TeacherListData on Teacher {\n  id\n  schoolUserId\n  supervisedClasses {\n    id\n    name\n    level\n  }\n  weeklyHours\n  specialization\n  diploma\n  department\n  experience\n  isActive\n  user {\n    email\n    phoneNumber\n    profile {\n      firstname\n      lastname\n      photo\n      gender\n    }\n  }\n  assignments {\n    classSubjects {\n      group {\n        type\n        classes {\n          id\n          name\n        }\n      }\n      subject {\n        id\n        name\n      }\n    }\n  }\n}\n    ";
export declare const useCreateTeacherMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateTeacherMutation, TError, CreateTeacherMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateTeacherMutation, TError, Exact<{
        input: CreateTeacherInput;
    }>, TContext>;
    fetcher(variables: CreateTeacherMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateTeacherMutation>;
};
export declare const CreateTeacherAssignmentDocument = "\n    mutation CreateTeacherAssignment($input: CreateTeacherAssignmentInput!) {\n  createTeacherAssignment(input: $input) {\n    ok\n    message\n    details\n  }\n}\n    ";
export declare const useCreateTeacherAssignmentMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<CreateTeacherAssignmentMutation, TError, CreateTeacherAssignmentMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<CreateTeacherAssignmentMutation, TError, Exact<{
        input: CreateTeacherAssignmentInput;
    }>, TContext>;
    fetcher(variables: CreateTeacherAssignmentMutationVariables, options?: RequestInit["headers"]): () => Promise<CreateTeacherAssignmentMutation>;
};
export declare const SyncTeacherAssignmentDocument = "\n    mutation SyncTeacherAssignment($input: CreateTeacherAssignmentInput!) {\n  syncTeacherAssignment(input: $input) {\n    ok\n    message\n    details\n  }\n}\n    ";
export declare const useSyncTeacherAssignmentMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<SyncTeacherAssignmentMutation, TError, SyncTeacherAssignmentMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<SyncTeacherAssignmentMutation, TError, Exact<{
        input: CreateTeacherAssignmentInput;
    }>, TContext>;
    fetcher(variables: SyncTeacherAssignmentMutationVariables, options?: RequestInit["headers"]): () => Promise<SyncTeacherAssignmentMutation>;
};
export declare const UpdateTeacherDocument = "\n    mutation UpdateTeacher($teacherId: ID!, $data: CreateTeacherInput!) {\n  updateTeacher(teacherId: $teacherId, data: $data) {\n    ...TeacherListData\n  }\n}\n    \n    fragment TeacherListData on Teacher {\n  id\n  schoolUserId\n  supervisedClasses {\n    id\n    name\n    level\n  }\n  weeklyHours\n  specialization\n  diploma\n  department\n  experience\n  isActive\n  user {\n    email\n    phoneNumber\n    profile {\n      firstname\n      lastname\n      photo\n      gender\n    }\n  }\n  assignments {\n    classSubjects {\n      group {\n        type\n        classes {\n          id\n          name\n        }\n      }\n      subject {\n        id\n        name\n      }\n    }\n  }\n}\n    ";
export declare const useUpdateTeacherMutation: {
    <TError = unknown, TContext = unknown>(options?: UseMutationOptions<UpdateTeacherMutation, TError, UpdateTeacherMutationVariables, TContext>): import("@tanstack/react-query").UseMutationResult<UpdateTeacherMutation, TError, Exact<{
        teacherId: Scalars["ID"]["input"];
        data: CreateTeacherInput;
    }>, TContext>;
    fetcher(variables: UpdateTeacherMutationVariables, options?: RequestInit["headers"]): () => Promise<UpdateTeacherMutation>;
};
//# sourceMappingURL=graphql.d.ts.map