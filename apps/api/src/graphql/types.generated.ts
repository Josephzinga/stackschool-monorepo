import { StudentStatus } from '@stackschool/db/src/prisma/client/generated';
import { Gender } from '@stackschool/db/src/prisma/client/generated';
import { Day } from '@stackschool/db/src/prisma/client/generated';
import { LessonStatus } from '@stackschool/db/src/prisma/client/generated';
import { TransportMode } from '@stackschool/db/src/prisma/client/generated';
import { SubjectCategory } from '@stackschool/db/src/prisma/client/generated';
import { RelationType } from '@stackschool/db/src/prisma/client/generated';
import { GroupType } from '@stackschool/db/src/prisma/client/generated';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../types/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  SchoolId: { input: any; output: any; }
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

export enum AssessmentStatus {
  Closed = 'CLOSED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export enum AssessmentType {
  Assignment = 'ASSIGNMENT',
  Exam = 'EXAM',
  Oral = 'ORAL',
  Practical = 'PRACTICAL',
  Quiz = 'QUIZ',
  Test = 'TEST'
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

export enum AttendanceStatus {
  Absent = 'ABSENT',
  Excused = 'EXCUSED',
  Late = 'LATE',
  Present = 'PRESENT'
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

export enum ContactPreference {
  Email = 'EMAIL',
  Phone = 'PHONE',
  Whatsapp = 'WHATSAPP'
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

export { Day };

export enum DisciplinaryType {
  Expulsion = 'EXPULSION',
  Suspension = 'SUSPENSION',
  Warning = 'WARNING'
}

export { Gender };

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

export type Group = {
  __typename?: 'Group';
  classSubjects?: Maybe<Array<Maybe<ClassSubject>>>;
  classes: Array<Class>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<GroupType>;
};

export { GroupType };

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

export { LessonStatus };

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

export { RelationType };

export enum ResourceMode {
  Class = 'CLASS',
  Teacher = 'TEACHER'
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

export enum SchoolRole {
  Admin = 'ADMIN',
  Parent = 'PARENT',
  Staff = 'STAFF',
  Student = 'STUDENT',
  Teacher = 'TEACHER'
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

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
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

export enum StudentSortField {
  EnrolementYear = 'enrolementYear',
  Firstname = 'firstname',
  Lastname = 'lastname'
}

export type StudentSortInput = {
  field?: InputMaybe<StudentSortField>;
  order?: InputMaybe<SortOrder>;
};

export { StudentStatus };

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

export { SubjectCategory };

export type SubjectList = {
  __typename?: 'SubjectList';
  data: Array<Subject>;
  meta: PaginationMeta;
};

export enum SubjectSortField {
  Coefficient = 'coefficient',
  Name = 'name',
  Ponderation = 'ponderation'
}

export type SubjectSortInput = {
  field?: InputMaybe<SubjectSortField>;
  order?: InputMaybe<SortOrder>;
};

export type Teacher = {
  __typename?: 'Teacher';
  assignments?: Maybe<Array<Maybe<TeacherAssignments>>>;
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

export { TransportMode };

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

export enum UpdateMode {
  Connect = 'CONNECT',
  Create = 'CREATE'
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Person:
    | ( Staff )
    | ( Student )
    | ( Teacher )
  ;
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ApiResponse: ResolverTypeWrapper<ApiResponse>;
  Assessment: ResolverTypeWrapper<Assessment>;
  AssessmentStatus: AssessmentStatus;
  AssessmentType: AssessmentType;
  AttendanceRecord: ResolverTypeWrapper<Omit<AttendanceRecord, 'person'> & { person?: Maybe<ResolversTypes['Person']> }>;
  AttendanceSessionPayload: ResolverTypeWrapper<AttendanceSessionPayload>;
  AttendanceStats: ResolverTypeWrapper<AttendanceStats>;
  AttendanceStatus: AttendanceStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Class: ResolverTypeWrapper<Class>;
  ClassAndSubject: ResolverTypeWrapper<ClassAndSubject>;
  ClassCount: ResolverTypeWrapper<ClassCount>;
  ClassList: ResolverTypeWrapper<ClassList>;
  ClassStats: ResolverTypeWrapper<ClassStats>;
  ClassSubject: ResolverTypeWrapper<ClassSubject>;
  ClassSubjectInput: ClassSubjectInput;
  ClassTeacher: ResolverTypeWrapper<ClassTeacher>;
  ContactPreference: ContactPreference;
  CreateClassInput: CreateClassInput;
  CreateGroupInput: CreateGroupInput;
  CreateInvitationInput: CreateInvitationInput;
  CreateLessonInput: CreateLessonInput;
  CreateParentInput: CreateParentInput;
  CreateRoomInput: CreateRoomInput;
  CreateStudentInput: CreateStudentInput;
  CreateSubjectInput: CreateSubjectInput;
  CreateTeacherAssignmentInput: CreateTeacherAssignmentInput;
  CreateTeacherInput: CreateTeacherInput;
  DailyAttendance: ResolverTypeWrapper<DailyAttendance>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Day: Day;
  DisciplinaryType: DisciplinaryType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Gender: Gender;
  GenderStats: ResolverTypeWrapper<GenderStats>;
  GenerateSessionInput: GenerateSessionInput;
  GetAssignmentInput: GetAssignmentInput;
  GetLessonsInput: GetLessonsInput;
  GetSchoolClassesInput: GetSchoolClassesInput;
  GetSchoolParentsInput: GetSchoolParentsInput;
  GetSchoolRoomInput: GetSchoolRoomInput;
  GetSchoolStudentsInput: GetSchoolStudentsInput;
  GetSchoolTeachersInput: GetSchoolTeachersInput;
  GetSubjectInput: GetSubjectInput;
  Group: ResolverTypeWrapper<Group>;
  GroupType: GroupType;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InvitationCodeInput: InvitationCodeInput;
  Lesson: ResolverTypeWrapper<Lesson>;
  LessonResources: ResolverTypeWrapper<LessonResources>;
  LessonStatus: LessonStatus;
  LessonTeacher: ResolverTypeWrapper<LessonTeacher>;
  LessonsData: ResolverTypeWrapper<LessonsData>;
  LessonsEvents: ResolverTypeWrapper<LessonsEvents>;
  LessonsList: ResolverTypeWrapper<LessonsList>;
  MarkEmployeeAttendanceInput: MarkEmployeeAttendanceInput;
  MarkStudentAttendanceInput: MarkStudentAttendanceInput;
  MonthlyRevenue: ResolverTypeWrapper<MonthlyRevenue>;
  MonthlyStats: ResolverTypeWrapper<MonthlyStats>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PaginationMeta: ResolverTypeWrapper<PaginationMeta>;
  Parent: ResolverTypeWrapper<Parent>;
  ParentList: ResolverTypeWrapper<ParentList>;
  ParentStudent: ResolverTypeWrapper<ParentStudent>;
  ParentStudentInput: ParentStudentInput;
  Person: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Person']>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RelationType: RelationType;
  ResourceMode: ResourceMode;
  Role: Role;
  Room: ResolverTypeWrapper<Room>;
  RoomList: ResolverTypeWrapper<RoomList>;
  School: ResolverTypeWrapper<School>;
  SchoolId: ResolverTypeWrapper<Scalars['SchoolId']['output']>;
  SchoolMembership: ResolverTypeWrapper<SchoolMembership>;
  SchoolRole: SchoolRole;
  SchoolSearchInput: SchoolSearchInput;
  SchoolSettings: ResolverTypeWrapper<SchoolSettings>;
  SchoolStats: ResolverTypeWrapper<SchoolStats>;
  SearchClassesAndSubjects: ResolverTypeWrapper<SearchClassesAndSubjects>;
  SortOrder: SortOrder;
  Staff: ResolverTypeWrapper<Staff>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Student: ResolverTypeWrapper<Student>;
  StudentDisciplinaryAction: ResolverTypeWrapper<StudentDisciplinaryAction>;
  StudentList: ResolverTypeWrapper<StudentList>;
  StudentSearchInput: StudentSearchInput;
  StudentSortField: StudentSortField;
  StudentSortInput: StudentSortInput;
  StudentStatus: StudentStatus;
  Subject: ResolverTypeWrapper<Subject>;
  SubjectAssignments: ResolverTypeWrapper<SubjectAssignments>;
  SubjectCategory: SubjectCategory;
  SubjectList: ResolverTypeWrapper<SubjectList>;
  SubjectSortField: SubjectSortField;
  SubjectSortInput: SubjectSortInput;
  Teacher: ResolverTypeWrapper<Teacher>;
  TeacherAssignments: ResolverTypeWrapper<TeacherAssignments>;
  TeacherList: ResolverTypeWrapper<TeacherList>;
  TeachingTeamMember: ResolverTypeWrapper<TeachingTeamMember>;
  TransportMode: TransportMode;
  UpdateLessonInput: UpdateLessonInput;
  UpdateMode: UpdateMode;
  UpdateStudentParentData: UpdateStudentParentData;
  User: ResolverTypeWrapper<User>;
  UserPayload: ResolverTypeWrapper<UserPayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ApiResponse: ApiResponse;
  Assessment: Assessment;
  AttendanceRecord: Omit<AttendanceRecord, 'person'> & { person?: Maybe<ResolversParentTypes['Person']> };
  AttendanceSessionPayload: AttendanceSessionPayload;
  AttendanceStats: AttendanceStats;
  Boolean: Scalars['Boolean']['output'];
  Class: Class;
  ClassAndSubject: ClassAndSubject;
  ClassCount: ClassCount;
  ClassList: ClassList;
  ClassStats: ClassStats;
  ClassSubject: ClassSubject;
  ClassSubjectInput: ClassSubjectInput;
  ClassTeacher: ClassTeacher;
  CreateClassInput: CreateClassInput;
  CreateGroupInput: CreateGroupInput;
  CreateInvitationInput: CreateInvitationInput;
  CreateLessonInput: CreateLessonInput;
  CreateParentInput: CreateParentInput;
  CreateRoomInput: CreateRoomInput;
  CreateStudentInput: CreateStudentInput;
  CreateSubjectInput: CreateSubjectInput;
  CreateTeacherAssignmentInput: CreateTeacherAssignmentInput;
  CreateTeacherInput: CreateTeacherInput;
  DailyAttendance: DailyAttendance;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  GenderStats: GenderStats;
  GenerateSessionInput: GenerateSessionInput;
  GetAssignmentInput: GetAssignmentInput;
  GetLessonsInput: GetLessonsInput;
  GetSchoolClassesInput: GetSchoolClassesInput;
  GetSchoolParentsInput: GetSchoolParentsInput;
  GetSchoolRoomInput: GetSchoolRoomInput;
  GetSchoolStudentsInput: GetSchoolStudentsInput;
  GetSchoolTeachersInput: GetSchoolTeachersInput;
  GetSubjectInput: GetSubjectInput;
  Group: Group;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InvitationCodeInput: InvitationCodeInput;
  Lesson: Lesson;
  LessonResources: LessonResources;
  LessonTeacher: LessonTeacher;
  LessonsData: LessonsData;
  LessonsEvents: LessonsEvents;
  LessonsList: LessonsList;
  MarkEmployeeAttendanceInput: MarkEmployeeAttendanceInput;
  MarkStudentAttendanceInput: MarkStudentAttendanceInput;
  MonthlyRevenue: MonthlyRevenue;
  MonthlyStats: MonthlyStats;
  Mutation: Record<PropertyKey, never>;
  PaginationMeta: PaginationMeta;
  Parent: Parent;
  ParentList: ParentList;
  ParentStudent: ParentStudent;
  ParentStudentInput: ParentStudentInput;
  Person: ResolversUnionTypes<ResolversParentTypes>['Person'];
  Profile: Profile;
  Query: Record<PropertyKey, never>;
  Role: Role;
  Room: Room;
  RoomList: RoomList;
  School: School;
  SchoolId: Scalars['SchoolId']['output'];
  SchoolMembership: SchoolMembership;
  SchoolSearchInput: SchoolSearchInput;
  SchoolSettings: SchoolSettings;
  SchoolStats: SchoolStats;
  SearchClassesAndSubjects: SearchClassesAndSubjects;
  Staff: Staff;
  String: Scalars['String']['output'];
  Student: Student;
  StudentDisciplinaryAction: StudentDisciplinaryAction;
  StudentList: StudentList;
  StudentSearchInput: StudentSearchInput;
  StudentSortInput: StudentSortInput;
  Subject: Subject;
  SubjectAssignments: SubjectAssignments;
  SubjectList: SubjectList;
  SubjectSortInput: SubjectSortInput;
  Teacher: Teacher;
  TeacherAssignments: TeacherAssignments;
  TeacherList: TeacherList;
  TeachingTeamMember: TeachingTeamMember;
  UpdateLessonInput: UpdateLessonInput;
  UpdateStudentParentData: UpdateStudentParentData;
  User: User;
  UserPayload: UserPayload;
}>;

export type ApiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ApiResponse'] = ResolversParentTypes['ApiResponse']> = ResolversObject<{
  details?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
}>;

export type AssessmentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Assessment'] = ResolversParentTypes['Assessment']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maxScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['AssessmentStatus']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['AssessmentType']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type AttendanceRecordResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AttendanceRecord'] = ResolversParentTypes['AttendanceRecord']> = ResolversObject<{
  checkInTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  recordedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['AttendanceStatus']>, ParentType, ContextType>;
}>;

export type AttendanceSessionPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AttendanceSessionPayload'] = ResolversParentTypes['AttendanceSessionPayload']> = ResolversObject<{
  expiresAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  qrCodeDataUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secretCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type AttendanceStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AttendanceStats'] = ResolversParentTypes['AttendanceStats']> = ResolversObject<{
  absentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  history?: Resolver<Maybe<Array<ResolversTypes['DailyAttendance']>>, ParentType, ContextType>;
  lateCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalExpected?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClassResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Class'] = ResolversParentTypes['Class']> = ResolversObject<{
  _count?: Resolver<Maybe<ResolversTypes['ClassCount']>, ParentType, ContextType>;
  defaultRoom?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  students?: Resolver<Maybe<Array<ResolversTypes['Student']>>, ParentType, ContextType>;
  supervisor?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType>;
  teachingTeamMembers?: Resolver<Maybe<Array<ResolversTypes['TeachingTeamMember']>>, ParentType, ContextType>;
  totalCoefficient?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalWeeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type ClassAndSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassAndSubject'] = ResolversParentTypes['ClassAndSubject']> = ResolversObject<{
  classes?: Resolver<Maybe<Array<ResolversTypes['Class']>>, ParentType, ContextType>;
  subjects?: Resolver<Maybe<Array<ResolversTypes['Subject']>>, ParentType, ContextType>;
}>;

export type ClassCountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassCount'] = ResolversParentTypes['ClassCount']> = ResolversObject<{
  students?: Resolver<Maybe<ResolversTypes['GenderStats']>, ParentType, ContextType>;
  subjects?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teachers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type ClassListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassList'] = ResolversParentTypes['ClassList']> = ResolversObject<{
  data?: Resolver<Maybe<Array<ResolversTypes['Class']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type ClassStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassStats'] = ResolversParentTypes['ClassStats']> = ResolversObject<{
  className?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClassSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassSubject'] = ResolversParentTypes['ClassSubject']> = ResolversObject<{
  assessments?: Resolver<Maybe<Array<ResolversTypes['Assessment']>>, ParentType, ContextType>;
  assignment?: Resolver<Maybe<ResolversTypes['TeacherAssignments']>, ParentType, ContextType>;
  coefficient?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  subjectId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  teacherId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  weeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type ClassTeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassTeacher'] = ResolversParentTypes['ClassTeacher']> = ResolversObject<{
  classes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Class']>>>, ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<ResolversTypes['Group']>>, ParentType, ContextType>;
  schoolId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  teacher?: Resolver<Maybe<Array<Maybe<ResolversTypes['Teacher']>>>, ParentType, ContextType>;
}>;

export type DailyAttendanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DailyAttendance'] = ResolversParentTypes['DailyAttendance']> = ResolversObject<{
  absent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  late?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  present?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DayResolvers = EnumResolverSignature<{ FRIDAY?: any, MONDAY?: any, SATURDAY?: any, SUNDAY?: any, THURSDAY?: any, TUESDAY?: any, WEDNESDAY?: any }, ResolversTypes['Day']>;

export type GenderResolvers = EnumResolverSignature<{ FEMALE?: any, MALE?: any }, ResolversTypes['Gender']>;

export type GenderStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenderStats'] = ResolversParentTypes['GenderStats']> = ResolversObject<{
  female?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  male?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = ResolversObject<{
  classSubjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['ClassSubject']>>>, ParentType, ContextType>;
  classes?: Resolver<Array<ResolversTypes['Class']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['GroupType']>, ParentType, ContextType>;
}>;

export type GroupTypeResolvers = EnumResolverSignature<{ MULTIPLE?: any, SOLO?: any }, ResolversTypes['GroupType']>;

export type LessonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Lesson'] = ResolversParentTypes['Lesson']> = ResolversObject<{
  day?: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['LessonStatus'], ParentType, ContextType>;
  teacherAssignment?: Resolver<Maybe<ResolversTypes['TeacherAssignments']>, ParentType, ContextType>;
  teacherAssignmentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type LessonResourcesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LessonResources'] = ResolversParentTypes['LessonResources']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weeklyHours?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type LessonStatusResolvers = EnumResolverSignature<{ CANCELLED?: any, COMPLETED?: any, ONGOING?: any, PLANNED?: any, POSTPONED?: any }, ResolversTypes['LessonStatus']>;

export type LessonTeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LessonTeacher'] = ResolversParentTypes['LessonTeacher']> = ResolversObject<{
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type LessonsDataResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LessonsData'] = ResolversParentTypes['LessonsData']> = ResolversObject<{
  events?: Resolver<Maybe<Array<ResolversTypes['LessonsEvents']>>, ParentType, ContextType>;
  resources?: Resolver<Maybe<Array<ResolversTypes['LessonResources']>>, ParentType, ContextType>;
}>;

export type LessonsEventsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LessonsEvents'] = ResolversParentTypes['LessonsEvents']> = ResolversObject<{
  day?: Resolver<ResolversTypes['Day'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resourceId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['LessonStatus']>, ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  teacher?: Resolver<Maybe<ResolversTypes['LessonTeacher']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type LessonsListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LessonsList'] = ResolversParentTypes['LessonsList']> = ResolversObject<{
  data?: Resolver<ResolversTypes['LessonsData'], ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['PaginationMeta']>, ParentType, ContextType>;
}>;

export type MonthlyRevenueResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthlyRevenue'] = ResolversParentTypes['MonthlyRevenue']> = ResolversObject<{
  currentMonth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  previousMonth?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type MonthlyStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthlyStats'] = ResolversParentTypes['MonthlyStats']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmCompleteProfile?: Resolver<Maybe<ResolversTypes['UserPayload']>, ParentType, ContextType>;
  createClass?: Resolver<ResolversTypes['Class'], ParentType, ContextType, RequireFields<MutationCreateClassArgs, 'data'>>;
  createClassSubject?: Resolver<ResolversTypes['ClassSubject'], ParentType, ContextType, RequireFields<MutationCreateClassSubjectArgs, 'input'>>;
  createGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'input'>>;
  createLesson?: Resolver<Maybe<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<MutationCreateLessonArgs, 'input'>>;
  createListStudent?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationCreateListStudentArgs, 'data' | 'schoolId'>>;
  createParent?: Resolver<ResolversTypes['Parent'], ParentType, ContextType, RequireFields<MutationCreateParentArgs, 'input'>>;
  createRoom?: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'input'>>;
  createSubject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<MutationCreateSubjectArgs, 'input'>>;
  createTeacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, Partial<MutationCreateTeacherArgs>>;
  createTeacherAssignment?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationCreateTeacherAssignmentArgs, 'input'>>;
  deleteClassSubjects?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteClassSubjectsArgs, 'ids'>>;
  deleteClasses?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteClassesArgs, 'classIds' | 'schoolId'>>;
  deleteLesson?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteLessonArgs, 'id'>>;
  deleteStudents?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteStudentsArgs, 'schoolId' | 'soft' | 'studentIds'>>;
  deleteSubjects?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSubjectsArgs, 'subjectIds'>>;
  deleteTeacherAssignment?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteTeacherAssignmentArgs, 'id'>>;
  deleteTeachers?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteTeachersArgs, 'soft' | 'teacherIds'>>;
  generateAttendanceSession?: Resolver<ResolversTypes['AttendanceSessionPayload'], ParentType, ContextType, RequireFields<MutationGenerateAttendanceSessionArgs, 'input'>>;
  markEmployeeAttendance?: Resolver<ResolversTypes['AttendanceRecord'], ParentType, ContextType, RequireFields<MutationMarkEmployeeAttendanceArgs, 'input'>>;
  markStudentAttendance?: Resolver<ResolversTypes['AttendanceRecord'], ParentType, ContextType, RequireFields<MutationMarkStudentAttendanceArgs, 'input'>>;
  registerPresence?: Resolver<ResolversTypes['AttendanceRecord'], ParentType, ContextType, RequireFields<MutationRegisterPresenceArgs, 'sessionId'>>;
  syncTeacherAssignment?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationSyncTeacherAssignmentArgs, 'input'>>;
  updateClass?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationUpdateClassArgs, 'classId' | 'data' | 'schoolId'>>;
  updateClassSubject?: Resolver<ResolversTypes['ClassSubject'], ParentType, ContextType, RequireFields<MutationUpdateClassSubjectArgs, 'input'>>;
  updateLesson?: Resolver<Maybe<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<MutationUpdateLessonArgs, 'input'>>;
  updateLessonStatus?: Resolver<Maybe<ResolversTypes['Lesson']>, ParentType, ContextType, RequireFields<MutationUpdateLessonStatusArgs, 'id' | 'status'>>;
  updateRoom?: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationUpdateRoomArgs, 'input'>>;
  updateStudent?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<MutationUpdateStudentArgs, 'data' | 'schoolId' | 'studentId'>>;
  updateTeacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, RequireFields<MutationUpdateTeacherArgs, 'data' | 'teacherId'>>;
}>;

export type PaginationMetaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PaginationMeta'] = ResolversParentTypes['PaginationMeta']> = ResolversObject<{
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ParentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Parent'] = ResolversParentTypes['Parent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDelegate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  parentStudent?: Resolver<Maybe<Array<Maybe<ResolversTypes['ParentStudent']>>>, ParentType, ContextType>;
  profession?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schoolUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type ParentListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ParentList'] = ResolversParentTypes['ParentList']> = ResolversObject<{
  data?: Resolver<Maybe<Array<ResolversTypes['Parent']>>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['PaginationMeta']>, ParentType, ContextType>;
}>;

export type ParentStudentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ParentStudent'] = ResolversParentTypes['ParentStudent']> = ResolversObject<{
  parent?: Resolver<Maybe<ResolversTypes['Parent']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  relationType?: Resolver<Maybe<ResolversTypes['RelationType']>, ParentType, ContextType>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType>;
  studentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
}>;

export type PersonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Staff' | 'Student' | 'Teacher', ParentType, ContextType>;
}>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  class?: Resolver<Maybe<ResolversTypes['Class']>, ParentType, ContextType, RequireFields<QueryClassArgs, 'id'>>;
  getAssignments?: Resolver<Maybe<Array<ResolversTypes['TeacherAssignments']>>, ParentType, ContextType, RequireFields<QueryGetAssignmentsArgs, 'filter'>>;
  getClassSubjects?: Resolver<Maybe<Array<ResolversTypes['ClassSubject']>>, ParentType, ContextType, Partial<QueryGetClassSubjectsArgs>>;
  getLessons?: Resolver<Maybe<ResolversTypes['LessonsList']>, ParentType, ContextType, RequireFields<QueryGetLessonsArgs, 'filter'>>;
  getSchoolClasses?: Resolver<ResolversTypes['ClassList'], ParentType, ContextType, RequireFields<QueryGetSchoolClassesArgs, 'input'>>;
  getSchoolParents?: Resolver<Maybe<ResolversTypes['ParentList']>, ParentType, ContextType, RequireFields<QueryGetSchoolParentsArgs, 'filter'>>;
  getSchoolRooms?: Resolver<ResolversTypes['RoomList'], ParentType, ContextType, RequireFields<QueryGetSchoolRoomsArgs, 'filter'>>;
  getSchoolStudents?: Resolver<ResolversTypes['StudentList'], ParentType, ContextType, RequireFields<QueryGetSchoolStudentsArgs, 'input'>>;
  getSchoolSubjects?: Resolver<Maybe<ResolversTypes['SubjectList']>, ParentType, ContextType, RequireFields<QueryGetSchoolSubjectsArgs, 'input'>>;
  getSchoolTeachers?: Resolver<ResolversTypes['TeacherList'], ParentType, ContextType, RequireFields<QueryGetSchoolTeachersArgs, 'input'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  school?: Resolver<ResolversTypes['School'], ParentType, ContextType, RequireFields<QuerySchoolArgs, 'schoolId'>>;
  searchSchool?: Resolver<Maybe<Array<ResolversTypes['School']>>, ParentType, ContextType, RequireFields<QuerySearchSchoolArgs, 'filter'>>;
  searchStudent?: Resolver<Maybe<Array<ResolversTypes['Student']>>, ParentType, ContextType, RequireFields<QuerySearchStudentArgs, 'filter'>>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<QueryStudentArgs, 'id'>>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, RequireFields<QueryTeacherArgs, 'id'>>;
  verifyInvitationCode?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryVerifyInvitationCodeArgs, 'code'>>;
}>;

export type RelationTypeResolvers = EnumResolverSignature<{ AUNT?: any, FATHER?: any, GRAND_FATHER?: any, GRAND_MOTHER?: any, GUARDIAN?: any, MOTHER?: any, OTHER?: any, UNCLE?: any }, ResolversTypes['RelationType']>;

export type RoomResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = ResolversObject<{
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  class?: Resolver<Maybe<Array<Maybe<ResolversTypes['Class']>>>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  defaultForClass?: Resolver<Maybe<ResolversTypes['Class']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type RoomListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RoomList'] = ResolversParentTypes['RoomList']> = ResolversObject<{
  data?: Resolver<Array<Maybe<ResolversTypes['Room']>>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['PaginationMeta']>, ParentType, ContextType>;
}>;

export type SchoolResolvers<ContextType = Context, ParentType extends ResolversParentTypes['School'] = ResolversParentTypes['School']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['SchoolSettings']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['SchoolStats']>, ParentType, ContextType>;
  teachers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Teacher']>>>, ParentType, ContextType>;
}>;

export interface SchoolIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SchoolId'], any> {
  name: 'SchoolId';
}

export type SchoolMembershipResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SchoolMembership'] = ResolversParentTypes['SchoolMembership']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Parent']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  school?: Resolver<ResolversTypes['School'], ParentType, ContextType>;
  staff?: Resolver<Maybe<ResolversTypes['Staff']>, ParentType, ContextType>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType>;
}>;

export type SchoolSettingsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SchoolSettings'] = ResolversParentTypes['SchoolSettings']> = ResolversObject<{
  daysOfWeek?: Resolver<Maybe<Array<Maybe<ResolversTypes['Day']>>>, ParentType, ContextType>;
  endHour?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lessonDuration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  schoolId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  startHour?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type SchoolStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SchoolStats'] = ResolversParentTypes['SchoolStats']> = ResolversObject<{
  attendance?: Resolver<Maybe<ResolversTypes['AttendanceStats']>, ParentType, ContextType>;
  classesOccupancy?: Resolver<Maybe<Array<ResolversTypes['ClassStats']>>, ParentType, ContextType>;
  enrollmentPerMonth?: Resolver<Maybe<Array<ResolversTypes['MonthlyStats']>>, ParentType, ContextType>;
  monthlyRevenue?: Resolver<Maybe<ResolversTypes['MonthlyRevenue']>, ParentType, ContextType>;
  pendingPaymentsCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  studentGender?: Resolver<Maybe<ResolversTypes['GenderStats']>, ParentType, ContextType>;
  totalClasses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalStudents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTeachers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SearchClassesAndSubjectsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SearchClassesAndSubjects'] = ResolversParentTypes['SearchClassesAndSubjects']> = ResolversObject<{
  searchClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['Class']>>>, ParentType, ContextType, Partial<SearchClassesAndSubjectsSearchClassesArgs>>;
  searchSubjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subject']>>>, ParentType, ContextType, Partial<SearchClassesAndSubjectsSearchSubjectsArgs>>;
}>;

export type StaffResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Staff'] = ResolversParentTypes['Staff']> = ResolversObject<{
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  allergies?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birthCertificateNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  birthPlace?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  bloodGroup?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  disciplinaryActions?: Resolver<Maybe<ResolversTypes['StudentDisciplinaryAction']>, ParentType, ContextType>;
  enrollmentDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  enrollmentYear?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  matricule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  medicalCondition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nationality?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parentStudent?: Resolver<Maybe<Array<Maybe<ResolversTypes['ParentStudent']>>>, ParentType, ContextType>;
  previousClass?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previousSchool?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  schoolClass?: Resolver<Maybe<ResolversTypes['Class']>, ParentType, ContextType>;
  schoolUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['StudentStatus']>, ParentType, ContextType>;
  studentNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  transportMode?: Resolver<Maybe<ResolversTypes['TransportMode']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentDisciplinaryActionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StudentDisciplinaryAction'] = ResolversParentTypes['StudentDisciplinaryAction']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  studentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['DisciplinaryType']>, ParentType, ContextType>;
}>;

export type StudentListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StudentList'] = ResolversParentTypes['StudentList']> = ResolversObject<{
  data?: Resolver<Maybe<Array<ResolversTypes['Student']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type StudentStatusResolvers = EnumResolverSignature<{ ACTIVE?: any, DECEASED?: any, DROPPED_OUT?: any, EXPELLED?: any, GRADUATED?: any, INACTIVE?: any, SUSPENDED?: any, TRANSFERRED?: any }, ResolversTypes['StudentStatus']>;

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['SubjectCategory']>, ParentType, ContextType>;
  classSubject?: Resolver<Maybe<Array<Maybe<ResolversTypes['ClassSubject']>>>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mainTeacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType>;
  mainTeacherId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalWeeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type SubjectAssignmentsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectAssignments'] = ResolversParentTypes['SubjectAssignments']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
}>;

export type SubjectCategoryResolvers = EnumResolverSignature<{ GENERAL?: any, LITERARY?: any, SCIENTIFIC?: any, SPORT?: any }, ResolversTypes['SubjectCategory']>;

export type SubjectListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectList'] = ResolversParentTypes['SubjectList']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Subject']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  assignments?: Resolver<Maybe<Array<Maybe<ResolversTypes['TeacherAssignments']>>>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  diploma?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  experience?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  specialization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supervisedClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['Class']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  weeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeacherAssignmentsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeacherAssignments'] = ResolversParentTypes['TeacherAssignments']> = ResolversObject<{
  classSubjectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  classSubjects?: Resolver<Maybe<ResolversTypes['ClassSubject']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<ResolversTypes['Lesson']>>, ParentType, ContextType>;
  schoolId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType>;
  teacherId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type TeacherListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeacherList'] = ResolversParentTypes['TeacherList']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Teacher']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type TeachingTeamMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeachingTeamMember'] = ResolversParentTypes['TeachingTeamMember']> = ResolversObject<{
  assignments?: Resolver<Array<ResolversTypes['SubjectAssignments']>, ParentType, ContextType>;
  teacher?: Resolver<ResolversTypes['Teacher'], ParentType, ContextType>;
}>;

export type TransportModeResolvers = EnumResolverSignature<{ BUS?: any, CAR?: any, MOTO?: any, OTHER?: any, PARENT?: any, TAXI?: any, WALK?: any }, ResolversTypes['TransportMode']>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasMembership?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  memberships?: Resolver<Maybe<Array<Maybe<ResolversTypes['SchoolMembership']>>>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileCompleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  schoolContext?: Resolver<Maybe<ResolversTypes['SchoolMembership']>, ParentType, ContextType, Partial<UserSchoolContextArgs>>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserPayload'] = ResolversParentTypes['UserPayload']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  ApiResponse?: ApiResponseResolvers<ContextType>;
  Assessment?: AssessmentResolvers<ContextType>;
  AttendanceRecord?: AttendanceRecordResolvers<ContextType>;
  AttendanceSessionPayload?: AttendanceSessionPayloadResolvers<ContextType>;
  AttendanceStats?: AttendanceStatsResolvers<ContextType>;
  Class?: ClassResolvers<ContextType>;
  ClassAndSubject?: ClassAndSubjectResolvers<ContextType>;
  ClassCount?: ClassCountResolvers<ContextType>;
  ClassList?: ClassListResolvers<ContextType>;
  ClassStats?: ClassStatsResolvers<ContextType>;
  ClassSubject?: ClassSubjectResolvers<ContextType>;
  ClassTeacher?: ClassTeacherResolvers<ContextType>;
  DailyAttendance?: DailyAttendanceResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Day?: DayResolvers;
  Gender?: GenderResolvers;
  GenderStats?: GenderStatsResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupType?: GroupTypeResolvers;
  Lesson?: LessonResolvers<ContextType>;
  LessonResources?: LessonResourcesResolvers<ContextType>;
  LessonStatus?: LessonStatusResolvers;
  LessonTeacher?: LessonTeacherResolvers<ContextType>;
  LessonsData?: LessonsDataResolvers<ContextType>;
  LessonsEvents?: LessonsEventsResolvers<ContextType>;
  LessonsList?: LessonsListResolvers<ContextType>;
  MonthlyRevenue?: MonthlyRevenueResolvers<ContextType>;
  MonthlyStats?: MonthlyStatsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationMeta?: PaginationMetaResolvers<ContextType>;
  Parent?: ParentResolvers<ContextType>;
  ParentList?: ParentListResolvers<ContextType>;
  ParentStudent?: ParentStudentResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RelationType?: RelationTypeResolvers;
  Room?: RoomResolvers<ContextType>;
  RoomList?: RoomListResolvers<ContextType>;
  School?: SchoolResolvers<ContextType>;
  SchoolId?: GraphQLScalarType;
  SchoolMembership?: SchoolMembershipResolvers<ContextType>;
  SchoolSettings?: SchoolSettingsResolvers<ContextType>;
  SchoolStats?: SchoolStatsResolvers<ContextType>;
  SearchClassesAndSubjects?: SearchClassesAndSubjectsResolvers<ContextType>;
  Staff?: StaffResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  StudentDisciplinaryAction?: StudentDisciplinaryActionResolvers<ContextType>;
  StudentList?: StudentListResolvers<ContextType>;
  StudentStatus?: StudentStatusResolvers;
  Subject?: SubjectResolvers<ContextType>;
  SubjectAssignments?: SubjectAssignmentsResolvers<ContextType>;
  SubjectCategory?: SubjectCategoryResolvers;
  SubjectList?: SubjectListResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
  TeacherAssignments?: TeacherAssignmentsResolvers<ContextType>;
  TeacherList?: TeacherListResolvers<ContextType>;
  TeachingTeamMember?: TeachingTeamMemberResolvers<ContextType>;
  TransportMode?: TransportModeResolvers;
  User?: UserResolvers<ContextType>;
  UserPayload?: UserPayloadResolvers<ContextType>;
}>;

