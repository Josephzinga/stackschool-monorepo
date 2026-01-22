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
  SchoolId: { input: any; output: any; }
};

export type ChildInput = {
  relation?: InputMaybe<Relation>;
  studentId: Scalars['ID']['input'];
};

export type ClassStats = {
  __typename?: 'ClassStats';
  className: Scalars['String']['output'];
  studentCount: Scalars['Int']['output'];
};

export type Classe = {
  __typename?: 'Classe';
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  level: Scalars['String']['output'];
  name: Scalars['String']['output'];
  section?: Maybe<Scalars['String']['output']>;
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
  day: Scalars['String']['output'];
  endTime?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
};

export type MonthlyStats = {
  __typename?: 'MonthlyStats';
  count: Scalars['Int']['output'];
  month: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmCompleteProfile?: Maybe<UserPayload>;
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
  me?: Maybe<User>;
  schoolStats?: Maybe<School>;
  searchSchool?: Maybe<Array<School>>;
  searchStudent?: Maybe<Array<Maybe<Student>>>;
  verifyInvitationCode?: Maybe<User>;
};


export type QueryGetClassSubjectsArgs = {
  filter: StudentSearchInput;
};


export type QuerySchoolStatsArgs = {
  schoolId?: InputMaybe<Scalars['SchoolId']['input']>;
};


export type QuerySearchSchoolArgs = {
  filter: SchoolSearchInput;
};


export type QuerySearchStudentArgs = {
  filter: StudentSearchInput;
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
  address?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  stats?: Maybe<SchoolStats>;
};

export type SchoolIdInput = {
  id: Scalars['ID']['input'];
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
  absentTodayCount?: Maybe<Scalars['Int']['output']>;
  classesOccupancy?: Maybe<Array<ClassStats>>;
  enrollmentPerMonth?: Maybe<Array<MonthlyStats>>;
  monthlyRevenue?: Maybe<Scalars['Float']['output']>;
  pendingPaymentsCount?: Maybe<Scalars['Int']['output']>;
  studentGender?: Maybe<GenderStats>;
  todayAttendanceRate?: Maybe<Scalars['Float']['output']>;
  totalClasses: Scalars['Int']['output'];
  totalStudents: Scalars['Int']['output'];
  totalTeachers: Scalars['Int']['output'];
};

export type Staff = {
  __typename?: 'Staff';
  departement?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  salary?: Maybe<Scalars['Float']['output']>;
  schoolUserId: Scalars['String']['output'];
};

export type Student = {
  __typename?: 'Student';
  className?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  matricule: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  schoolClass?: Maybe<Classe>;
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
  classes?: Maybe<Array<Maybe<Classe>>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  departement?: Maybe<Scalars['String']['output']>;
  diploma?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  salary?: Maybe<Scalars['Float']['output']>;
  schoolUserId: Scalars['String']['output'];
  specialization?: Maybe<Scalars['String']['output']>;
  supervisedClasses?: Maybe<Array<Maybe<Classe>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChildInput: ChildInput;
  ClassStats: ResolverTypeWrapper<ClassStats>;
  Classe: ResolverTypeWrapper<Classe>;
  ContactPreference: ContactPreference;
  CreateInvitationInput: CreateInvitationInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GenderStats: ResolverTypeWrapper<GenderStats>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InvitationCodeInput: InvitationCodeInput;
  Lesson: ResolverTypeWrapper<Lesson>;
  MonthlyStats: ResolverTypeWrapper<MonthlyStats>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Parent: ResolverTypeWrapper<Parent>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Relation: Relation;
  Role: Role;
  School: ResolverTypeWrapper<School>;
  SchoolId: ResolverTypeWrapper<Scalars['SchoolId']['output']>;
  SchoolIdInput: SchoolIdInput;
  SchoolMembership: ResolverTypeWrapper<SchoolMembership>;
  SchoolRole: SchoolRole;
  SchoolSearchInput: SchoolSearchInput;
  SchoolStats: ResolverTypeWrapper<SchoolStats>;
  Staff: ResolverTypeWrapper<Staff>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Student: ResolverTypeWrapper<Student>;
  StudentSearchInput: StudentSearchInput;
  Subject: ResolverTypeWrapper<Subject>;
  Teacher: ResolverTypeWrapper<Teacher>;
  User: ResolverTypeWrapper<User>;
  UserPayload: ResolverTypeWrapper<UserPayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ChildInput: ChildInput;
  ClassStats: ClassStats;
  Classe: Classe;
  CreateInvitationInput: CreateInvitationInput;
  Float: Scalars['Float']['output'];
  GenderStats: GenderStats;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InvitationCodeInput: InvitationCodeInput;
  Lesson: Lesson;
  MonthlyStats: MonthlyStats;
  Mutation: Record<PropertyKey, never>;
  Parent: Parent;
  Profile: Profile;
  Query: Record<PropertyKey, never>;
  Role: Role;
  School: School;
  SchoolId: Scalars['SchoolId']['output'];
  SchoolIdInput: SchoolIdInput;
  SchoolMembership: SchoolMembership;
  SchoolSearchInput: SchoolSearchInput;
  SchoolStats: SchoolStats;
  Staff: Staff;
  String: Scalars['String']['output'];
  Student: Student;
  StudentSearchInput: StudentSearchInput;
  Subject: Subject;
  Teacher: Teacher;
  User: User;
  UserPayload: UserPayload;
}>;

export type ClassStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClassStats'] = ResolversParentTypes['ClassStats']> = ResolversObject<{
  className?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClasseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Classe'] = ResolversParentTypes['Classe']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subject']>>>, ParentType, ContextType>;
}>;

export type GenderStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenderStats'] = ResolversParentTypes['GenderStats']> = ResolversObject<{
  female?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  male?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type LessonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Lesson'] = ResolversParentTypes['Lesson']> = ResolversObject<{
  day?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type MonthlyStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthlyStats'] = ResolversParentTypes['MonthlyStats']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmCompleteProfile?: Resolver<Maybe<ResolversTypes['UserPayload']>, ParentType, ContextType>;
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
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  schoolStats?: Resolver<Maybe<ResolversTypes['School']>, ParentType, ContextType, Partial<QuerySchoolStatsArgs>>;
  searchSchool?: Resolver<Maybe<Array<ResolversTypes['School']>>, ParentType, ContextType, RequireFields<QuerySearchSchoolArgs, 'filter'>>;
  searchStudent?: Resolver<Maybe<Array<Maybe<ResolversTypes['Student']>>>, ParentType, ContextType, RequireFields<QuerySearchStudentArgs, 'filter'>>;
  verifyInvitationCode?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryVerifyInvitationCodeArgs, 'code'>>;
}>;

export type SchoolResolvers<ContextType = Context, ParentType extends ResolversParentTypes['School'] = ResolversParentTypes['School']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['SchoolStats']>, ParentType, ContextType>;
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
  absentTodayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  classesOccupancy?: Resolver<Maybe<Array<ResolversTypes['ClassStats']>>, ParentType, ContextType>;
  enrollmentPerMonth?: Resolver<Maybe<Array<ResolversTypes['MonthlyStats']>>, ParentType, ContextType>;
  monthlyRevenue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  pendingPaymentsCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  studentGender?: Resolver<Maybe<ResolversTypes['GenderStats']>, ParentType, ContextType>;
  todayAttendanceRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalClasses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalStudents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTeachers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type StaffResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Staff'] = ResolversParentTypes['Staff']> = ResolversObject<{
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  className?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matricule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schoolClass?: Resolver<Maybe<ResolversTypes['Classe']>, ParentType, ContextType>;
}>;

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  classes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classe']>>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  diploma?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  experience?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lessons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lesson']>>>, ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supervisedClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classe']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  ClassStats?: ClassStatsResolvers<ContextType>;
  Classe?: ClasseResolvers<ContextType>;
  GenderStats?: GenderStatsResolvers<ContextType>;
  Lesson?: LessonResolvers<ContextType>;
  MonthlyStats?: MonthlyStatsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Parent?: ParentResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  School?: SchoolResolvers<ContextType>;
  SchoolId?: GraphQLScalarType;
  SchoolMembership?: SchoolMembershipResolvers<ContextType>;
  SchoolStats?: SchoolStatsResolvers<ContextType>;
  Staff?: StaffResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPayload?: UserPayloadResolvers<ContextType>;
}>;

