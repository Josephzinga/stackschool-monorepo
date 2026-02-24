import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '@stackschool/shared';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  SchoolId: { input: any; output: any; }
};

export type ApiResponse = {
  __typename?: 'ApiResponse';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
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

export type ChildInput = {
  relation?: InputMaybe<Relation>;
  studentId: Scalars['ID']['input'];
};

export type ClassCount = {
  __typename?: 'ClassCount';
  students: Scalars['Int']['output'];
};

export type ClassList = {
  __typename?: 'ClassList';
  data: Array<Classe>;
  meta: PaginationMeta;
};

export type ClassStats = {
  __typename?: 'ClassStats';
  className: Scalars['String']['output'];
  studentCount: Scalars['Int']['output'];
};

export type Classe = {
  __typename?: 'Classe';
  _count?: Maybe<ClassCount>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  level: Scalars['String']['output'];
  name: Scalars['String']['output'];
  section?: Maybe<Scalars['String']['output']>;
  students?: Maybe<Array<Maybe<Student>>>;
  subjects?: Maybe<Array<Maybe<Subject>>>;
};

export enum ContactPreference {
  Email = 'EMAIL',
  Phone = 'PHONE',
  Whatsapp = 'WHATSAPP'
}

export type CreateInvitationInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<SchoolRole>;
  schoolId: Scalars['ID']['input'];
};

export type CreateTeacherInput = {
  classIds?: InputMaybe<Array<Scalars['String']['input']>>;
  diploma?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname: Scalars['String']['input'];
  gender?: InputMaybe<Gender>;
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

export enum Day {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type GenderStats = {
  __typename?: 'GenderStats';
  female: Scalars['Int']['output'];
  male: Scalars['Int']['output'];
};

export type InvitationCodeInput = {
  code: Scalars['String']['input'];
};

export type Lesson = {
  __typename?: 'Lesson';
  class?: Maybe<Classe>;
  day?: Maybe<Day>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  startTime?: Maybe<Scalars['DateTime']['output']>;
  subject?: Maybe<Subject>;
  title?: Maybe<Scalars['String']['output']>;
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
  createListTeachers?: Maybe<ApiResponse>;
  deleteTeachers?: Maybe<ApiResponse>;
};


export type MutationCreateListTeachersArgs = {
  data?: InputMaybe<CreateTeacherInput>;
  schoolId: Scalars['ID']['input'];
};


export type MutationDeleteTeachersArgs = {
  schoolId: Scalars['ID']['input'];
  teacherIds: Array<Scalars['ID']['input']>;
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
  profession?: Maybe<Scalars['String']['output']>;
  relationType?: Maybe<Scalars['String']['output']>;
  students?: Maybe<Array<Maybe<Student>>>;
};

export type Profile = {
  __typename?: 'Profile';
  address?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getClassSubjects?: Maybe<Array<Maybe<Classe>>>;
  getSchoolClasses: ClassList;
  getSchoolStudents: StudentList;
  getSchoolTeachers: TeacherList;
  me?: Maybe<User>;
  school: School;
  searchSchool?: Maybe<Array<School>>;
  searchStudent?: Maybe<Array<Maybe<Student>>>;
  teacher?: Maybe<Teacher>;
  verifyInvitationCode?: Maybe<User>;
};


export type QueryGetClassSubjectsArgs = {
  filter: StudentSearchInput;
};


export type QueryGetSchoolClassesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  schoolId: Scalars['ID']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSchoolStudentsArgs = {
  classId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  schoolId: Scalars['ID']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSchoolTeachersArgs = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSupervisor?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  schoolId: Scalars['SchoolId']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySchoolArgs = {
  schoolId: Scalars['SchoolId']['input'];
};


export type QuerySearchSchoolArgs = {
  filter: SchoolSearchInput;
};


export type QuerySearchStudentArgs = {
  filter: StudentSearchInput;
};


export type QueryTeacherArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVerifyInvitationCodeArgs = {
  code: InvitationCodeInput;
};

export enum Relation {
  Aunt = 'AUNT',
  Father = 'FATHER',
  GrandFather = 'GRAND_FATHER',
  GrandMother = 'GRAND_MOTHER',
  Guardian = 'GUARDIAN',
  Mother = 'MOTHER',
  Other = 'OTHER',
  Uncle = 'UNCLE'
}

export type Role = {
  role?: InputMaybe<SchoolRole>;
};

export type School = {
  __typename?: 'School';
  address: Scalars['String']['output'];
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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
  id: Scalars['ID']['output'];
  matricule: Scalars['String']['output'];
  parents?: Maybe<Array<Maybe<Parent>>>;
  schoolClass?: Maybe<Classe>;
  user?: Maybe<User>;
};

export type StudentList = {
  __typename?: 'StudentList';
  data: Array<Student>;
  meta: PaginationMeta;
};

export type StudentSearchInput = {
  getOnly?: InputMaybe<Scalars['Boolean']['input']>;
  schoolId: Scalars['ID']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};

export type Subject = {
  __typename?: 'Subject';
  code?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  name: Scalars['String']['output'];
};

export type Teacher = {
  __typename?: 'Teacher';
  bio?: Maybe<Scalars['String']['output']>;
  classes?: Maybe<Array<Maybe<Classe>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  departement?: Maybe<Scalars['String']['output']>;
  diploma?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  salary?: Maybe<Scalars['Float']['output']>;
  schoolUserId: Scalars['String']['output'];
  specialization?: Maybe<Scalars['String']['output']>;
  supervisedClasses?: Maybe<Array<Maybe<Classe>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  weeklyHours?: Maybe<Scalars['Float']['output']>;
};

export type TeacherList = {
  __typename?: 'TeacherList';
  data: Array<Teacher>;
  meta: PaginationMeta;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  hasMembership?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Profile>;
  profileCompleted?: Maybe<Scalars['Boolean']['output']>;
  schoolContext?: Maybe<SchoolMembership>;
  username: Scalars['String']['output'];
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





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ApiResponse: ResolverTypeWrapper<ApiResponse>;
  AttendanceStats: ResolverTypeWrapper<AttendanceStats>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChildInput: ChildInput;
  ClassCount: ResolverTypeWrapper<ClassCount>;
  ClassList: ResolverTypeWrapper<ClassList>;
  ClassStats: ResolverTypeWrapper<ClassStats>;
  Classe: ResolverTypeWrapper<Classe>;
  ContactPreference: ContactPreference;
  CreateInvitationInput: CreateInvitationInput;
  CreateTeacherInput: CreateTeacherInput;
  DailyAttendance: ResolverTypeWrapper<DailyAttendance>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Day: Day;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Gender: Gender;
  GenderStats: ResolverTypeWrapper<GenderStats>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InvitationCodeInput: InvitationCodeInput;
  Lesson: ResolverTypeWrapper<Lesson>;
  MonthlyRevenue: ResolverTypeWrapper<MonthlyRevenue>;
  MonthlyStats: ResolverTypeWrapper<MonthlyStats>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PaginationMeta: ResolverTypeWrapper<PaginationMeta>;
  Parent: ResolverTypeWrapper<Parent>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Relation: Relation;
  Role: Role;
  School: ResolverTypeWrapper<School>;
  SchoolId: ResolverTypeWrapper<Scalars['SchoolId']['output']>;
  SchoolMembership: ResolverTypeWrapper<SchoolMembership>;
  SchoolRole: SchoolRole;
  SchoolSearchInput: SchoolSearchInput;
  SchoolStats: ResolverTypeWrapper<SchoolStats>;
  Staff: ResolverTypeWrapper<Staff>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Student: ResolverTypeWrapper<Student>;
  StudentList: ResolverTypeWrapper<StudentList>;
  StudentSearchInput: StudentSearchInput;
  Subject: ResolverTypeWrapper<Subject>;
  Teacher: ResolverTypeWrapper<Teacher>;
  TeacherList: ResolverTypeWrapper<TeacherList>;
  User: ResolverTypeWrapper<User>;
  UserPayload: ResolverTypeWrapper<UserPayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ApiResponse: ApiResponse;
  AttendanceStats: AttendanceStats;
  Boolean: Scalars['Boolean']['output'];
  ChildInput: ChildInput;
  ClassCount: ClassCount;
  ClassList: ClassList;
  ClassStats: ClassStats;
  Classe: Classe;
  CreateInvitationInput: CreateInvitationInput;
  CreateTeacherInput: CreateTeacherInput;
  DailyAttendance: DailyAttendance;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  GenderStats: GenderStats;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InvitationCodeInput: InvitationCodeInput;
  Lesson: Lesson;
  MonthlyRevenue: MonthlyRevenue;
  MonthlyStats: MonthlyStats;
  Mutation: Record<PropertyKey, never>;
  PaginationMeta: PaginationMeta;
  Parent: Parent;
  Profile: Profile;
  Query: Record<PropertyKey, never>;
  Role: Role;
  School: School;
  SchoolId: Scalars['SchoolId']['output'];
  SchoolMembership: SchoolMembership;
  SchoolSearchInput: SchoolSearchInput;
  SchoolStats: SchoolStats;
  Staff: Staff;
  String: Scalars['String']['output'];
  Student: Student;
  StudentList: StudentList;
  StudentSearchInput: StudentSearchInput;
  Subject: Subject;
  Teacher: Teacher;
  TeacherList: TeacherList;
  User: User;
  UserPayload: UserPayload;
}>;

export type ApiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ApiResponse'] = ResolversParentTypes['ApiResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
}>;

export type AttendanceStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AttendanceStats'] = ResolversParentTypes['AttendanceStats']> = ResolversObject<{
  absentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  history?: Resolver<Maybe<Array<ResolversTypes['DailyAttendance']>>, ParentType, ContextType>;
  lateCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalExpected?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClassCountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassCount'] = ResolversParentTypes['ClassCount']> = ResolversObject<{
  students?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClassListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassList'] = ResolversParentTypes['ClassList']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Classe']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type ClassStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassStats'] = ResolversParentTypes['ClassStats']> = ResolversObject<{
  className?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClasseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Classe'] = ResolversParentTypes['Classe']> = ResolversObject<{
  _count?: Resolver<Maybe<ResolversTypes['ClassCount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  students?: Resolver<Maybe<Array<Maybe<ResolversTypes['Student']>>>, ParentType, ContextType>;
  subjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subject']>>>, ParentType, ContextType>;
}>;

export type DailyAttendanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DailyAttendance'] = ResolversParentTypes['DailyAttendance']> = ResolversObject<{
  absent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  late?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  present?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GenderStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenderStats'] = ResolversParentTypes['GenderStats']> = ResolversObject<{
  female?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  male?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type LessonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Lesson'] = ResolversParentTypes['Lesson']> = ResolversObject<{
  class?: Resolver<Maybe<ResolversTypes['Classe']>, ParentType, ContextType>;
  day?: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  createListTeachers?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationCreateListTeachersArgs, 'schoolId'>>;
  deleteTeachers?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationDeleteTeachersArgs, 'schoolId' | 'teacherIds'>>;
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
  profession?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relationType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  students?: Resolver<Maybe<Array<Maybe<ResolversTypes['Student']>>>, ParentType, ContextType>;
}>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getClassSubjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classe']>>>, ParentType, ContextType, RequireFields<QueryGetClassSubjectsArgs, 'filter'>>;
  getSchoolClasses?: Resolver<ResolversTypes['ClassList'], ParentType, ContextType, RequireFields<QueryGetSchoolClassesArgs, 'limit' | 'page' | 'schoolId'>>;
  getSchoolStudents?: Resolver<ResolversTypes['StudentList'], ParentType, ContextType, RequireFields<QueryGetSchoolStudentsArgs, 'limit' | 'page' | 'schoolId'>>;
  getSchoolTeachers?: Resolver<ResolversTypes['TeacherList'], ParentType, ContextType, RequireFields<QueryGetSchoolTeachersArgs, 'limit' | 'page' | 'schoolId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  school?: Resolver<ResolversTypes['School'], ParentType, ContextType, RequireFields<QuerySchoolArgs, 'schoolId'>>;
  searchSchool?: Resolver<Maybe<Array<ResolversTypes['School']>>, ParentType, ContextType, RequireFields<QuerySearchSchoolArgs, 'filter'>>;
  searchStudent?: Resolver<Maybe<Array<Maybe<ResolversTypes['Student']>>>, ParentType, ContextType, RequireFields<QuerySearchStudentArgs, 'filter'>>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType, RequireFields<QueryTeacherArgs, 'id'>>;
  verifyInvitationCode?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryVerifyInvitationCodeArgs, 'code'>>;
}>;

export type SchoolResolvers<ContextType = Context, ParentType extends ResolversParentTypes['School'] = ResolversParentTypes['School']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type StaffResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Staff'] = ResolversParentTypes['Staff']> = ResolversObject<{
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  matricule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Parent']>>>, ParentType, ContextType>;
  schoolClass?: Resolver<Maybe<ResolversTypes['Classe']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type StudentListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StudentList'] = ResolversParentTypes['StudentList']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classe']>>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  diploma?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  experience?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supervisedClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classe']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  weeklyHours?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
}>;

export type TeacherListResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeacherList'] = ResolversParentTypes['TeacherList']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Teacher']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasMembership?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memberships?: Resolver<Maybe<Array<Maybe<ResolversTypes['SchoolMembership']>>>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileCompleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  schoolContext?: Resolver<Maybe<ResolversTypes['SchoolMembership']>, ParentType, ContextType, Partial<UserSchoolContextArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type UserPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserPayload'] = ResolversParentTypes['UserPayload']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  ApiResponse?: ApiResponseResolvers<ContextType>;
  AttendanceStats?: AttendanceStatsResolvers<ContextType>;
  ClassCount?: ClassCountResolvers<ContextType>;
  ClassList?: ClassListResolvers<ContextType>;
  ClassStats?: ClassStatsResolvers<ContextType>;
  Classe?: ClasseResolvers<ContextType>;
  DailyAttendance?: DailyAttendanceResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  GenderStats?: GenderStatsResolvers<ContextType>;
  Lesson?: LessonResolvers<ContextType>;
  MonthlyRevenue?: MonthlyRevenueResolvers<ContextType>;
  MonthlyStats?: MonthlyStatsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationMeta?: PaginationMetaResolvers<ContextType>;
  Parent?: ParentResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  School?: SchoolResolvers<ContextType>;
  SchoolId?: GraphQLScalarType;
  SchoolMembership?: SchoolMembershipResolvers<ContextType>;
  SchoolStats?: SchoolStatsResolvers<ContextType>;
  Staff?: StaffResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  StudentList?: StudentListResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
  TeacherList?: TeacherListResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPayload?: UserPayloadResolvers<ContextType>;
}>;

