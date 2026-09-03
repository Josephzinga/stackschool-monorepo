import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '@stackschool/contracts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  studentCount?: Maybe<StudentCount>;
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
  group?: Maybe<Group>;
  groupId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  subject?: Maybe<Subject>;
  subjectId: Scalars['ID']['output'];
  weeklyHours?: Maybe<Scalars['Float']['output']>;
};

export type ClassSubjectInput = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  coefficient: Scalars['Int']['input'];
  groupId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  subjectId?: InputMaybe<Scalars['ID']['input']>;
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
  roomId?: InputMaybe<Scalars['ID']['input']>;
  startTime: Scalars['DateTime']['input'];
  subjectId: Scalars['ID']['input'];
  teacherId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  birthPlace?: InputMaybe<Scalars['String']['input']>;
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
  classSubjects?: InputMaybe<Array<ClassSubjectInput>>;
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

export type DeleteSubjectsInput = {
  soft?: Scalars['Boolean']['input'];
  subjectIds: Array<Scalars['ID']['input']>;
};

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

export type GetTeacherAssignmentInput = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type Group = {
  __typename?: 'Group';
  classSubjects?: Maybe<Array<Maybe<ClassSubject>>>;
  classes?: Maybe<Array<Class>>;
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
  group?: Maybe<Group>;
  id: Scalars['ID']['output'];
  mode?: Maybe<ResourceMode>;
  resourceId?: Maybe<Scalars['ID']['output']>;
  room?: Maybe<Room>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  status: LessonStatus;
  subject?: Maybe<Subject>;
  teacher?: Maybe<LessonTeacher>;
  teacherAssignment?: Maybe<TeacherAssignment>;
  teacherAssignmentId?: Maybe<Scalars['ID']['output']>;
  teacherId?: Maybe<Scalars['ID']['output']>;
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
  weeklyHours?: Maybe<Scalars['Int']['output']>;
};

export type LessonsData = {
  __typename?: 'LessonsData';
  events?: Maybe<Array<Lesson>>;
  resources?: Maybe<Array<LessonResources>>;
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
  createParent: Parent;
  createRoom: Room;
  createStudent?: Maybe<Student>;
  createSubject?: Maybe<Subject>;
  createTeacher?: Maybe<Teacher>;
  createTeacherAssignment: TeacherAssignment;
  deleteClassSubjects?: Maybe<ApiResponse>;
  deleteClasses?: Maybe<ApiResponse>;
  deleteLesson?: Maybe<ApiResponse>;
  deleteRooms?: Maybe<ApiResponse>;
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


export type MutationCreateParentArgs = {
  input: CreateParentInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
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


export type MutationDeleteRoomsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  soft?: Scalars['Boolean']['input'];
};


export type MutationDeleteStudentsArgs = {
  soft?: InputMaybe<Scalars['Boolean']['input']>;
  studentIds: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSubjectsArgs = {
  input: DeleteSubjectsInput;
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
  input: CreateStudentInput;
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
  member?: Maybe<SchoolMembership>;
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
  getTeacherAssignments?: Maybe<Array<Maybe<TeacherAssignment>>>;
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
  input?: InputMaybe<GetLessonsInput>;
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


export type QueryGetTeacherAssignmentsArgs = {
  filter?: InputMaybe<GetTeacherAssignmentInput>;
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
  classId: Scalars['ID']['output'];
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

export type StudentCount = {
  __typename?: 'StudentCount';
  female: Scalars['Int']['output'];
  male: Scalars['Int']['output'];
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
  | 'firstName'
  | 'lastName'
  | 'level';

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
  classSubjects?: Maybe<Array<Maybe<ClassSubject>>>;
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
  id: Scalars['ID']['input'];
  mode?: InputMaybe<ResourceMode>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
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

export type GetSchoolClassesQueryVariables = Exact<{
  input: GetSchoolClassesInput;
}>;


export type GetSchoolClassesQuery = { __typename?: 'Query', getSchoolClasses: { __typename?: 'ClassList', meta: { __typename?: 'PaginationMeta', limit: number, totalPages: number, total: number, page: number }, data?: Array<{ __typename?: 'Class', id: string, name: string, section?: string | null, level: string, studentCount?: { __typename?: 'StudentCount', male: number, female: number } | null, supervisor?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null, group?: { __typename?: 'Group', classSubjects?: Array<{ __typename?: 'ClassSubject', subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, assignment?: { __typename?: 'TeacherAssignment', teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null } | null> | null } | null }> | null } };

export type GetClassesOptionsQueryVariables = Exact<{
  input: GetSchoolClassesInput;
  withMeta?: InputMaybe<Scalars['Boolean']['input']>;
  includeGroup?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetClassesOptionsQuery = { __typename?: 'Query', getSchoolClasses: { __typename?: 'ClassList', meta?: { __typename?: 'PaginationMeta', limit: number, totalPages: number, total: number }, data?: Array<{ __typename?: 'Class', id: string, level: string, name: string, section?: string | null, group?: { __typename?: 'Group', id: string, name: string, type?: GroupType | null } | null }> | null } };

export type CreateClassMutationVariables = Exact<{
  data: CreateClassInput;
}>;


export type CreateClassMutation = { __typename?: 'Mutation', createClass: { __typename?: 'Class', id: string, name: string, section?: string | null, level: string, studentCount?: { __typename?: 'StudentCount', male: number, female: number } | null, supervisor?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null, group?: { __typename?: 'Group', classSubjects?: Array<{ __typename?: 'ClassSubject', subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, assignment?: { __typename?: 'TeacherAssignment', teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null } | null> | null } | null } };

export type ClassListFragmentFragment = { __typename?: 'Class', id: string, name: string, section?: string | null, level: string, studentCount?: { __typename?: 'StudentCount', male: number, female: number } | null, supervisor?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null, group?: { __typename?: 'Group', classSubjects?: Array<{ __typename?: 'ClassSubject', subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, assignment?: { __typename?: 'TeacherAssignment', teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null } | null> | null } | null };

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

export type GetClassSubjectTableQueryVariables = Exact<{
  classId: Scalars['ID']['input'];
}>;


export type GetClassSubjectTableQuery = { __typename?: 'Query', class?: { __typename?: 'Class', totalWeeklyHours?: number | null, totalCoefficient?: number | null, group?: { __typename?: 'Group', classSubjects?: Array<{ __typename?: 'ClassSubject', id: string, coefficient?: number | null, weeklyHours?: number | null, subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, assignment?: { __typename?: 'TeacherAssignment', id: string, teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null } | null } | null } | null> | null } | null } | null };

export type GetClassSubjectsOptionQueryVariables = Exact<{
  classId: Scalars['ID']['input'];
}>;


export type GetClassSubjectsOptionQuery = { __typename?: 'Query', getClassSubjects?: Array<{ __typename?: 'ClassSubject', assignment?: { __typename?: 'TeacherAssignment', id: string } | null, subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, group?: { __typename?: 'Group', id: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string, level: string }> | null } | null }> | null };

export type CreateClassSubjectMutationVariables = Exact<{
  input: ClassSubjectInput;
}>;


export type CreateClassSubjectMutation = { __typename?: 'Mutation', createClassSubject: { __typename?: 'ClassSubject', id: string } };

export type UpdateClassSubjectMutationVariables = Exact<{
  input: ClassSubjectInput;
}>;


export type UpdateClassSubjectMutation = { __typename?: 'Mutation', updateClassSubject: { __typename?: 'ClassSubject', id: string } };

export type BasicProfileFragment = { __typename?: 'Profile', id: string, firstName: string, lastName: string, avatarUrl?: string | null, gender?: Gender | null };

export type GetAdminDashboardStatsQueryVariables = Exact<{
  schoolId: Scalars['ID']['input'];
}>;


export type GetAdminDashboardStatsQuery = { __typename?: 'Query', school: { __typename?: 'School', id: string, name: string, logo?: string | null, stats?: { __typename?: 'SchoolStats', totalStudents: number, totalTeachers: number, totalClasses: number, pendingPaymentsCount?: number | null, monthlyRevenue?: { __typename?: 'MonthlyRevenue', previousMonth?: number | null, currentMonth: number } | null, studentGender?: { __typename?: 'GenderStats', male: number, female: number } | null, classesOccupancy?: Array<{ __typename?: 'ClassStats', className: string, studentCount: number } | null> | null, enrollmentPerMonth?: Array<{ __typename?: 'MonthlyStats', month: string, count: number }> | null } | null } };

export type GetDashboardContextQueryVariables = Exact<{
  input: Scalars['ID']['input'];
}>;


export type GetDashboardContextQuery = { __typename?: 'Query', me?: { __typename?: 'User', schoolContext?: { __typename?: 'SchoolMembership', id: string, role: SchoolRole, permissions?: Array<{ __typename?: 'Permission', id: string, code?: PermissionCode | null, name?: string | null, description?: string | null, module?: PermissionModule | null } | null> | null, teacher?: { __typename?: 'Teacher', id: string, department?: string | null, specialization?: string | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, section?: string | null } | null> | null } | null, staff?: { __typename?: 'Staff', id: string, position: string, department?: string | null, schoolUserId: string } | null, parent?: { __typename?: 'Parent', id: string, isDelegate?: boolean | null, parentStudent?: Array<{ __typename?: 'ParentStudent', student?: { __typename?: 'Student', id: string, matricule: string } | null } | null> | null } | null, student?: { __typename?: 'Student', id: string, matricule: string } | null } | null } | null };

export type GetSchoolLessonsQueryVariables = Exact<{
  input: GetLessonsInput;
}>;


export type GetSchoolLessonsQuery = { __typename?: 'Query', getLessons?: { __typename?: 'LessonsList', meta?: { __typename?: 'PaginationMeta', page: number, totalPages: number, total: number, limit: number } | null, data: { __typename?: 'LessonsData', resources?: Array<{ __typename?: 'LessonResources', id: string, title: string, weeklyHours?: number | null }> | null, events?: Array<{ __typename?: 'Lesson', id: string, resourceId?: string | null, title?: string | null, status: LessonStatus, startTime?: Date | null, day?: Day | null, endTime?: Date | null, group?: { __typename?: 'Group', id: string, name: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string }> | null } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null, teacher?: { __typename?: 'LessonTeacher', id: string, firstName: string, lastName: string, weeklyHours?: number | null } | null }> | null } } | null };

export type CreateLessonMutationVariables = Exact<{
  input: CreateLessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson?: { __typename?: 'Lesson', id: string, status: LessonStatus, startTime?: Date | null, endTime?: Date | null, day?: Day | null, teacherAssignment?: { __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', id: string, subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, group?: { __typename?: 'Group', classes?: Array<{ __typename?: 'Class', name: string, level: string }> | null } | null, assignment?: { __typename?: 'TeacherAssignment', id: string, teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null } | null } | null } | null } | null } | null };

export type UpdateLessonStatusMutationVariables = Exact<{
  status: LessonStatus;
  id: Scalars['ID']['input'];
}>;


export type UpdateLessonStatusMutation = { __typename?: 'Mutation', updateLessonStatus?: { __typename?: 'Lesson', id: string, status: LessonStatus } | null };

export type UpdateLessonMutationVariables = Exact<{
  input: UpdateLessonInput;
}>;


export type UpdateLessonMutation = { __typename?: 'Mutation', updateLesson?: { __typename?: 'Lesson', id: string, status: LessonStatus, startTime?: Date | null, endTime?: Date | null, day?: Day | null } | null };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null, details?: Array<string | null> | null } | null };

export type GetSchoolParentsQueryVariables = Exact<{
  filter: GetSchoolParentsInput;
}>;


export type GetSchoolParentsQuery = { __typename?: 'Query', getSchoolParents?: { __typename?: 'ParentList', meta?: { __typename?: 'PaginationMeta', page: number, total: number, totalPages: number, limit: number } | null, data?: Array<{ __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, address?: string | null, avatarUrl?: string | null } | null, parentStudent?: Array<{ __typename?: 'ParentStudent', student?: { __typename?: 'Student', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null, schoolClass?: { __typename?: 'Class', id: string, name: string, level: string } | null } | null } | null> | null }> | null } | null };

export type CreateParentMutationVariables = Exact<{
  input: CreateParentInput;
}>;


export type CreateParentMutation = { __typename?: 'Mutation', createParent: { __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, address?: string | null, avatarUrl?: string | null } | null, parentStudent?: Array<{ __typename?: 'ParentStudent', student?: { __typename?: 'Student', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null, schoolClass?: { __typename?: 'Class', id: string, name: string, level: string } | null } | null } | null> | null } };

export type ParentListFragment = { __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, address?: string | null, avatarUrl?: string | null } | null, parentStudent?: Array<{ __typename?: 'ParentStudent', student?: { __typename?: 'Student', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null, schoolClass?: { __typename?: 'Class', id: string, name: string, level: string } | null } | null } | null> | null };

export type GetSchoolRoomQueryVariables = Exact<{
  filter: GetSchoolRoomInput;
}>;


export type GetSchoolRoomQuery = { __typename?: 'Query', getSchoolRooms: { __typename?: 'RoomList', meta?: { __typename?: 'PaginationMeta', totalPages: number, limit: number, total: number } | null, data: Array<{ __typename?: 'Room', id: string, name: string, code?: string | null, capacity?: number | null, type?: string | null, defaultForClass?: { __typename?: 'Class', id: string, name: string, level: string } | null, class?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null } | null> } };

export type CreateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, name: string, code?: string | null, capacity?: number | null, type?: string | null, defaultForClass?: { __typename?: 'Class', id: string, name: string, level: string } | null, class?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null } };

export type DeleteRoomsMutationVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  soft?: Scalars['Boolean']['input'];
}>;


export type DeleteRoomsMutation = { __typename?: 'Mutation', deleteRooms?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type UpdateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', updateRoom: { __typename?: 'Room', id: string, name: string, code?: string | null, capacity?: number | null, type?: string | null, defaultForClass?: { __typename?: 'Class', id: string, name: string, level: string } | null, class?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null } };

export type RoomFragmentFragment = { __typename?: 'Room', id: string, name: string, code?: string | null, capacity?: number | null, type?: string | null, defaultForClass?: { __typename?: 'Class', id: string, name: string, level: string } | null, class?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null };

export type SearchSchoolQueryVariables = Exact<{
  input: SchoolSearchInput;
}>;


export type SearchSchoolQuery = { __typename?: 'Query', searchSchool?: Array<{ __typename?: 'School', id: string, name: string, address: string, code: string, logo?: string | null }> | null };

export type GetSchoolSettingsQueryVariables = Exact<{
  schoolId: Scalars['ID']['input'];
}>;


export type GetSchoolSettingsQuery = { __typename?: 'Query', school: { __typename?: 'School', settings?: { __typename?: 'SchoolSettings', id: string, startHour?: number | null, endHour?: number | null, daysOfWeek?: Array<Day | null> | null, lessonDuration?: number | null } | null } };

export type GetSchoolStudentsQueryVariables = Exact<{
  input: GetSchoolStudentsInput;
}>;


export type GetSchoolStudentsQuery = { __typename?: 'Query', getSchoolStudents: { __typename?: 'StudentList', meta: { __typename?: 'PaginationMeta', total: number, totalPages: number, limit: number, page: number }, data?: Array<{ __typename?: 'Student', id: string, matricule: string, enrollmentYear: string, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, avatarUrl?: string | null } | null, parentStudent?: Array<{ __typename?: 'ParentStudent', relationType?: RelationType | null, parent?: { __typename?: 'Parent', id: string } | null } | null> | null, schoolClass?: { __typename?: 'Class', id: string, name: string, section?: string | null, level: string } | null }> | null } };

export type GetStudentDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  includeParent?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetStudentDetailsQuery = { __typename?: 'Query', student?: { __typename?: 'Student', id: string, matricule: string, enrollmentYear: string, birthDate?: Date | null, birthPlace?: Date | null, nationality?: string | null, status?: StudentStatus | null, previousClass?: string | null, previousSchool?: string | null, bloodGroup?: string | null, allergies?: string | null, medicalCondition?: string | null, studentNumber?: number | null, birthCertificateNumber?: string | null, enrollmentDate?: Date | null, transportMode?: TransportMode | null, schoolClass?: { __typename?: 'Class', id: string, name: string, section?: string | null, level: string } | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null, gender: Gender, address?: string | null } | null, parentStudent?: Array<{ __typename?: 'ParentStudent', parent?: { __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null> | null } | null };

export type UpdateStudentMutationVariables = Exact<{
  studentId: Scalars['ID']['input'];
  input: CreateStudentInput;
}>;


export type UpdateStudentMutation = { __typename?: 'Mutation', updateStudent?: { __typename?: 'Student', id: string, matricule: string, enrollmentYear: string, birthDate?: Date | null, birthPlace?: Date | null, nationality?: string | null, status?: StudentStatus | null, previousClass?: string | null, previousSchool?: string | null, bloodGroup?: string | null, allergies?: string | null, medicalCondition?: string | null, studentNumber?: number | null, birthCertificateNumber?: string | null, enrollmentDate?: Date | null, transportMode?: TransportMode | null, parentStudent?: Array<{ __typename?: 'ParentStudent', relationType?: RelationType | null, parent?: { __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, gender: Gender, address?: string | null, avatarUrl?: string | null } | null } | null } | null> | null, schoolClass?: { __typename?: 'Class', id: string, name: string, section?: string | null, level: string } | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null, gender: Gender, address?: string | null } | null } | null };

export type CreateStudentMutationVariables = Exact<{
  input: CreateStudentInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent?: { __typename?: 'Student', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null };

export type DeleteStudentsMutationVariables = Exact<{
  studentIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  soft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteStudentsMutation = { __typename?: 'Mutation', deleteStudents?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type StudentDetailsFragment = { __typename?: 'Student', id: string, matricule: string, enrollmentYear: string, birthDate?: Date | null, birthPlace?: Date | null, nationality?: string | null, status?: StudentStatus | null, previousClass?: string | null, previousSchool?: string | null, bloodGroup?: string | null, allergies?: string | null, medicalCondition?: string | null, studentNumber?: number | null, birthCertificateNumber?: string | null, enrollmentDate?: Date | null, transportMode?: TransportMode | null, parentStudent?: Array<{ __typename?: 'ParentStudent', relationType?: RelationType | null, parent?: { __typename?: 'Parent', id: string, profession?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, gender: Gender, address?: string | null, avatarUrl?: string | null } | null } | null } | null> | null, schoolClass?: { __typename?: 'Class', id: string, name: string, section?: string | null, level: string } | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null, gender: Gender, address?: string | null } | null };

export type GetSubjectsOptionsQueryVariables = Exact<{
  input: GetSubjectInput;
}>;


export type GetSubjectsOptionsQuery = { __typename?: 'Query', getSchoolSubjects?: { __typename?: 'SubjectList', data: Array<{ __typename?: 'Subject', id: string, name: string, code?: string | null }> } | null };

export type SearchStudentQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type SearchStudentQuery = { __typename?: 'Query', searchStudent?: Array<{ __typename?: 'Student', id: string, matricule: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null, schoolClass?: { __typename?: 'Class', name: string } | null }> | null };

export type GetSchoolSubjectsQueryVariables = Exact<{
  input: GetSubjectInput;
}>;


export type GetSchoolSubjectsQuery = { __typename?: 'Query', getSchoolSubjects?: { __typename?: 'SubjectList', meta: { __typename?: 'PaginationMeta', page: number, totalPages: number, total: number, limit: number }, data: Array<{ __typename?: 'Subject', id: string, name: string, code?: string | null, category?: SubjectCategory | null, totalWeeklyHours?: number | null, mainTeacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', lastName: string, firstName: string, avatarUrl?: string | null } | null } | null, classSubjects?: Array<{ __typename?: 'ClassSubject', id: string, group?: { __typename?: 'Group', classes?: Array<{ __typename?: 'Class', id: string, name: string, level: string, section?: string | null }> | null } | null } | null> | null }> } | null };

export type CreateSubjectMutationVariables = Exact<{
  input: CreateSubjectInput;
}>;


export type CreateSubjectMutation = { __typename?: 'Mutation', createSubject?: { __typename?: 'Subject', id: string, name: string, code?: string | null, totalWeeklyHours?: number | null, mainTeacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null, classSubjects?: Array<{ __typename?: 'ClassSubject', id: string, group?: { __typename?: 'Group', classes?: Array<{ __typename?: 'Class', id: string, name: string, level: string }> | null } | null, assignment?: { __typename?: 'TeacherAssignment', id: string, teacher?: { __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null } | null } | null } | null> | null } | null };

export type DeleteSubjectsMutationVariables = Exact<{
  input: DeleteSubjectsInput;
}>;


export type DeleteSubjectsMutation = { __typename?: 'Mutation', deleteSubjects?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type GetTeacherAssignmentsQueryVariables = Exact<{
  filter: GetTeacherAssignmentInput;
}>;


export type GetTeacherAssignmentsQuery = { __typename?: 'Query', getTeacherAssignments?: Array<{ __typename?: 'TeacherAssignment', id: string, teacher?: { __typename?: 'Teacher', id: string, department?: string | null, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string } | null } | null, classSubject?: { __typename?: 'ClassSubject', subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, group?: { __typename?: 'Group', id: string, type?: GroupType | null, name: string, classes?: Array<{ __typename?: 'Class', id: string, name: string, level: string, section?: string | null }> | null } | null } | null } | null> | null };

export type GetSchoolTeachersQueryVariables = Exact<{
  input: GetSchoolTeachersInput;
}>;


export type GetSchoolTeachersQuery = { __typename?: 'Query', getSchoolTeachers: { __typename?: 'TeacherList', meta: { __typename?: 'PaginationMeta', limit: number, total: number, totalPages: number }, data: Array<{ __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group?: { __typename?: 'Group', id: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string }> | null } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null } | null } | null> | null }> } };

export type GetTeacherOptionsQueryVariables = Exact<{
  input: GetSchoolTeachersInput;
}>;


export type GetTeacherOptionsQuery = { __typename?: 'Query', getSchoolTeachers: { __typename?: 'TeacherList', data: Array<{ __typename?: 'Teacher', id: string, schoolProfile?: { __typename?: 'SchoolProfile', firstName: string, lastName: string, avatarUrl?: string | null } | null }> } };

export type CreateTeacherMutationVariables = Exact<{
  input: CreateTeacherInput;
}>;


export type CreateTeacherMutation = { __typename?: 'Mutation', createTeacher?: { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group?: { __typename?: 'Group', id: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string }> | null } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null } | null } | null> | null } | null };

export type GetTeacherDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTeacherDetailsQuery = { __typename?: 'Query', teacher?: { __typename?: 'Teacher', id: string, specialization?: string | null, diploma?: string | null, experience?: string | null, bio?: string | null, hireDate?: Date | null, salary?: number | null, department?: string | null, weeklyHours?: number | null, isActive?: boolean | null, createdAt?: Date | null, classesCount?: number | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', id: string, email?: string | null, phoneNumber?: string | null } | null } | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, avatarUrl?: string | null, gender: Gender, address?: string | null } | null } | null };

export type DeleteTeachersMutationVariables = Exact<{
  teacherIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  soft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteTeachersMutation = { __typename?: 'Mutation', deleteTeachers?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type UpdateTeacherMutationVariables = Exact<{
  teacherId: Scalars['ID']['input'];
  data: CreateTeacherInput;
}>;


export type UpdateTeacherMutation = { __typename?: 'Mutation', updateTeacher?: { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group?: { __typename?: 'Group', id: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string }> | null } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null } | null } | null> | null } | null };

export type CreateTeacherAssignmentMutationVariables = Exact<{
  input: CreateTeacherAssignmentInput;
}>;


export type CreateTeacherAssignmentMutation = { __typename?: 'Mutation', createTeacherAssignment: { __typename?: 'TeacherAssignment', id: string, classSubject?: { __typename?: 'ClassSubject', subject?: { __typename?: 'Subject', id: string, name: string, code?: string | null } | null, group?: { __typename?: 'Group', classes?: Array<{ __typename?: 'Class', id: string, name: string, level: string }> | null } | null } | null } };

export type SyncTeacherAssignmentMutationVariables = Exact<{
  input: CreateTeacherAssignmentInput;
}>;


export type SyncTeacherAssignmentMutation = { __typename?: 'Mutation', syncTeacherAssignment?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null, details?: Array<string | null> | null } | null };

export type TeacherListDataFragment = { __typename?: 'Teacher', id: string, schoolUserId?: string | null, weeklyHours?: number | null, specialization?: string | null, diploma?: string | null, department?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Class', id: string, name: string, level: string } | null> | null, schoolProfile?: { __typename?: 'SchoolProfile', id: string, firstName: string, lastName: string, gender: Gender, avatarUrl?: string | null } | null, schoolUser?: { __typename?: 'SchoolMembership', user?: { __typename?: 'User', email?: string | null, phoneNumber?: string | null } | null } | null, assignments?: Array<{ __typename?: 'TeacherAssignment', classSubject?: { __typename?: 'ClassSubject', group?: { __typename?: 'Group', id: string, type?: GroupType | null, classes?: Array<{ __typename?: 'Class', id: string, name: string }> | null } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null } | null } | null> | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username?: string | null, phoneNumber?: string | null, email?: string | null, profileCompleted?: boolean | null, hasMembership?: boolean | null, profile?: { __typename?: 'Profile', id: string, address?: string | null, firstName: string, lastName: string, gender?: Gender | null, avatarUrl?: string | null } | null, memberships?: Array<{ __typename?: 'SchoolMembership', id: string, role: SchoolRole, isActive: boolean, isOwner: boolean, school?: { __typename?: 'School', id: string, name: string, logo?: string | null, code: string, slug?: string | null, address: string } | null } | null> | null } | null };


export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const ClassListFragmentFragmentDoc = new TypedDocumentString(`
    fragment ClassListFragment on Class {
  id
  name
  section
  level
  studentCount {
    male
    female
  }
  supervisor {
    id
    schoolProfile {
      firstName
      lastName
      avatarUrl
    }
  }
  group {
    classSubjects {
      subject {
        id
        name
        code
      }
      assignment {
        teacher {
          id
          schoolProfile {
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }
}
    `, {"fragmentName":"ClassListFragment"});
export const BasicProfileFragmentDoc = new TypedDocumentString(`
    fragment basicProfile on Profile {
  id
  firstName
  lastName
  avatarUrl
  gender
}
    `, {"fragmentName":"basicProfile"});
export const ParentListFragmentDoc = new TypedDocumentString(`
    fragment ParentList on Parent {
  id
  profession
  schoolProfile {
    firstName
    lastName
    address
    avatarUrl
  }
  parentStudent {
    student {
      id
      schoolProfile {
        firstName
        lastName
      }
      schoolClass {
        id
        name
        level
      }
    }
  }
}
    `, {"fragmentName":"ParentList"});
export const RoomFragmentFragmentDoc = new TypedDocumentString(`
    fragment RoomFragment on Room {
  id
  name
  code
  capacity
  type
  defaultForClass {
    id
    name
    level
  }
  class {
    id
    name
    level
  }
}
    `, {"fragmentName":"RoomFragment"});
export const StudentDetailsFragmentDoc = new TypedDocumentString(`
    fragment StudentDetails on Student {
  id
  matricule
  enrollmentYear
  birthDate
  birthPlace
  nationality
  status
  previousClass
  previousSchool
  bloodGroup
  allergies
  medicalCondition
  studentNumber
  birthCertificateNumber
  enrollmentDate
  transportMode
  parentStudent {
    relationType
    parent {
      id
      profession
      schoolProfile {
        firstName
        lastName
        gender
        address
        avatarUrl
      }
    }
  }
  schoolClass {
    id
    name
    section
    level
  }
  schoolProfile {
    firstName
    lastName
    avatarUrl
    gender
    address
  }
}
    `, {"fragmentName":"StudentDetails"});
export const TeacherListDataFragmentDoc = new TypedDocumentString(`
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
        id
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
    `, {"fragmentName":"TeacherListData"});
export const GetSchoolClassesDocument = new TypedDocumentString(`
    query GetSchoolClasses($input: GetSchoolClassesInput!) {
  getSchoolClasses(input: $input) {
    meta {
      limit
      totalPages
      total
      page
    }
    data {
      ...ClassListFragment
    }
  }
}
    fragment ClassListFragment on Class {
  id
  name
  section
  level
  studentCount {
    male
    female
  }
  supervisor {
    id
    schoolProfile {
      firstName
      lastName
      avatarUrl
    }
  }
  group {
    classSubjects {
      subject {
        id
        name
        code
      }
      assignment {
        teacher {
          id
          schoolProfile {
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }
}`);

export const useGetSchoolClassesQuery = <
      TData = GetSchoolClassesQuery,
      TError = unknown
    >(
      variables: GetSchoolClassesQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolClassesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolClassesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolClassesQuery, TError, TData>(
      {
    queryKey: ['GetSchoolClasses', variables],
    queryFn: fetcher<GetSchoolClassesQuery, GetSchoolClassesQueryVariables>(GetSchoolClassesDocument, variables),
    ...options
  }
    )};

useGetSchoolClassesQuery.getKey = (variables: GetSchoolClassesQueryVariables) => ['GetSchoolClasses', variables];

export const useInfiniteGetSchoolClassesQuery = <
      TData = InfiniteData<GetSchoolClassesQuery>,
      TError = unknown
    >(
      variables: GetSchoolClassesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolClassesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolClassesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolClassesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolClasses.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolClassesQuery, GetSchoolClassesQueryVariables>(GetSchoolClassesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolClassesQuery.getKey = (variables: GetSchoolClassesQueryVariables) => ['GetSchoolClasses.infinite', variables];


useGetSchoolClassesQuery.fetcher = (variables: GetSchoolClassesQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolClassesQuery, GetSchoolClassesQueryVariables>(GetSchoolClassesDocument, variables, options);

export const GetClassesOptionsDocument = new TypedDocumentString(`
    query GetClassesOptions($input: GetSchoolClassesInput!, $withMeta: Boolean = true, $includeGroup: Boolean = true) {
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
      group @include(if: $includeGroup) {
        id
        name
        type
      }
    }
  }
}
    `);

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

export const CreateClassDocument = new TypedDocumentString(`
    mutation CreateClass($data: CreateClassInput!) {
  createClass(data: $data) {
    ...ClassListFragment
  }
}
    fragment ClassListFragment on Class {
  id
  name
  section
  level
  studentCount {
    male
    female
  }
  supervisor {
    id
    schoolProfile {
      firstName
      lastName
      avatarUrl
    }
  }
  group {
    classSubjects {
      subject {
        id
        name
        code
      }
      assignment {
        teacher {
          id
          schoolProfile {
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }
}`);

export const useCreateClassMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateClassMutation, TError, CreateClassMutationVariables, TContext>) => {
    
    return useMutation<CreateClassMutation, TError, CreateClassMutationVariables, TContext>(
      {
    mutationKey: ['CreateClass'],
    mutationFn: (variables?: CreateClassMutationVariables) => fetcher<CreateClassMutation, CreateClassMutationVariables>(CreateClassDocument, variables)(),
    ...options
  }
    )};


useCreateClassMutation.fetcher = (variables: CreateClassMutationVariables, options?: RequestInit['headers']) => fetcher<CreateClassMutation, CreateClassMutationVariables>(CreateClassDocument, variables, options);

export const UpdateClassDocument = new TypedDocumentString(`
    mutation UpdateClass($classId: ID!, $data: CreateClassInput!, $schoolId: ID!) {
  updateClass(classId: $classId, data: $data, schoolId: $schoolId) {
    ok
    message
  }
}
    `);

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

export const DeleteClassesDocument = new TypedDocumentString(`
    mutation DeleteClasses($classIds: [ID!]!, $schoolId: ID!) {
  deleteClasses(classIds: $classIds, schoolId: $schoolId) {
    ok
    message
  }
}
    `);

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

export const GetClassSubjectTableDocument = new TypedDocumentString(`
    query GetClassSubjectTable($classId: ID!) {
  class(id: $classId) {
    totalWeeklyHours
    totalCoefficient
    group {
      classSubjects {
        id
        coefficient
        weeklyHours
        subject {
          id
          name
          code
        }
        assignment {
          id
          teacher {
            id
            schoolProfile {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
}
    `);

export const useGetClassSubjectTableQuery = <
      TData = GetClassSubjectTableQuery,
      TError = unknown
    >(
      variables: GetClassSubjectTableQueryVariables,
      options?: Omit<UseQueryOptions<GetClassSubjectTableQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetClassSubjectTableQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetClassSubjectTableQuery, TError, TData>(
      {
    queryKey: ['GetClassSubjectTable', variables],
    queryFn: fetcher<GetClassSubjectTableQuery, GetClassSubjectTableQueryVariables>(GetClassSubjectTableDocument, variables),
    ...options
  }
    )};

useGetClassSubjectTableQuery.getKey = (variables: GetClassSubjectTableQueryVariables) => ['GetClassSubjectTable', variables];

export const useInfiniteGetClassSubjectTableQuery = <
      TData = InfiniteData<GetClassSubjectTableQuery>,
      TError = unknown
    >(
      variables: GetClassSubjectTableQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetClassSubjectTableQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetClassSubjectTableQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetClassSubjectTableQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetClassSubjectTable.infinite', variables],
      queryFn: (metaData) => fetcher<GetClassSubjectTableQuery, GetClassSubjectTableQueryVariables>(GetClassSubjectTableDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetClassSubjectTableQuery.getKey = (variables: GetClassSubjectTableQueryVariables) => ['GetClassSubjectTable.infinite', variables];


useGetClassSubjectTableQuery.fetcher = (variables: GetClassSubjectTableQueryVariables, options?: RequestInit['headers']) => fetcher<GetClassSubjectTableQuery, GetClassSubjectTableQueryVariables>(GetClassSubjectTableDocument, variables, options);

export const GetClassSubjectsOptionDocument = new TypedDocumentString(`
    query GetClassSubjectsOption($classId: ID!) {
  getClassSubjects(classId: $classId) {
    assignment {
      id
    }
    subject {
      id
      name
      code
    }
    group {
      id
      type
      classes {
        id
        name
        level
      }
    }
  }
}
    `);

export const useGetClassSubjectsOptionQuery = <
      TData = GetClassSubjectsOptionQuery,
      TError = unknown
    >(
      variables: GetClassSubjectsOptionQueryVariables,
      options?: Omit<UseQueryOptions<GetClassSubjectsOptionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetClassSubjectsOptionQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetClassSubjectsOptionQuery, TError, TData>(
      {
    queryKey: ['GetClassSubjectsOption', variables],
    queryFn: fetcher<GetClassSubjectsOptionQuery, GetClassSubjectsOptionQueryVariables>(GetClassSubjectsOptionDocument, variables),
    ...options
  }
    )};

useGetClassSubjectsOptionQuery.getKey = (variables: GetClassSubjectsOptionQueryVariables) => ['GetClassSubjectsOption', variables];

export const useInfiniteGetClassSubjectsOptionQuery = <
      TData = InfiniteData<GetClassSubjectsOptionQuery>,
      TError = unknown
    >(
      variables: GetClassSubjectsOptionQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetClassSubjectsOptionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetClassSubjectsOptionQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetClassSubjectsOptionQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetClassSubjectsOption.infinite', variables],
      queryFn: (metaData) => fetcher<GetClassSubjectsOptionQuery, GetClassSubjectsOptionQueryVariables>(GetClassSubjectsOptionDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetClassSubjectsOptionQuery.getKey = (variables: GetClassSubjectsOptionQueryVariables) => ['GetClassSubjectsOption.infinite', variables];


useGetClassSubjectsOptionQuery.fetcher = (variables: GetClassSubjectsOptionQueryVariables, options?: RequestInit['headers']) => fetcher<GetClassSubjectsOptionQuery, GetClassSubjectsOptionQueryVariables>(GetClassSubjectsOptionDocument, variables, options);

export const CreateClassSubjectDocument = new TypedDocumentString(`
    mutation CreateClassSubject($input: ClassSubjectInput!) {
  createClassSubject(input: $input) {
    id
  }
}
    `);

export const useCreateClassSubjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateClassSubjectMutation, TError, CreateClassSubjectMutationVariables, TContext>) => {
    
    return useMutation<CreateClassSubjectMutation, TError, CreateClassSubjectMutationVariables, TContext>(
      {
    mutationKey: ['CreateClassSubject'],
    mutationFn: (variables?: CreateClassSubjectMutationVariables) => fetcher<CreateClassSubjectMutation, CreateClassSubjectMutationVariables>(CreateClassSubjectDocument, variables)(),
    ...options
  }
    )};


useCreateClassSubjectMutation.fetcher = (variables: CreateClassSubjectMutationVariables, options?: RequestInit['headers']) => fetcher<CreateClassSubjectMutation, CreateClassSubjectMutationVariables>(CreateClassSubjectDocument, variables, options);

export const UpdateClassSubjectDocument = new TypedDocumentString(`
    mutation UpdateClassSubject($input: ClassSubjectInput!) {
  updateClassSubject(input: $input) {
    id
  }
}
    `);

export const useUpdateClassSubjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateClassSubjectMutation, TError, UpdateClassSubjectMutationVariables, TContext>) => {
    
    return useMutation<UpdateClassSubjectMutation, TError, UpdateClassSubjectMutationVariables, TContext>(
      {
    mutationKey: ['UpdateClassSubject'],
    mutationFn: (variables?: UpdateClassSubjectMutationVariables) => fetcher<UpdateClassSubjectMutation, UpdateClassSubjectMutationVariables>(UpdateClassSubjectDocument, variables)(),
    ...options
  }
    )};


useUpdateClassSubjectMutation.fetcher = (variables: UpdateClassSubjectMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateClassSubjectMutation, UpdateClassSubjectMutationVariables>(UpdateClassSubjectDocument, variables, options);

export const GetAdminDashboardStatsDocument = new TypedDocumentString(`
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
    `);

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

export const GetDashboardContextDocument = new TypedDocumentString(`
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
    `);

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

export const GetSchoolLessonsDocument = new TypedDocumentString(`
    query GetSchoolLessons($input: GetLessonsInput!) {
  getLessons(input: $input) {
    meta {
      page
      totalPages
      total
      limit
    }
    data {
      resources {
        id
        title
        weeklyHours
      }
      events {
        id
        resourceId
        title
        status
        startTime
        day
        endTime
        group {
          id
          name
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
        teacher {
          id
          firstName
          lastName
          weeklyHours
        }
      }
    }
  }
}
    `);

export const useGetSchoolLessonsQuery = <
      TData = GetSchoolLessonsQuery,
      TError = unknown
    >(
      variables: GetSchoolLessonsQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolLessonsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolLessonsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolLessonsQuery, TError, TData>(
      {
    queryKey: ['GetSchoolLessons', variables],
    queryFn: fetcher<GetSchoolLessonsQuery, GetSchoolLessonsQueryVariables>(GetSchoolLessonsDocument, variables),
    ...options
  }
    )};

useGetSchoolLessonsQuery.getKey = (variables: GetSchoolLessonsQueryVariables) => ['GetSchoolLessons', variables];

export const useInfiniteGetSchoolLessonsQuery = <
      TData = InfiniteData<GetSchoolLessonsQuery>,
      TError = unknown
    >(
      variables: GetSchoolLessonsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolLessonsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolLessonsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolLessonsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolLessons.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolLessonsQuery, GetSchoolLessonsQueryVariables>(GetSchoolLessonsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolLessonsQuery.getKey = (variables: GetSchoolLessonsQueryVariables) => ['GetSchoolLessons.infinite', variables];


useGetSchoolLessonsQuery.fetcher = (variables: GetSchoolLessonsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolLessonsQuery, GetSchoolLessonsQueryVariables>(GetSchoolLessonsDocument, variables, options);

export const CreateLessonDocument = new TypedDocumentString(`
    mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    id
    status
    startTime
    endTime
    day
    teacherAssignment {
      classSubject {
        id
        subject {
          id
          name
          code
        }
        group {
          classes {
            name
            level
          }
        }
        assignment {
          id
          teacher {
            id
            schoolProfile {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
}
    `);

export const useCreateLessonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateLessonMutation, TError, CreateLessonMutationVariables, TContext>) => {
    
    return useMutation<CreateLessonMutation, TError, CreateLessonMutationVariables, TContext>(
      {
    mutationKey: ['CreateLesson'],
    mutationFn: (variables?: CreateLessonMutationVariables) => fetcher<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, variables)(),
    ...options
  }
    )};


useCreateLessonMutation.fetcher = (variables: CreateLessonMutationVariables, options?: RequestInit['headers']) => fetcher<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, variables, options);

export const UpdateLessonStatusDocument = new TypedDocumentString(`
    mutation UpdateLessonStatus($status: LessonStatus!, $id: ID!) {
  updateLessonStatus(status: $status, id: $id) {
    id
    status
  }
}
    `);

export const useUpdateLessonStatusMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLessonStatusMutation, TError, UpdateLessonStatusMutationVariables, TContext>) => {
    
    return useMutation<UpdateLessonStatusMutation, TError, UpdateLessonStatusMutationVariables, TContext>(
      {
    mutationKey: ['UpdateLessonStatus'],
    mutationFn: (variables?: UpdateLessonStatusMutationVariables) => fetcher<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>(UpdateLessonStatusDocument, variables)(),
    ...options
  }
    )};


useUpdateLessonStatusMutation.fetcher = (variables: UpdateLessonStatusMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>(UpdateLessonStatusDocument, variables, options);

export const UpdateLessonDocument = new TypedDocumentString(`
    mutation UpdateLesson($input: UpdateLessonInput!) {
  updateLesson(input: $input) {
    id
    status
    startTime
    endTime
    day
  }
}
    `);

export const useUpdateLessonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLessonMutation, TError, UpdateLessonMutationVariables, TContext>) => {
    
    return useMutation<UpdateLessonMutation, TError, UpdateLessonMutationVariables, TContext>(
      {
    mutationKey: ['UpdateLesson'],
    mutationFn: (variables?: UpdateLessonMutationVariables) => fetcher<UpdateLessonMutation, UpdateLessonMutationVariables>(UpdateLessonDocument, variables)(),
    ...options
  }
    )};


useUpdateLessonMutation.fetcher = (variables: UpdateLessonMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLessonMutation, UpdateLessonMutationVariables>(UpdateLessonDocument, variables, options);

export const DeleteLessonDocument = new TypedDocumentString(`
    mutation DeleteLesson($id: ID!) {
  deleteLesson(id: $id) {
    ok
    message
    details
  }
}
    `);

export const useDeleteLessonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteLessonMutation, TError, DeleteLessonMutationVariables, TContext>) => {
    
    return useMutation<DeleteLessonMutation, TError, DeleteLessonMutationVariables, TContext>(
      {
    mutationKey: ['DeleteLesson'],
    mutationFn: (variables?: DeleteLessonMutationVariables) => fetcher<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, variables)(),
    ...options
  }
    )};


useDeleteLessonMutation.fetcher = (variables: DeleteLessonMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, variables, options);

export const GetSchoolParentsDocument = new TypedDocumentString(`
    query GetSchoolParents($filter: GetSchoolParentsInput!) {
  getSchoolParents(filter: $filter) {
    meta {
      page
      total
      totalPages
      limit
    }
    data {
      ...ParentList
    }
  }
}
    fragment ParentList on Parent {
  id
  profession
  schoolProfile {
    firstName
    lastName
    address
    avatarUrl
  }
  parentStudent {
    student {
      id
      schoolProfile {
        firstName
        lastName
      }
      schoolClass {
        id
        name
        level
      }
    }
  }
}`);

export const useGetSchoolParentsQuery = <
      TData = GetSchoolParentsQuery,
      TError = unknown
    >(
      variables: GetSchoolParentsQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolParentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolParentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolParentsQuery, TError, TData>(
      {
    queryKey: ['GetSchoolParents', variables],
    queryFn: fetcher<GetSchoolParentsQuery, GetSchoolParentsQueryVariables>(GetSchoolParentsDocument, variables),
    ...options
  }
    )};

useGetSchoolParentsQuery.getKey = (variables: GetSchoolParentsQueryVariables) => ['GetSchoolParents', variables];

export const useInfiniteGetSchoolParentsQuery = <
      TData = InfiniteData<GetSchoolParentsQuery>,
      TError = unknown
    >(
      variables: GetSchoolParentsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolParentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolParentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolParentsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolParents.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolParentsQuery, GetSchoolParentsQueryVariables>(GetSchoolParentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolParentsQuery.getKey = (variables: GetSchoolParentsQueryVariables) => ['GetSchoolParents.infinite', variables];


useGetSchoolParentsQuery.fetcher = (variables: GetSchoolParentsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolParentsQuery, GetSchoolParentsQueryVariables>(GetSchoolParentsDocument, variables, options);

export const CreateParentDocument = new TypedDocumentString(`
    mutation CreateParent($input: CreateParentInput!) {
  createParent(input: $input) {
    ...ParentList
  }
}
    fragment ParentList on Parent {
  id
  profession
  schoolProfile {
    firstName
    lastName
    address
    avatarUrl
  }
  parentStudent {
    student {
      id
      schoolProfile {
        firstName
        lastName
      }
      schoolClass {
        id
        name
        level
      }
    }
  }
}`);

export const useCreateParentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateParentMutation, TError, CreateParentMutationVariables, TContext>) => {
    
    return useMutation<CreateParentMutation, TError, CreateParentMutationVariables, TContext>(
      {
    mutationKey: ['CreateParent'],
    mutationFn: (variables?: CreateParentMutationVariables) => fetcher<CreateParentMutation, CreateParentMutationVariables>(CreateParentDocument, variables)(),
    ...options
  }
    )};


useCreateParentMutation.fetcher = (variables: CreateParentMutationVariables, options?: RequestInit['headers']) => fetcher<CreateParentMutation, CreateParentMutationVariables>(CreateParentDocument, variables, options);

export const GetSchoolRoomDocument = new TypedDocumentString(`
    query GetSchoolRoom($filter: GetSchoolRoomInput!) {
  getSchoolRooms(filter: $filter) {
    meta {
      totalPages
      limit
      total
    }
    data {
      ...RoomFragment
    }
  }
}
    fragment RoomFragment on Room {
  id
  name
  code
  capacity
  type
  defaultForClass {
    id
    name
    level
  }
  class {
    id
    name
    level
  }
}`);

export const useGetSchoolRoomQuery = <
      TData = GetSchoolRoomQuery,
      TError = unknown
    >(
      variables: GetSchoolRoomQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolRoomQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolRoomQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolRoomQuery, TError, TData>(
      {
    queryKey: ['GetSchoolRoom', variables],
    queryFn: fetcher<GetSchoolRoomQuery, GetSchoolRoomQueryVariables>(GetSchoolRoomDocument, variables),
    ...options
  }
    )};

useGetSchoolRoomQuery.getKey = (variables: GetSchoolRoomQueryVariables) => ['GetSchoolRoom', variables];

export const useInfiniteGetSchoolRoomQuery = <
      TData = InfiniteData<GetSchoolRoomQuery>,
      TError = unknown
    >(
      variables: GetSchoolRoomQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolRoomQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolRoomQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolRoomQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolRoom.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolRoomQuery, GetSchoolRoomQueryVariables>(GetSchoolRoomDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolRoomQuery.getKey = (variables: GetSchoolRoomQueryVariables) => ['GetSchoolRoom.infinite', variables];


useGetSchoolRoomQuery.fetcher = (variables: GetSchoolRoomQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolRoomQuery, GetSchoolRoomQueryVariables>(GetSchoolRoomDocument, variables, options);

export const CreateRoomDocument = new TypedDocumentString(`
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    ...RoomFragment
  }
}
    fragment RoomFragment on Room {
  id
  name
  code
  capacity
  type
  defaultForClass {
    id
    name
    level
  }
  class {
    id
    name
    level
  }
}`);

export const useCreateRoomMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateRoomMutation, TError, CreateRoomMutationVariables, TContext>) => {
    
    return useMutation<CreateRoomMutation, TError, CreateRoomMutationVariables, TContext>(
      {
    mutationKey: ['CreateRoom'],
    mutationFn: (variables?: CreateRoomMutationVariables) => fetcher<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, variables)(),
    ...options
  }
    )};


useCreateRoomMutation.fetcher = (variables: CreateRoomMutationVariables, options?: RequestInit['headers']) => fetcher<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, variables, options);

export const DeleteRoomsDocument = new TypedDocumentString(`
    mutation DeleteRooms($ids: [ID!], $soft: Boolean! = true) {
  deleteRooms(ids: $ids, soft: $soft) {
    ok
    message
  }
}
    `);

export const useDeleteRoomsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteRoomsMutation, TError, DeleteRoomsMutationVariables, TContext>) => {
    
    return useMutation<DeleteRoomsMutation, TError, DeleteRoomsMutationVariables, TContext>(
      {
    mutationKey: ['DeleteRooms'],
    mutationFn: (variables?: DeleteRoomsMutationVariables) => fetcher<DeleteRoomsMutation, DeleteRoomsMutationVariables>(DeleteRoomsDocument, variables)(),
    ...options
  }
    )};


useDeleteRoomsMutation.fetcher = (variables?: DeleteRoomsMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteRoomsMutation, DeleteRoomsMutationVariables>(DeleteRoomsDocument, variables, options);

export const UpdateRoomDocument = new TypedDocumentString(`
    mutation UpdateRoom($input: CreateRoomInput!) {
  updateRoom(input: $input) {
    ...RoomFragment
  }
}
    fragment RoomFragment on Room {
  id
  name
  code
  capacity
  type
  defaultForClass {
    id
    name
    level
  }
  class {
    id
    name
    level
  }
}`);

export const useUpdateRoomMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateRoomMutation, TError, UpdateRoomMutationVariables, TContext>) => {
    
    return useMutation<UpdateRoomMutation, TError, UpdateRoomMutationVariables, TContext>(
      {
    mutationKey: ['UpdateRoom'],
    mutationFn: (variables?: UpdateRoomMutationVariables) => fetcher<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, variables)(),
    ...options
  }
    )};


useUpdateRoomMutation.fetcher = (variables: UpdateRoomMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, variables, options);

export const SearchSchoolDocument = new TypedDocumentString(`
    query SearchSchool($input: SchoolSearchInput!) {
  searchSchool(filter: $input) {
    id
    name
    address
    code
    logo
  }
}
    `);

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

export const GetSchoolSettingsDocument = new TypedDocumentString(`
    query GetSchoolSettings($schoolId: ID!) {
  school(schoolId: $schoolId) {
    settings {
      id
      startHour
      endHour
      daysOfWeek
      lessonDuration
    }
  }
}
    `);

export const useGetSchoolSettingsQuery = <
      TData = GetSchoolSettingsQuery,
      TError = unknown
    >(
      variables: GetSchoolSettingsQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolSettingsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolSettingsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolSettingsQuery, TError, TData>(
      {
    queryKey: ['GetSchoolSettings', variables],
    queryFn: fetcher<GetSchoolSettingsQuery, GetSchoolSettingsQueryVariables>(GetSchoolSettingsDocument, variables),
    ...options
  }
    )};

useGetSchoolSettingsQuery.getKey = (variables: GetSchoolSettingsQueryVariables) => ['GetSchoolSettings', variables];

export const useInfiniteGetSchoolSettingsQuery = <
      TData = InfiniteData<GetSchoolSettingsQuery>,
      TError = unknown
    >(
      variables: GetSchoolSettingsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolSettingsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolSettingsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolSettingsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolSettings.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolSettingsQuery, GetSchoolSettingsQueryVariables>(GetSchoolSettingsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolSettingsQuery.getKey = (variables: GetSchoolSettingsQueryVariables) => ['GetSchoolSettings.infinite', variables];


useGetSchoolSettingsQuery.fetcher = (variables: GetSchoolSettingsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolSettingsQuery, GetSchoolSettingsQueryVariables>(GetSchoolSettingsDocument, variables, options);

export const GetSchoolStudentsDocument = new TypedDocumentString(`
    query GetSchoolStudents($input: GetSchoolStudentsInput!) {
  getSchoolStudents(input: $input) {
    meta {
      total
      totalPages
      limit
      page
    }
    data {
      id
      matricule
      enrollmentYear
      schoolProfile {
        id
        firstName
        lastName
        avatarUrl
      }
      parentStudent {
        relationType
        parent {
          id
        }
      }
      schoolClass {
        id
        name
        section
        level
      }
    }
  }
}
    `);

export const useGetSchoolStudentsQuery = <
      TData = GetSchoolStudentsQuery,
      TError = unknown
    >(
      variables: GetSchoolStudentsQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolStudentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolStudentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolStudentsQuery, TError, TData>(
      {
    queryKey: ['GetSchoolStudents', variables],
    queryFn: fetcher<GetSchoolStudentsQuery, GetSchoolStudentsQueryVariables>(GetSchoolStudentsDocument, variables),
    ...options
  }
    )};

useGetSchoolStudentsQuery.getKey = (variables: GetSchoolStudentsQueryVariables) => ['GetSchoolStudents', variables];

export const useInfiniteGetSchoolStudentsQuery = <
      TData = InfiniteData<GetSchoolStudentsQuery>,
      TError = unknown
    >(
      variables: GetSchoolStudentsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolStudentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolStudentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolStudentsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolStudents.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolStudentsQuery, GetSchoolStudentsQueryVariables>(GetSchoolStudentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolStudentsQuery.getKey = (variables: GetSchoolStudentsQueryVariables) => ['GetSchoolStudents.infinite', variables];


useGetSchoolStudentsQuery.fetcher = (variables: GetSchoolStudentsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolStudentsQuery, GetSchoolStudentsQueryVariables>(GetSchoolStudentsDocument, variables, options);

export const GetStudentDetailsDocument = new TypedDocumentString(`
    query GetStudentDetails($id: ID!, $includeParent: Boolean) {
  student(id: $id) {
    id
    matricule
    enrollmentYear
    birthDate
    birthPlace
    nationality
    status
    previousClass
    previousSchool
    bloodGroup
    allergies
    medicalCondition
    studentNumber
    birthCertificateNumber
    enrollmentDate
    transportMode
    schoolClass {
      id
      name
      section
      level
    }
    schoolProfile {
      firstName
      lastName
      avatarUrl
      gender
      address
    }
    parentStudent {
      parent {
        id
        profession
        schoolProfile {
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }
}
    `);

export const useGetStudentDetailsQuery = <
      TData = GetStudentDetailsQuery,
      TError = unknown
    >(
      variables: GetStudentDetailsQueryVariables,
      options?: Omit<UseQueryOptions<GetStudentDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetStudentDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetStudentDetailsQuery, TError, TData>(
      {
    queryKey: ['GetStudentDetails', variables],
    queryFn: fetcher<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>(GetStudentDetailsDocument, variables),
    ...options
  }
    )};

useGetStudentDetailsQuery.getKey = (variables: GetStudentDetailsQueryVariables) => ['GetStudentDetails', variables];

export const useInfiniteGetStudentDetailsQuery = <
      TData = InfiniteData<GetStudentDetailsQuery>,
      TError = unknown
    >(
      variables: GetStudentDetailsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetStudentDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetStudentDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetStudentDetailsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetStudentDetails.infinite', variables],
      queryFn: (metaData) => fetcher<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>(GetStudentDetailsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetStudentDetailsQuery.getKey = (variables: GetStudentDetailsQueryVariables) => ['GetStudentDetails.infinite', variables];


useGetStudentDetailsQuery.fetcher = (variables: GetStudentDetailsQueryVariables, options?: RequestInit['headers']) => fetcher<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>(GetStudentDetailsDocument, variables, options);

export const UpdateStudentDocument = new TypedDocumentString(`
    mutation UpdateStudent($studentId: ID!, $input: CreateStudentInput!) {
  updateStudent(studentId: $studentId, input: $input) {
    ...StudentDetails
  }
}
    fragment StudentDetails on Student {
  id
  matricule
  enrollmentYear
  birthDate
  birthPlace
  nationality
  status
  previousClass
  previousSchool
  bloodGroup
  allergies
  medicalCondition
  studentNumber
  birthCertificateNumber
  enrollmentDate
  transportMode
  parentStudent {
    relationType
    parent {
      id
      profession
      schoolProfile {
        firstName
        lastName
        gender
        address
        avatarUrl
      }
    }
  }
  schoolClass {
    id
    name
    section
    level
  }
  schoolProfile {
    firstName
    lastName
    avatarUrl
    gender
    address
  }
}`);

export const useUpdateStudentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateStudentMutation, TError, UpdateStudentMutationVariables, TContext>) => {
    
    return useMutation<UpdateStudentMutation, TError, UpdateStudentMutationVariables, TContext>(
      {
    mutationKey: ['UpdateStudent'],
    mutationFn: (variables?: UpdateStudentMutationVariables) => fetcher<UpdateStudentMutation, UpdateStudentMutationVariables>(UpdateStudentDocument, variables)(),
    ...options
  }
    )};


useUpdateStudentMutation.fetcher = (variables: UpdateStudentMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateStudentMutation, UpdateStudentMutationVariables>(UpdateStudentDocument, variables, options);

export const CreateStudentDocument = new TypedDocumentString(`
    mutation CreateStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
    id
    schoolProfile {
      firstName
      lastName
      avatarUrl
    }
  }
}
    `);

export const useCreateStudentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateStudentMutation, TError, CreateStudentMutationVariables, TContext>) => {
    
    return useMutation<CreateStudentMutation, TError, CreateStudentMutationVariables, TContext>(
      {
    mutationKey: ['CreateStudent'],
    mutationFn: (variables?: CreateStudentMutationVariables) => fetcher<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument, variables)(),
    ...options
  }
    )};


useCreateStudentMutation.fetcher = (variables: CreateStudentMutationVariables, options?: RequestInit['headers']) => fetcher<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument, variables, options);

export const DeleteStudentsDocument = new TypedDocumentString(`
    mutation DeleteStudents($studentIds: [ID!]!, $soft: Boolean) {
  deleteStudents(studentIds: $studentIds, soft: $soft) {
    ok
    message
  }
}
    `);

export const useDeleteStudentsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteStudentsMutation, TError, DeleteStudentsMutationVariables, TContext>) => {
    
    return useMutation<DeleteStudentsMutation, TError, DeleteStudentsMutationVariables, TContext>(
      {
    mutationKey: ['DeleteStudents'],
    mutationFn: (variables?: DeleteStudentsMutationVariables) => fetcher<DeleteStudentsMutation, DeleteStudentsMutationVariables>(DeleteStudentsDocument, variables)(),
    ...options
  }
    )};


useDeleteStudentsMutation.fetcher = (variables: DeleteStudentsMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteStudentsMutation, DeleteStudentsMutationVariables>(DeleteStudentsDocument, variables, options);

export const GetSubjectsOptionsDocument = new TypedDocumentString(`
    query GetSubjectsOptions($input: GetSubjectInput!) {
  getSchoolSubjects(input: $input) {
    data {
      id
      name
      code
    }
  }
}
    `);

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

export const SearchStudentDocument = new TypedDocumentString(`
    query SearchStudent($input: StudentSearchInput!) {
  searchStudent(filter: $input) {
    id
    schoolProfile {
      firstName
      lastName
      avatarUrl
    }
    schoolClass {
      name
    }
    matricule
  }
}
    `);

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

export const GetSchoolSubjectsDocument = new TypedDocumentString(`
    query GetSchoolSubjects($input: GetSubjectInput!) {
  getSchoolSubjects(input: $input) {
    meta {
      page
      totalPages
      total
      limit
    }
    data {
      id
      name
      code
      category
      totalWeeklyHours
      mainTeacher {
        id
        schoolProfile {
          lastName
          firstName
          avatarUrl
        }
      }
      classSubjects {
        id
        group {
          classes {
            id
            name
            level
            section
          }
        }
      }
    }
  }
}
    `);

export const useGetSchoolSubjectsQuery = <
      TData = GetSchoolSubjectsQuery,
      TError = unknown
    >(
      variables: GetSchoolSubjectsQueryVariables,
      options?: Omit<UseQueryOptions<GetSchoolSubjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSchoolSubjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSchoolSubjectsQuery, TError, TData>(
      {
    queryKey: ['GetSchoolSubjects', variables],
    queryFn: fetcher<GetSchoolSubjectsQuery, GetSchoolSubjectsQueryVariables>(GetSchoolSubjectsDocument, variables),
    ...options
  }
    )};

useGetSchoolSubjectsQuery.getKey = (variables: GetSchoolSubjectsQueryVariables) => ['GetSchoolSubjects', variables];

export const useInfiniteGetSchoolSubjectsQuery = <
      TData = InfiniteData<GetSchoolSubjectsQuery>,
      TError = unknown
    >(
      variables: GetSchoolSubjectsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetSchoolSubjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetSchoolSubjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetSchoolSubjectsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetSchoolSubjects.infinite', variables],
      queryFn: (metaData) => fetcher<GetSchoolSubjectsQuery, GetSchoolSubjectsQueryVariables>(GetSchoolSubjectsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetSchoolSubjectsQuery.getKey = (variables: GetSchoolSubjectsQueryVariables) => ['GetSchoolSubjects.infinite', variables];


useGetSchoolSubjectsQuery.fetcher = (variables: GetSchoolSubjectsQueryVariables, options?: RequestInit['headers']) => fetcher<GetSchoolSubjectsQuery, GetSchoolSubjectsQueryVariables>(GetSchoolSubjectsDocument, variables, options);

export const CreateSubjectDocument = new TypedDocumentString(`
    mutation CreateSubject($input: CreateSubjectInput!) {
  createSubject(input: $input) {
    id
    name
    code
    totalWeeklyHours
    mainTeacher {
      id
      schoolProfile {
        firstName
        lastName
        avatarUrl
      }
    }
    classSubjects {
      id
      group {
        classes {
          id
          name
          level
        }
      }
      assignment {
        id
        teacher {
          id
          schoolProfile {
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }
}
    `);

export const useCreateSubjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateSubjectMutation, TError, CreateSubjectMutationVariables, TContext>) => {
    
    return useMutation<CreateSubjectMutation, TError, CreateSubjectMutationVariables, TContext>(
      {
    mutationKey: ['CreateSubject'],
    mutationFn: (variables?: CreateSubjectMutationVariables) => fetcher<CreateSubjectMutation, CreateSubjectMutationVariables>(CreateSubjectDocument, variables)(),
    ...options
  }
    )};


useCreateSubjectMutation.fetcher = (variables: CreateSubjectMutationVariables, options?: RequestInit['headers']) => fetcher<CreateSubjectMutation, CreateSubjectMutationVariables>(CreateSubjectDocument, variables, options);

export const DeleteSubjectsDocument = new TypedDocumentString(`
    mutation DeleteSubjects($input: DeleteSubjectsInput!) {
  deleteSubjects(input: $input) {
    ok
    message
  }
}
    `);

export const useDeleteSubjectsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteSubjectsMutation, TError, DeleteSubjectsMutationVariables, TContext>) => {
    
    return useMutation<DeleteSubjectsMutation, TError, DeleteSubjectsMutationVariables, TContext>(
      {
    mutationKey: ['DeleteSubjects'],
    mutationFn: (variables?: DeleteSubjectsMutationVariables) => fetcher<DeleteSubjectsMutation, DeleteSubjectsMutationVariables>(DeleteSubjectsDocument, variables)(),
    ...options
  }
    )};


useDeleteSubjectsMutation.fetcher = (variables: DeleteSubjectsMutationVariables, options?: RequestInit['headers']) => fetcher<DeleteSubjectsMutation, DeleteSubjectsMutationVariables>(DeleteSubjectsDocument, variables, options);

export const GetTeacherAssignmentsDocument = new TypedDocumentString(`
    query GetTeacherAssignments($filter: GetTeacherAssignmentInput!) {
  getTeacherAssignments(filter: $filter) {
    id
    teacher {
      id
      department
      schoolProfile {
        firstName
        lastName
      }
    }
    classSubject {
      subject {
        id
        name
        code
      }
      group {
        id
        type
        name
        classes {
          id
          name
          level
          section
        }
      }
    }
  }
}
    `);

export const useGetTeacherAssignmentsQuery = <
      TData = GetTeacherAssignmentsQuery,
      TError = unknown
    >(
      variables: GetTeacherAssignmentsQueryVariables,
      options?: Omit<UseQueryOptions<GetTeacherAssignmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTeacherAssignmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetTeacherAssignmentsQuery, TError, TData>(
      {
    queryKey: ['GetTeacherAssignments', variables],
    queryFn: fetcher<GetTeacherAssignmentsQuery, GetTeacherAssignmentsQueryVariables>(GetTeacherAssignmentsDocument, variables),
    ...options
  }
    )};

useGetTeacherAssignmentsQuery.getKey = (variables: GetTeacherAssignmentsQueryVariables) => ['GetTeacherAssignments', variables];

export const useInfiniteGetTeacherAssignmentsQuery = <
      TData = InfiniteData<GetTeacherAssignmentsQuery>,
      TError = unknown
    >(
      variables: GetTeacherAssignmentsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetTeacherAssignmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetTeacherAssignmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetTeacherAssignmentsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetTeacherAssignments.infinite', variables],
      queryFn: (metaData) => fetcher<GetTeacherAssignmentsQuery, GetTeacherAssignmentsQueryVariables>(GetTeacherAssignmentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetTeacherAssignmentsQuery.getKey = (variables: GetTeacherAssignmentsQueryVariables) => ['GetTeacherAssignments.infinite', variables];


useGetTeacherAssignmentsQuery.fetcher = (variables: GetTeacherAssignmentsQueryVariables, options?: RequestInit['headers']) => fetcher<GetTeacherAssignmentsQuery, GetTeacherAssignmentsQueryVariables>(GetTeacherAssignmentsDocument, variables, options);

export const GetSchoolTeachersDocument = new TypedDocumentString(`
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
        id
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
}`);

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

export const GetTeacherOptionsDocument = new TypedDocumentString(`
    query GetTeacherOptions($input: GetSchoolTeachersInput!) {
  getSchoolTeachers(input: $input) {
    data {
      id
      schoolProfile {
        firstName
        lastName
        avatarUrl
      }
    }
  }
}
    `);

export const useGetTeacherOptionsQuery = <
      TData = GetTeacherOptionsQuery,
      TError = unknown
    >(
      variables: GetTeacherOptionsQueryVariables,
      options?: Omit<UseQueryOptions<GetTeacherOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTeacherOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetTeacherOptionsQuery, TError, TData>(
      {
    queryKey: ['GetTeacherOptions', variables],
    queryFn: fetcher<GetTeacherOptionsQuery, GetTeacherOptionsQueryVariables>(GetTeacherOptionsDocument, variables),
    ...options
  }
    )};

useGetTeacherOptionsQuery.getKey = (variables: GetTeacherOptionsQueryVariables) => ['GetTeacherOptions', variables];

export const useInfiniteGetTeacherOptionsQuery = <
      TData = InfiniteData<GetTeacherOptionsQuery>,
      TError = unknown
    >(
      variables: GetTeacherOptionsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetTeacherOptionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetTeacherOptionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetTeacherOptionsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetTeacherOptions.infinite', variables],
      queryFn: (metaData) => fetcher<GetTeacherOptionsQuery, GetTeacherOptionsQueryVariables>(GetTeacherOptionsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetTeacherOptionsQuery.getKey = (variables: GetTeacherOptionsQueryVariables) => ['GetTeacherOptions.infinite', variables];


useGetTeacherOptionsQuery.fetcher = (variables: GetTeacherOptionsQueryVariables, options?: RequestInit['headers']) => fetcher<GetTeacherOptionsQuery, GetTeacherOptionsQueryVariables>(GetTeacherOptionsDocument, variables, options);

export const CreateTeacherDocument = new TypedDocumentString(`
    mutation CreateTeacher($input: CreateTeacherInput!) {
  createTeacher(input: $input) {
    ...TeacherListData
  }
}
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
        id
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
}`);

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

export const GetTeacherDetailsDocument = new TypedDocumentString(`
    query GetTeacherDetails($id: ID!) {
  teacher(id: $id) {
    id
    specialization
    diploma
    experience
    bio
    hireDate
    salary
    department
    weeklyHours
    isActive
    createdAt
    classesCount
    schoolUser {
      user {
        id
        email
        phoneNumber
      }
    }
    schoolProfile {
      id
      firstName
      lastName
      avatarUrl
      gender
      address
    }
  }
}
    `);

export const useGetTeacherDetailsQuery = <
      TData = GetTeacherDetailsQuery,
      TError = unknown
    >(
      variables: GetTeacherDetailsQueryVariables,
      options?: Omit<UseQueryOptions<GetTeacherDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTeacherDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetTeacherDetailsQuery, TError, TData>(
      {
    queryKey: ['GetTeacherDetails', variables],
    queryFn: fetcher<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>(GetTeacherDetailsDocument, variables),
    ...options
  }
    )};

useGetTeacherDetailsQuery.getKey = (variables: GetTeacherDetailsQueryVariables) => ['GetTeacherDetails', variables];

export const useInfiniteGetTeacherDetailsQuery = <
      TData = InfiniteData<GetTeacherDetailsQuery>,
      TError = unknown
    >(
      variables: GetTeacherDetailsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetTeacherDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetTeacherDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetTeacherDetailsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetTeacherDetails.infinite', variables],
      queryFn: (metaData) => fetcher<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>(GetTeacherDetailsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetTeacherDetailsQuery.getKey = (variables: GetTeacherDetailsQueryVariables) => ['GetTeacherDetails.infinite', variables];


useGetTeacherDetailsQuery.fetcher = (variables: GetTeacherDetailsQueryVariables, options?: RequestInit['headers']) => fetcher<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>(GetTeacherDetailsDocument, variables, options);

export const DeleteTeachersDocument = new TypedDocumentString(`
    mutation DeleteTeachers($teacherIds: [ID!]!, $soft: Boolean) {
  deleteTeachers(teacherIds: $teacherIds, soft: $soft) {
    ok
    message
  }
}
    `);

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

export const UpdateTeacherDocument = new TypedDocumentString(`
    mutation UpdateTeacher($teacherId: ID!, $data: CreateTeacherInput!) {
  updateTeacher(teacherId: $teacherId, data: $data) {
    ...TeacherListData
  }
}
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
        id
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
}`);

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

export const CreateTeacherAssignmentDocument = new TypedDocumentString(`
    mutation CreateTeacherAssignment($input: CreateTeacherAssignmentInput!) {
  createTeacherAssignment(input: $input) {
    id
    classSubject {
      subject {
        id
        name
        code
      }
      group {
        classes {
          id
          name
          level
        }
      }
    }
  }
}
    `);

export const useCreateTeacherAssignmentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTeacherAssignmentMutation, TError, CreateTeacherAssignmentMutationVariables, TContext>) => {
    
    return useMutation<CreateTeacherAssignmentMutation, TError, CreateTeacherAssignmentMutationVariables, TContext>(
      {
    mutationKey: ['CreateTeacherAssignment'],
    mutationFn: (variables?: CreateTeacherAssignmentMutationVariables) => fetcher<CreateTeacherAssignmentMutation, CreateTeacherAssignmentMutationVariables>(CreateTeacherAssignmentDocument, variables)(),
    ...options
  }
    )};


useCreateTeacherAssignmentMutation.fetcher = (variables: CreateTeacherAssignmentMutationVariables, options?: RequestInit['headers']) => fetcher<CreateTeacherAssignmentMutation, CreateTeacherAssignmentMutationVariables>(CreateTeacherAssignmentDocument, variables, options);

export const SyncTeacherAssignmentDocument = new TypedDocumentString(`
    mutation SyncTeacherAssignment($input: CreateTeacherAssignmentInput!) {
  syncTeacherAssignment(input: $input) {
    ok
    message
    details
  }
}
    `);

export const useSyncTeacherAssignmentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SyncTeacherAssignmentMutation, TError, SyncTeacherAssignmentMutationVariables, TContext>) => {
    
    return useMutation<SyncTeacherAssignmentMutation, TError, SyncTeacherAssignmentMutationVariables, TContext>(
      {
    mutationKey: ['SyncTeacherAssignment'],
    mutationFn: (variables?: SyncTeacherAssignmentMutationVariables) => fetcher<SyncTeacherAssignmentMutation, SyncTeacherAssignmentMutationVariables>(SyncTeacherAssignmentDocument, variables)(),
    ...options
  }
    )};


useSyncTeacherAssignmentMutation.fetcher = (variables: SyncTeacherAssignmentMutationVariables, options?: RequestInit['headers']) => fetcher<SyncTeacherAssignmentMutation, SyncTeacherAssignmentMutationVariables>(SyncTeacherAssignmentDocument, variables, options);

export const GetMeDocument = new TypedDocumentString(`
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
    `);

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
