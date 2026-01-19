import { GraphQLResolveInfo } from 'graphql';
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
};

export type ChildInput = {
  relation?: InputMaybe<Relation>;
  studentId: Scalars['ID']['input'];
};

export type Classes = {
  __typename?: 'Classes';
  id: Scalars['ID']['output'];
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
  schoolId: Scalars['String']['input'];
};

export type InvitationCodeInput = {
  code: Scalars['String']['input'];
};

export type Memberships = {
  __typename?: 'Memberships';
  id: Scalars['ID']['output'];
  staff?: Maybe<Staff>;
  student?: Maybe<Student>;
  teacher?: Maybe<Teacher>;
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmCompleteProfile?: Maybe<UserPayload>;
};

export type Profile = {
  __typename?: 'Profile';
  firstname: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getClassSubjects?: Maybe<Array<Maybe<Classes>>>;
  me?: Maybe<User>;
  searchSchool?: Maybe<Array<School>>;
  searchStudent?: Maybe<Array<Maybe<Student>>>;
  verifyInvitationCode?: Maybe<Scalars['String']['output']>;
};


export type QueryGetClassSubjectsArgs = {
  filter: StudentSearchInput;
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
  address: Scalars['String']['output'];
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug?: Maybe<Scalars['String']['output']>;
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
  className: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  matricule: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
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
  name: Scalars['String']['output'];
};

export type Teacher = {
  __typename?: 'Teacher';
  addrress?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  departement?: Maybe<Scalars['String']['output']>;
  diploma?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['String']['output']>;
  hireDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  schoolUserId: Scalars['String']['output'];
  specialization?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  hasMembership?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  memberships?: Maybe<Memberships>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Profile>;
  profileCompleted?: Maybe<Scalars['Boolean']['output']>;
  school?: Maybe<Array<Maybe<School>>>;
  schoolId?: Maybe<Scalars['ID']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserPayload = {
  __typename?: 'UserPayload';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  user: User;
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
  Classes: ResolverTypeWrapper<Classes>;
  ContactPreference: ContactPreference;
  CreateInvitationInput: CreateInvitationInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  InvitationCodeInput: InvitationCodeInput;
  Memberships: ResolverTypeWrapper<Memberships>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Relation: Relation;
  Role: Role;
  School: ResolverTypeWrapper<School>;
  SchoolRole: SchoolRole;
  SchoolSearchInput: SchoolSearchInput;
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
  Classes: Classes;
  CreateInvitationInput: CreateInvitationInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  InvitationCodeInput: InvitationCodeInput;
  Memberships: Memberships;
  Mutation: Record<PropertyKey, never>;
  Profile: Profile;
  Query: Record<PropertyKey, never>;
  Role: Role;
  School: School;
  SchoolSearchInput: SchoolSearchInput;
  Staff: Staff;
  String: Scalars['String']['output'];
  Student: Student;
  StudentSearchInput: StudentSearchInput;
  Subject: Subject;
  Teacher: Teacher;
  User: User;
  UserPayload: UserPayload;
}>;

export type ClassesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Classes'] = ResolversParentTypes['Classes']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subject']>>>, ParentType, ContextType>;
}>;

export type MembershipsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Memberships'] = ResolversParentTypes['Memberships']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  staff?: Resolver<Maybe<ResolversTypes['Staff']>, ParentType, ContextType>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType>;
  teacher?: Resolver<Maybe<ResolversTypes['Teacher']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmCompleteProfile?: Resolver<Maybe<ResolversTypes['UserPayload']>, ParentType, ContextType>;
}>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getClassSubjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classes']>>>, ParentType, ContextType, RequireFields<QueryGetClassSubjectsArgs, 'filter'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  searchSchool?: Resolver<Maybe<Array<ResolversTypes['School']>>, ParentType, ContextType, RequireFields<QuerySearchSchoolArgs, 'filter'>>;
  searchStudent?: Resolver<Maybe<Array<Maybe<ResolversTypes['Student']>>>, ParentType, ContextType, RequireFields<QuerySearchStudentArgs, 'filter'>>;
  verifyInvitationCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryVerifyInvitationCodeArgs, 'code'>>;
}>;

export type SchoolResolvers<ContextType = Context, ParentType extends ResolversParentTypes['School'] = ResolversParentTypes['School']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  className?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matricule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  addrress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  departement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  diploma?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  experience?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hireDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  schoolUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasMembership?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memberships?: Resolver<Maybe<ResolversTypes['Memberships']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileCompleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  school?: Resolver<Maybe<Array<Maybe<ResolversTypes['School']>>>, ParentType, ContextType>;
  schoolId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserPayload'] = ResolversParentTypes['UserPayload']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Classes?: ClassesResolvers<ContextType>;
  Memberships?: MembershipsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  School?: SchoolResolvers<ContextType>;
  Staff?: StaffResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPayload?: UserPayloadResolvers<ContextType>;
}>;

