import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '@stackschool/contracts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  DateTime: { input: Date; output: Date; }
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['ID']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
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

export type AssessmentStatus =
  | 'CLOSED'
  | 'DRAFT'
  | 'PUBLISHED';

export type AssessmentType =
  | 'ASSIGNMENT'
  | 'EXAM'
  | 'ORAL'
  | 'PRACTICAL'
  | 'QUIZ'
  | 'TEST';

export type Class = {
  __typename?: 'Class';
  defaultRoom?: Maybe<Room>;
  group?: Maybe<Group>;
  groupId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['String']['output'];
  name: Scalars['String']['output'];
  section?: Maybe<Scalars['String']['output']>;
  statistics?: Maybe<ClassStatistics>;
  students?: Maybe<Array<Student>>;
  supervisor?: Maybe<Teacher>;
  teachingTeamMembers?: Maybe<Array<TeacherAssignment>>;
  totalCoefficient?: Maybe<Scalars['Int']['output']>;
  totalWeeklyHours?: Maybe<Scalars['Float']['output']>;
};

export type ClassAndSubject = {
  __typename?: 'ClassAndSubject';
  classes?: Maybe<Array<Class>>;
  subjects?: Maybe<Array<Subject>>;
};

export type ClassLessons = {
  __typename?: 'ClassLessons';
  classSubject?: Maybe<ClassSubject>;
  lesson?: Maybe<Lesson>;
};

export type ClassList = {
  __typename?: 'ClassList';
  data?: Maybe<Array<Class>>;
  meta: PaginationMeta;
};

export type ClassStatistics = {
  __typename?: 'ClassStatistics';
  students: GenderStats;
  subjects: Scalars['Int']['output'];
  teachers: Scalars['Int']['output'];
};

export type ClassStats = {
  __typename?: 'ClassStats';
  className: Scalars['String']['output'];
  studentCount: Scalars['Int']['output'];
};

export type ClassSubject = {
  __typename?: 'ClassSubject';
  assessments?: Maybe<Array<Assessment>>;
  assignment?: Maybe<TeacherAssignment>;
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
  firstName: Scalars['String']['input'];
  isDelegate?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
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
  firstName: Scalars['String']['input'];
  gender: Gender;
  lastName: Scalars['String']['input'];
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
  firstName: Scalars['String']['input'];
  gender: Gender;
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  specialization: Scalars['String']['input'];
};

export type Day =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY';

export type DisciplinaryType =
  | 'EXPULSION'
  | 'SUSPENSION'
  | 'WARNING';

export type Gender =
  | 'FEMALE'
  | 'MALE';

export type GenderStats = {
  __typename?: 'GenderStats';
  female: Scalars['Int']['output'];
  male: Scalars['Int']['output'];
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
  section?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<LessonStatus>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type GetSchoolClassesInput = {
  level?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  schoolId?: InputMaybe<Scalars['ID']['input']>;
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

export type GroupType =
  | 'MULTIPLE'
  | 'SOLO';

export type Lesson = {
  __typename?: 'Lesson';
  day?: Maybe<Day>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  room?: Maybe<Room>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  status: LessonStatus;
  teacherAssignment?: Maybe<TeacherAssignment>;
  teacherAssignmentId: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type LessonResources = {
  __typename?: 'LessonResources';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  weeklyHours?: Maybe<Scalars['Int']['output']>;
};

export type LessonStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'ONGOING'
  | 'PLANNED'
  | 'POSTPONED';

export type LessonTeacher = {
  __typename?: 'LessonTeacher';
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
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

export type Member = Parent | Staff | Student | Teacher;

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
  schoolProfile?: Maybe<SchoolProfile>;
  schoolUserId?: Maybe<Scalars['ID']['output']>;
};

export type ParentList = {
  __typename?: 'ParentList';
  data?: Maybe<Array<Parent>>;
  meta?: Maybe<PaginationMeta>;
};

export type ParentStudent = {
  __typename?: 'ParentStudent';
  id: Scalars['ID']['output'];
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

export type ParentStudentUpdateMode =
  | 'CONNECT'
  | 'CREATE';

export type Permission = {
  __typename?: 'Permission';
  code?: Maybe<PermissionCode>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  module?: Maybe<PermissionModule>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PermissionCode =
  | 'CREATE_USER'
  | 'DELETE_USER'
  | 'INPUT_GRADES'
  | 'MANAGE_PAYMENTS'
  | 'MANAGE_SUBJECTS'
  | 'MANAGE_USER_PERMISSIONS'
  | 'MARK_STAFF_ATTENDANCE'
  | 'MARK_STUDENT_ATTENDANCE'
  | 'MARK_TEACHER_ATTENDANCE'
  | 'PUBLISH_BULLETINS'
  | 'UPDATE_USER'
  | 'VIEW_ATTENDANCE_REPORTS'
  | 'VIEW_FINANCIAL_REPORTS';

export type PermissionModule =
  | 'ACADEMICS'
  | 'ATTENDANCE'
  | 'FINANCE'
  | 'SETTINGS'
  | 'USERS';

export type Profile = {
  __typename?: 'Profile';
  address?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  class?: Maybe<Class>;
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
};


export type QueryClassArgs = {
  id: Scalars['ID']['input'];
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

export type RelationType =
  | 'AUNT'
  | 'FATHER'
  | 'GRAND_FATHER'
  | 'GRAND_MOTHER'
  | 'GUARDIAN'
  | 'MOTHER'
  | 'OTHER'
  | 'UNCLE';

export type ResourceMode =
  | 'CLASS'
  | 'TEACHER';

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
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
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
  isActive: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  member?: Maybe<Member>;
  parent?: Maybe<Parent>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  role: SchoolRole;
  school?: Maybe<School>;
  schoolId?: Maybe<Scalars['ID']['output']>;
  schoolProfile?: Maybe<SchoolProfile>;
  staff?: Maybe<Staff>;
  student?: Maybe<Student>;
  teacher?: Maybe<Teacher>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type SchoolProfile = {
  __typename?: 'SchoolProfile';
  address?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender: Gender;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  schoolId: Scalars['ID']['output'];
  schoolUserId: Scalars['ID']['output'];
};

export type SchoolRole =
  | 'ADMIN'
  | 'PARENT'
  | 'STAFF'
  | 'STUDENT'
  | 'TEACHER';

export type SchoolSearchInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};

export type SchoolSettings = {
  __typename?: 'SchoolSettings';
  daysOfWeek?: Maybe<Array<Maybe<Day>>>;
  endHour?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lessonDuration?: Maybe<Scalars['Int']['output']>;
  schoolId?: Maybe<Scalars['ID']['output']>;
  startHour?: Maybe<Scalars['Int']['output']>;
};

export type SchoolStats = {
  __typename?: 'SchoolStats';
  classesOccupancy?: Maybe<Array<Maybe<ClassStats>>>;
  enrollmentPerMonth?: Maybe<Array<MonthlyStats>>;
  id: Scalars['ID']['output'];
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

export type SortOrder =
  | 'ASC'
  | 'DESC';

export type Staff = {
  __typename?: 'Staff';
  SchoolProfile?: Maybe<SchoolProfile>;
  department?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  salary?: Maybe<Scalars['Float']['output']>;
  schoolUser?: Maybe<SchoolMembership>;
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
  profileId?: Maybe<Scalars['ID']['output']>;
  schoolClass?: Maybe<Class>;
  schoolProfile?: Maybe<SchoolProfile>;
  schoolUser?: Maybe<SchoolMembership>;
  schoolUserId?: Maybe<Scalars['ID']['output']>;
  status?: Maybe<StudentStatus>;
  studentNumber?: Maybe<Scalars['Int']['output']>;
  transportMode?: Maybe<TransportMode>;
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

export type StudentSortField =
  | 'enrolementYear'
  | 'firstname'
  | 'lastname';

export type StudentSortInput = {
  field?: InputMaybe<StudentSortField>;
  order?: InputMaybe<SortOrder>;
};

export type StudentStatus =
  | 'ACTIVE'
  | 'DECEASED'
  | 'DROPPED_OUT'
  | 'EXPELLED'
  | 'GRADUATED'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'TRANSFERRED';

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

export type SubjectCategory =
  | 'GENERAL'
  | 'LITERARY'
  | 'SCIENTIFIC'
  | 'SPORT';

export type SubjectList = {
  __typename?: 'SubjectList';
  data: Array<Subject>;
  meta: PaginationMeta;
};

export type Teacher = {
  __typename?: 'Teacher';
  assignments?: Maybe<Array<Maybe<TeacherAssignment>>>;
  bio?: Maybe<Scalars['String']['output']>;
  classesCount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  diploma?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  schoolProfile?: Maybe<SchoolProfile>;
  schoolUser?: Maybe<SchoolMembership>;
  schoolUserId?: Maybe<Scalars['ID']['output']>;
  specialization?: Maybe<Scalars['String']['output']>;
  supervisedClasses?: Maybe<Array<Maybe<Class>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  weeklyHours?: Maybe<Scalars['Float']['output']>;
};

export type TeacherAssignment = {
  __typename?: 'TeacherAssignment';
  classSubject?: Maybe<ClassSubject>;
  classSubjectId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  schoolId?: Maybe<Scalars['ID']['output']>;
  teacher?: Maybe<Teacher>;
  teacherId: Scalars['ID']['output'];
};

export type TeacherList = {
  __typename?: 'TeacherList';
  data: Array<Teacher>;
  meta: PaginationMeta;
};

export type TeacherTodaySubject = {
  __typename?: 'TeacherTodaySubject';
  teachers?: Maybe<Teacher>;
};

export type TransportMode =
  | 'BUS'
  | 'CAR'
  | 'MOTO'
  | 'OTHER'
  | 'PARENT'
  | 'TAXI'
  | 'WALK';

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

export type UpdateStudentParentData = {
  mode?: InputMaybe<ParentStudentUpdateMode>;
  newParent?: InputMaybe<CreateParentInput>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  accounts?: Maybe<Array<Maybe<Account>>>;
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
  schoolId: Scalars['ID']['input'];
};

export type GetClassesOptionsQueryVariables = Exact<{
  input: GetSchoolClassesInput;
  withMeta?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetClassesOptionsQuery = { __typename?: 'Query', getSchoolClasses: { __typename?: 'ClassList', meta?: { __typename?: 'PaginationMeta', limit: number, totalPages: number, total: number }, data?: Array<{ __typename?: 'Class', id: string, level: string, name: string, section?: string | null, group?: { __typename?: 'Group', id: string, name: string, type?: GroupType | null } | null }> | null } };

export type UpdateClassMutationVariables = Exact<{
  classId: Scalars['ID']['input'];
  data: CreateClassInput;
  schoolId: Scalars['ID']['input'];
}>;


export type UpdateClassMutation = { __typename?: 'Mutation', updateClass?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type DeleteClassesMutationVariables = Exact<{
  classIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  schoolId: Scalars['ID']['input'];
}>;


export type DeleteClassesMutation = { __typename?: 'Mutation', deleteClasses?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type BasicProfileFragment = { __typename?: 'Profile', id: string, firstName: string, lastName: string, avatarUrl?: string | null, gender?: Gender | null };

export type GetAdminDashboardStatsQueryVariables = Exact<{
  schoolId: Scalars['ID']['input'];
}>;


export type GetAdminDashboardStatsQuery = { __typename?: 'Query', school: { __typename?: 'School', id: string, name: string, logo?: string | null, stats?: { __typename?: 'SchoolStats', totalStudents: number, totalTeachers: number, totalClasses: number, pendingPaymentsCount?: number | null, monthlyRevenue?: { __typename?: 'MonthlyRevenue', previousMonth?: number | null, currentMonth: number } | null, studentGender?: { __typename?: 'GenderStats', male: number, female: number } | null, classesOccupancy?: Array<{ __typename?: 'ClassStats', className: string, studentCount: number } | null> | null, enrollmentPerMonth?: Array<{ __typename?: 'MonthlyStats', month: string, count: number }> | null } | null } };

export type GetDashboardContextQueryVariables = Exact<{
  input: Scalars['ID']['input'];
}>;


export type GetDashboardContextQuery = { __typename?: 'Query', me?: { __typename?: 'User', schoolContext?: { __typename?: 'SchoolMembership', id: string, role: SchoolRole, permissions?: Array<{ __typename?: 'Permission', id: string, code?: PermissionCode | null, name?: string | null, description?: string | null, module?: PermissionModule | null } | null> | null, teacher?: { __typename?: 'Teacher', id: string, department?: string | null, specialization?: string | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, section?: string | null } | null> | null } | null, staff?: { __typename?: 'Staff', id: string, position: string, department?: string | null, schoolUserId: string } | null, parent?: { __typename?: 'Parent', id: string, isDelegate?: boolean | null, parentStudent?: Array<{ __typename?: 'ParentStudent', student?: { __typename?: 'Student', id: string, matricule: string } | null } | null> | null } | null, student?: { __typename?: 'Student', id: string, matricule: string } | null } | null } | null };

export type SearchSchoolQueryVariables = Exact<{
  input: SchoolSearchInput;
}>;


export type SearchSchoolQuery = { __typename?: 'Query', searchSchool?: Array<{ __typename?: 'School', id: string, name: string, address: string, code: string, logo?: string | null }> | null };

export type SearchStudentQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type SearchStudentQuery = { __typename?: 'Query', searchStudent?: Array<{ __typename?: 'Student', id: string, matricule: string, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', profile?: { __typename?: 'Profile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null, schoolClass?: { __typename?: 'Class', name: string } | null }> | null };

export type GetSubjectsOptionsQueryVariables = Exact<{
  input: GetSubjectInput;
}>;


export type GetSubjectsOptionsQuery = { __typename?: 'Query', getSchoolSubjects?: { __typename?: 'SubjectList', data: Array<{ __typename?: 'Subject', id: string, name: string, code?: string | null }> } | null };

export type GetSchoolTeachersQueryVariables = Exact<{
  input: GetSchoolTeachersInput;
}>;


export type GetSchoolTeachersQuery = { __typename?: 'Query', getSchoolTeachers: { __typename?: 'TeacherList', meta: { __typename?: 'PaginationMeta', limit: number, total: number, totalPages: number }, data: Array<{ __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group: { __typename?: 'Group', type?: GroupType | null, classes: Array<{ __typename?: 'Class', id: string, name: string }> }, subject: { __typename?: 'Subject', id: string, name: string } } | null } | null> | null }> } };

export type CreateTeacherMutationVariables = Exact<{
  input: CreateTeacherInput;
}>;


export type CreateTeacherMutation = { __typename?: 'Mutation', createTeacher?: { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group: { __typename?: 'Group', type?: GroupType | null, classes: Array<{ __typename?: 'Class', id: string, name: string }> }, subject: { __typename?: 'Subject', id: string, name: string } } | null } | null> | null } | null };

export type DeleteTeachersMutationVariables = Exact<{
  teacherIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  soft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteTeachersMutation = { __typename?: 'Mutation', deleteTeachers?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type UpdateTeacherMutationVariables = Exact<{
  teacherId: Scalars['ID']['input'];
  data: CreateTeacherInput;
}>;


export type UpdateTeacherMutation = { __typename?: 'Mutation', updateTeacher?: { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group: { __typename?: 'Group', type?: GroupType | null, classes: Array<{ __typename?: 'Class', id: string, name: string }> }, subject: { __typename?: 'Subject', id: string, name: string } } | null } | null> | null } | null };

export type TeacherListDataFragment = { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group: { __typename?: 'Group', type?: GroupType | null, classes: Array<{ __typename?: 'Class', id: string, name: string }> }, subject: { __typename?: 'Subject', id: string, name: string } } | null } | null> | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username?: string | null, phoneNumber?: string | null, email?: string | null, profileCompleted?: boolean | null, hasMembership?: boolean | null, profile?: { __typename?: 'Profile', id: string, address?: string | null, firstName: string, lastName: string, gender?: Gender | null, avatarUrl?: string | null } | null, memberships?: Array<{ __typename?: 'SchoolMembership', id: string, role: SchoolRole, isActive: boolean, isOwner: boolean, school?: { __typename?: 'School', id: string, name: string, logo?: string | null, code: string, slug?: string | null, address: string } | null } | null> | null } | null };


export const BasicProfileFragmentDoc = `
    fragment basicProfile on Profile {
  id
  firstName
  lastName
  avatarUrl
  gender
}
    `;
export const TeacherListDataFragmentDoc = `
    fragment TeacherListData on Teacher {
  id
  schoolUserId
  supervisedClasses {
    id
    name
    level
  }
  weeklyHours
  specialization
  diploma
  department
  experience
  isActive
  schoolProfile {
    id
    firstName
    lastName
    gender
    avatarUrl
  }
  schoolUser {
    user {
      email
      phoneNumber
    }
  }
  assignments {
    classSubject {
      group {
        type
        classes {
          id
          name
        }
      }
      subject {
        id
        name
      }
    }
  }
}
    `;
export const GetClassesOptionsDocument = `
    query GetClassesOptions($input: GetSchoolClassesInput!, $withMeta: Boolean = true) {
  getSchoolClasses(input: $input) {
    meta @include(if: $withMeta) {
      limit
      totalPages
      total
    }
    data {
      id
      level
      name
      section
      group {
        id
        name
        type
      }
    }
  }
}
    `;

export const useGetClassesOptionsQuery = <
      TData = GetClassesOptionsQuery,
      TError = unknown
    >(
      variables: GetClassesOptionsQueryVariables,
      options?: Omit<UseQueryOptions<GetClassesOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetClassesOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetClassesOptionsQuery, TError, TData>(
      {
    queryKey: ['GetClassesOptions', variables],
    queryFn: fetcher<GetClassesOptionsQuery, GetClassesOptionsQueryVariables>(GetClassesOptionsDocument, variables),
    ...options
  }
    )};

useGetClassesOptionsQuery.getKey = (variables: GetClassesOptionsQueryVariables) => ['GetClassesOptions', variables];

export const useInfiniteGetClassesOptionsQuery = <
      TData = InfiniteData<GetClassesOptionsQuery>,
      TError = unknown
    >(
      variables: GetClassesOptionsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetClassesOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetClassesOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetClassesOptionsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetClassesOptions.infinite', variables],
      queryFn: (metaData) => fetcher<GetClassesOptionsQuery, GetClassesOptionsQueryVariables>(GetClassesOptionsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetClassesOptionsQuery.getKey = (variables: GetClassesOptionsQueryVariables) => ['GetClassesOptions.infinite', variables];


useGetClassesOptionsQuery.fetcher = (variables: GetClassesOptionsQueryVariables, options?: RequestInit['headers']) => fetcher<GetClassesOptionsQuery, GetClassesOptionsQueryVariables>(GetClassesOptionsDocument, variables, options);

export const UpdateClassDocument = `
    mutation UpdateClass($classId: ID!, $data: CreateClassInput!, $schoolId: ID!) {
  updateClass(classId: $classId, data: $data, schoolId: $schoolId) {
    ok
    message
  }
}
    `;

export const useUpdateClassMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateClassMutation, TError, UpdateClassMutationVariables, TContext>) => {
    
    return useMutation<UpdateClassMutation, TError, UpdateClassMutationVariables, TContext>(
      {
    mutationKey: ['UpdateClass'],
    mutationFn: (variables?: UpdateClassMutationVariables) => fetcher<UpdateClassMutation, UpdateClassMutationVariables>(UpdateClassDocument, variables)(),
    ...options
  }
    )};


useUpdateClassMutation.fetcher = (variables: UpdateClassMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateClassMutation, UpdateClassMutationVariables>(UpdateClassDocument, variables, options);

export const DeleteClassesDocument = `
    mutation DeleteClasses($classIds: [ID!]!, $schoolId: ID!) {
  deleteClasses(classIds: $classIds, schoolId: $schoolId) {
    ok
    message
  }
}
    `;

export const useDeleteClassesMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteClassesMutation, TError, DeleteClassesMutationVariables, TContext>) => {
    
    return useMutation<DeleteClassesMutation, TError, DeleteClassesMutationVariables, TContext>(
      {
    mutationKey: ['DeleteClasses'],
    mutationFn: (variables?: DeleteClassesMutationVariables) => fetcher<DeleteClassesMutation, DeleteClassesMutationVariables>(DeleteClassesDocument, variables)(),
    ...options
  }
    )};


useDeleteClassesMutation.fetcher = (variables: DeleteClassesMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteClassesMutation, DeleteClassesMutationVariables>(DeleteClassesDocument, variables, options);

export const GetAdminDashboardStatsDocument = `
    query GetAdminDashboardStats($schoolId: ID!) {
  school(schoolId: $schoolId) {
    id
    name
    logo
    stats {
      totalStudents
      totalTeachers
      totalClasses
      monthlyRevenue {
        previousMonth
        currentMonth
      }
      pendingPaymentsCount
      studentGender {
        male
        female
      }
      classesOccupancy {
        className
        studentCount
      }
      enrollmentPerMonth {
        month
        count
      }
    }
  }
}
    `;

export const useGetAdminDashboardStatsQuery = <
      TData = GetAdminDashboardStatsQuery,
      TError = unknown
    >(
      variables: GetAdminDashboardStatsQueryVariables,
      options?: Omit<UseQueryOptions<GetAdminDashboardStatsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAdminDashboardStatsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAdminDashboardStatsQuery, TError, TData>(
      {
    queryKey: ['GetAdminDashboardStats', variables],
    queryFn: fetcher<GetAdminDashboardStatsQuery, GetAdminDashboardStatsQueryVariables>(GetAdminDashboardStatsDocument, variables),
    ...options
  }
    )};

useGetAdminDashboardStatsQuery.getKey = (variables: GetAdminDashboardStatsQueryVariables) => ['GetAdminDashboardStats', variables];

export const useInfiniteGetAdminDashboardStatsQuery = <
      TData = InfiniteData<GetAdminDashboardStatsQuery>,
      TError = unknown
    >(
      variables: GetAdminDashboardStatsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetAdminDashboardStatsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetAdminDashboardStatsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetAdminDashboardStatsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetAdminDashboardStats.infinite', variables],
      queryFn: (metaData) => fetcher<GetAdminDashboardStatsQuery, GetAdminDashboardStatsQueryVariables>(GetAdminDashboardStatsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetAdminDashboardStatsQuery.getKey = (variables: GetAdminDashboardStatsQueryVariables) => ['GetAdminDashboardStats.infinite', variables];


useGetAdminDashboardStatsQuery.fetcher = (variables: GetAdminDashboardStatsQueryVariables, options?: RequestInit['headers']) => fetcher<GetAdminDashboardStatsQuery, GetAdminDashboardStatsQueryVariables>(GetAdminDashboardStatsDocument, variables, options);

export const GetDashboardContextDocument = `
    query GetDashboardContext($input: ID!) {
  me {
    schoolContext(schoolId: $input) {
      id
      role
      permissions {
        id
        code
        name
        description
        module
      }
      teacher {
        id
        department
        specialization
        supervisedClasses {
          id
          section
        }
      }
      staff {
        id
        position
        department
        schoolUserId
      }
      parent {
        id
        isDelegate
        parentStudent {
          student {
            id
            matricule
          }
        }
      }
      student {
        id
        matricule
      }
    }
  }
}
    `;

export const useGetDashboardContextQuery = <
      TData = GetDashboardContextQuery,
      TError = unknown
    >(
      variables: GetDashboardContextQueryVariables,
      options?: Omit<UseQueryOptions<GetDashboardContextQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetDashboardContextQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetDashboardContextQuery, TError, TData>(
      {
    queryKey: ['GetDashboardContext', variables],
    queryFn: fetcher<GetDashboardContextQuery, GetDashboardContextQueryVariables>(GetDashboardContextDocument, variables),
    ...options
  }
    )};

useGetDashboardContextQuery.getKey = (variables: GetDashboardContextQueryVariables) => ['GetDashboardContext', variables];

export const useInfiniteGetDashboardContextQuery = <
      TData = InfiniteData<GetDashboardContextQuery>,
      TError = unknown
    >(
      variables: GetDashboardContextQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetDashboardContextQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetDashboardContextQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetDashboardContextQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetDashboardContext.infinite', variables],
      queryFn: (metaData) => fetcher<GetDashboardContextQuery, GetDashboardContextQueryVariables>(GetDashboardContextDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetDashboardContextQuery.getKey = (variables: GetDashboardContextQueryVariables) => ['GetDashboardContext.infinite', variables];


useGetDashboardContextQuery.fetcher = (variables: GetDashboardContextQueryVariables, options?: RequestInit['headers']) => fetcher<GetDashboardContextQuery, GetDashboardContextQueryVariables>(GetDashboardContextDocument, variables, options);

export const SearchSchoolDocument = `
    query SearchSchool($input: SchoolSearchInput!) {
  searchSchool(filter: $input) {
    id
    name
    address
    code
    logo
  }
}
    `;

export const useSearchSchoolQuery = <
      TData = SearchSchoolQuery,
      TError = unknown
    >(
      variables: SearchSchoolQueryVariables,
      options?: Omit<UseQueryOptions<SearchSchoolQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchSchoolQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SearchSchoolQuery, TError, TData>(
      {
    queryKey: ['SearchSchool', variables],
    queryFn: fetcher<SearchSchoolQuery, SearchSchoolQueryVariables>(SearchSchoolDocument, variables),
    ...options
  }
    )};

useSearchSchoolQuery.getKey = (variables: SearchSchoolQueryVariables) => ['SearchSchool', variables];

export const useInfiniteSearchSchoolQuery = <
      TData = InfiniteData<SearchSchoolQuery>,
      TError = unknown
    >(
      variables: SearchSchoolQueryVariables,
      options: Omit<UseInfiniteQueryOptions<SearchSchoolQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<SearchSchoolQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<SearchSchoolQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['SearchSchool.infinite', variables],
      queryFn: (metaData) => fetcher<SearchSchoolQuery, SearchSchoolQueryVariables>(SearchSchoolDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteSearchSchoolQuery.getKey = (variables: SearchSchoolQueryVariables) => ['SearchSchool.infinite', variables];


useSearchSchoolQuery.fetcher = (variables: SearchSchoolQueryVariables, options?: RequestInit['headers']) => fetcher<SearchSchoolQuery, SearchSchoolQueryVariables>(SearchSchoolDocument, variables, options);

export const SearchStudentDocument = `
    query SearchStudent($input: StudentSearchInput!) {
  searchStudent(filter: $input) {
    id
    schoolUser {
      user {
        profile {
          firstName
          lastName
          avatarUrl
        }
      }
    }
    schoolClass {
      name
    }
    matricule
  }
}
    `;

export const useSearchStudentQuery = <
      TData = SearchStudentQuery,
      TError = unknown
    >(
      variables: SearchStudentQueryVariables,
      options?: Omit<UseQueryOptions<SearchStudentQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchStudentQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SearchStudentQuery, TError, TData>(
      {
    queryKey: ['SearchStudent', variables],
    queryFn: fetcher<SearchStudentQuery, SearchStudentQueryVariables>(SearchStudentDocument, variables),
    ...options
  }
    )};

useSearchStudentQuery.getKey = (variables: SearchStudentQueryVariables) => ['SearchStudent', variables];

export const useInfiniteSearchStudentQuery = <
      TData = InfiniteData<SearchStudentQuery>,
      TError = unknown
    >(
      variables: SearchStudentQueryVariables,
      options: Omit<UseInfiniteQueryOptions<SearchStudentQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<SearchStudentQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<SearchStudentQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['SearchStudent.infinite', variables],
      queryFn: (metaData) => fetcher<SearchStudentQuery, SearchStudentQueryVariables>(SearchStudentDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteSearchStudentQuery.getKey = (variables: SearchStudentQueryVariables) => ['SearchStudent.infinite', variables];


useSearchStudentQuery.fetcher = (variables: SearchStudentQueryVariables, options?: RequestInit['headers']) => fetcher<SearchStudentQuery, SearchStudentQueryVariables>(SearchStudentDocument, variables, options);

export const GetSubjectsOptionsDocument = `
    query GetSubjectsOptions($input: GetSubjectInput!) {
  getSchoolSubjects(input: $input) {
    data {
      id
      name
      code
    }
  }
}
    `;

export const useGetSubjectsOptionsQuery = <
      TData = GetSubjectsOptionsQuery,
      TError = unknown
    >(
      variables: GetSubjectsOptionsQueryVariables,
      options?: Omit<UseQueryOptions<GetSubjectsOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSubjectsOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSubjectsOptionsQuery, TError, TData>(
      {
    queryKey: ['GetSubjectsOptions', variables],
    queryFn: fetcher<GetSubjectsOptionsQuery, GetSubjectsOptionsQueryVariables>(GetSubjectsOptionsDocument, variables),
    ...options
  }
    )};

useGetSubjectsOptionsQuery.getKey = (variables: GetSubjectsOptionsQueryVariables) => ['GetSubjectsOptions', variables];

export const useInfiniteGetSubjectsOptionsQuery = <
      TData = InfiniteData<GetSubjectsOptionsQuery>,
      TError = unknown
    >(
      variables: GetSubjectsOptionsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSubjectsOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSubjectsOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSubjectsOptionsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSubjectsOptions.infinite', variables],
      queryFn: (metaData) => fetcher<GetSubjectsOptionsQuery, GetSubjectsOptionsQueryVariables>(GetSubjectsOptionsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSubjectsOptionsQuery.getKey = (variables: GetSubjectsOptionsQueryVariables) => ['GetSubjectsOptions.infinite', variables];


useGetSubjectsOptionsQuery.fetcher = (variables: GetSubjectsOptionsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSubjectsOptionsQuery, GetSubjectsOptionsQueryVariables>(GetSubjectsOptionsDocument, variables, options);

export const GetSchoolTeachersDocument = `
    query GetSchoolTeachers($input: GetSchoolTeachersInput!) {
  getSchoolTeachers(input: $input) {
    meta {
      limit
      total
      totalPages
    }
    data {
      ...TeacherListData
    }
  }
}
    ${TeacherListDataFragmentDoc}`;

export const useGetSchoolTeachersQuery = <
      TData = GetSchoolTeachersQuery,
      TError = unknown
    >(
      variables: GetSchoolTeachersQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolTeachersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolTeachersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolTeachersQuery, TError, TData>(
      {
    queryKey: ['GetSchoolTeachers', variables],
    queryFn: fetcher<GetSchoolTeachersQuery, GetSchoolTeachersQueryVariables>(GetSchoolTeachersDocument, variables),
    ...options
  }
    )};

useGetSchoolTeachersQuery.getKey = (variables: GetSchoolTeachersQueryVariables) => ['GetSchoolTeachers', variables];

export const useInfiniteGetSchoolTeachersQuery = <
      TData = InfiniteData<GetSchoolTeachersQuery>,
      TError = unknown
    >(
      variables: GetSchoolTeachersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolTeachersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolTeachersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolTeachersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolTeachers.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolTeachersQuery, GetSchoolTeachersQueryVariables>(GetSchoolTeachersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolTeachersQuery.getKey = (variables: GetSchoolTeachersQueryVariables) => ['GetSchoolTeachers.infinite', variables];


useGetSchoolTeachersQuery.fetcher = (variables: GetSchoolTeachersQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolTeachersQuery, GetSchoolTeachersQueryVariables>(GetSchoolTeachersDocument, variables, options);

export const CreateTeacherDocument = `
    mutation CreateTeacher($input: CreateTeacherInput!) {
  createTeacher(input: $input) {
    ...TeacherListData
  }
}
    ${TeacherListDataFragmentDoc}`;

export const useCreateTeacherMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTeacherMutation, TError, CreateTeacherMutationVariables, TContext>) => {
    
    return useMutation<CreateTeacherMutation, TError, CreateTeacherMutationVariables, TContext>(
      {
    mutationKey: ['CreateTeacher'],
    mutationFn: (variables?: CreateTeacherMutationVariables) => fetcher<CreateTeacherMutation, CreateTeacherMutationVariables>(CreateTeacherDocument, variables)(),
    ...options
  }
    )};


useCreateTeacherMutation.fetcher = (variables: CreateTeacherMutationVariables, options?: RequestInit['headers']) => fetcher<CreateTeacherMutation, CreateTeacherMutationVariables>(CreateTeacherDocument, variables, options);

export const DeleteTeachersDocument = `
    mutation DeleteTeachers($teacherIds: [ID!]!, $soft: Boolean) {
  deleteTeachers(teacherIds: $teacherIds, soft: $soft) {
    ok
    message
  }
}
    `;

export const useDeleteTeachersMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTeachersMutation, TError, DeleteTeachersMutationVariables, TContext>) => {
    
    return useMutation<DeleteTeachersMutation, TError, DeleteTeachersMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTeachers'],
    mutationFn: (variables?: DeleteTeachersMutationVariables) => fetcher<DeleteTeachersMutation, DeleteTeachersMutationVariables>(DeleteTeachersDocument, variables)(),
    ...options
  }
    )};


useDeleteTeachersMutation.fetcher = (variables: DeleteTeachersMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteTeachersMutation, DeleteTeachersMutationVariables>(DeleteTeachersDocument, variables, options);

export const UpdateTeacherDocument = `
    mutation UpdateTeacher($teacherId: ID!, $data: CreateTeacherInput!) {
  updateTeacher(teacherId: $teacherId, data: $data) {
    ...TeacherListData
  }
}
    ${TeacherListDataFragmentDoc}`;

export const useUpdateTeacherMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTeacherMutation, TError, UpdateTeacherMutationVariables, TContext>) => {
    
    return useMutation<UpdateTeacherMutation, TError, UpdateTeacherMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTeacher'],
    mutationFn: (variables?: UpdateTeacherMutationVariables) => fetcher<UpdateTeacherMutation, UpdateTeacherMutationVariables>(UpdateTeacherDocument, variables)(),
    ...options
  }
    )};


useUpdateTeacherMutation.fetcher = (variables: UpdateTeacherMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateTeacherMutation, UpdateTeacherMutationVariables>(UpdateTeacherDocument, variables, options);

export const GetMeDocument = `
    query GetMe {
  me {
    id
    username
    phoneNumber
    email
    profileCompleted
    hasMembership
    profile {
      id
      address
      firstName
      lastName
      gender
      avatarUrl
    }
    memberships {
      id
      role
      isActive
      isOwner
      school {
        id
        name
        logo
        code
        slug
        address
      }
    }
  }
}
    `;

export const useGetMeQuery = <
      TData = GetMeQuery,
      TError = unknown
    >(
      variables?: GetMeQueryVariables,
      options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
    queryFn: fetcher<GetMeQuery, GetMeQueryVariables>(GetMeDocument, variables),
    ...options
  }
    )};

useGetMeQuery.getKey = (variables?: GetMeQueryVariables) => variables === undefined ? ['GetMe'] : ['GetMe', variables];

export const useInfiniteGetMeQuery = <
      TData = InfiniteData<GetMeQuery>,
      TError = unknown
    >(
      variables: GetMeQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetMeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetMeQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['GetMe.infinite'] : ['GetMe.infinite', variables],
      queryFn: (metaData) => fetcher<GetMeQuery, GetMeQueryVariables>(GetMeDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetMeQuery.getKey = (variables?: GetMeQueryVariables) => variables === undefined ? ['GetMe.infinite'] : ['GetMe.infinite', variables];


useGetMeQuery.fetcher = (variables?: GetMeQueryVariables, options?: RequestInit['headers']) => fetcher<GetMeQuery, GetMeQueryVariables>(GetMeDocument, variables, options);
