import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '../lib/graphql-fetcher';
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
  day: Scalars['String']['output'];
  endTime?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Subject>;
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
  gender?: Maybe<Scalars['String']['output']>;
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
  className?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  matricule: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  schoolClass?: Maybe<Classe>;
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

export type GetAdminDashboardStatsQueryVariables = Exact<{
  schoolId: Scalars['SchoolId']['input'];
}>;


export type GetAdminDashboardStatsQuery = { __typename?: 'Query', school: { __typename?: 'School', id?: string | null, name: string, logo?: string | null, stats?: { __typename?: 'SchoolStats', totalStudents: number, totalTeachers: number, totalClasses: number, pendingPaymentsCount?: number | null, monthlyRevenue?: { __typename?: 'MonthlyRevenue', previousMonth?: number | null, currentMonth: number } | null, attendance?: { __typename?: 'AttendanceStats', rate: number, presentCount: number, absentCount: number, totalExpected: number, lateCount: number, history?: Array<{ __typename?: 'DailyAttendance', date: string, rate: number, present: number, absent: number, late: number }> | null } | null, studentGender?: { __typename?: 'GenderStats', male: number, female: number } | null, classesOccupancy?: Array<{ __typename?: 'ClassStats', className: string, studentCount: number }> | null, enrollmentPerMonth?: Array<{ __typename?: 'MonthlyStats', month: string, count: number }> | null } | null } };

export type SearchStudentQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type SearchStudentQuery = { __typename?: 'Query', searchStudent?: Array<{ __typename?: 'Student', id: string, firstname: string, lastname: string, matricule: string, photo?: string | null, className?: string | null } | null> | null };

export type SearchSchoolQueryVariables = Exact<{
  input: SchoolSearchInput;
}>;


export type SearchSchoolQuery = { __typename?: 'Query', searchSchool?: Array<{ __typename?: 'School', id?: string | null, name: string, address: string, code?: string | null, logo?: string | null }> | null };

export type GetClassSubjectsQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type GetClassSubjectsQuery = { __typename?: 'Query', getClassSubjects?: Array<{ __typename?: 'Classe', id: string, name: string, level: string, section?: string | null, subjects?: Array<{ __typename?: 'Subject', id: string, name: string, code?: string | null } | null> | null } | null> | null };

export type ConfirmCompleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type ConfirmCompleteProfileMutation = { __typename?: 'Mutation', confirmCompleteProfile?: { __typename?: 'UserPayload', ok?: boolean | null, message?: string | null, user?: { __typename?: 'User', id: string, email: string, profileCompleted?: boolean | null, hasMembership?: boolean | null } | null } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, phoneNumber?: string | null, email: string, profileCompleted?: boolean | null, hasMembership?: boolean | null, profile?: { __typename?: 'Profile', id: string, address?: string | null, firstname: string, lastname: string, gender?: string | null, photo?: string | null } | null, memberships?: Array<{ __typename?: 'SchoolMembership', id: string, role: string, school: { __typename?: 'School', id?: string | null, name: string, logo?: string | null, slug?: string | null, address: string } } | null> | null } | null };

export type GetDashboardContextQueryVariables = Exact<{
  input: Scalars['SchoolId']['input'];
}>;


export type GetDashboardContextQuery = { __typename?: 'Query', me?: { __typename?: 'User', schoolContext?: { __typename?: 'SchoolMembership', id: string, role: string, teacher?: { __typename?: 'Teacher', id: string, departement?: string | null, specialization?: string | null, classes?: Array<{ __typename?: 'Classe', id: string, name: string, section?: string | null, subjects?: Array<{ __typename?: 'Subject', id: string, name: string, lessons?: Array<{ __typename?: 'Lesson', id: string, name?: string | null, startTime?: string | null, endTime?: string | null, day: string } | null> | null } | null> | null } | null> | null, supervisedClasses?: Array<{ __typename?: 'Classe', id: string, section?: string | null } | null> | null } | null, staff?: { __typename?: 'Staff', id: string, position: string, departement?: string | null, schoolUserId: string } | null, parent?: { __typename?: 'Parent', id: string, isDelegate?: boolean | null, students?: Array<{ __typename?: 'Student', id: string, className?: string | null, firstname: string, matricule: string } | null> | null } | null, student?: { __typename?: 'Student', id: string, className?: string | null, lastname: string, firstname: string, matricule: string } | null } | null } | null };

export type GetSchoolTeachersQueryVariables = Exact<{
  schoolId: Scalars['SchoolId']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  classId?: InputMaybe<Scalars['ID']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSupervisor?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetSchoolTeachersQuery = { __typename?: 'Query', getSchoolTeachers: { __typename?: 'TeacherList', meta: { __typename?: 'PaginationMeta', limit: number, total: number, totalPages: number }, data: Array<{ __typename?: 'Teacher', id: string, schoolUserId: string, weeklyHours?: number | null, specialization?: string | null, departement?: string | null, experience?: string | null, isActive?: boolean | null, supervisedClasses?: Array<{ __typename?: 'Classe', id: string, name: string, level: string } | null> | null, user?: { __typename?: 'User', email: string, phoneNumber?: string | null, profile?: { __typename?: 'Profile', firstname: string, lastname: string, photo?: string | null } | null } | null, classes?: Array<{ __typename?: 'Classe', id: string, name: string } | null> | null }> } };

export type GetTeacherDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTeacherDetailsQuery = { __typename?: 'Query', teacher?: { __typename?: 'Teacher', id: string, specialization?: string | null, diploma?: string | null, experience?: string | null, hireDate?: any | null, salary?: number | null, departement?: string | null, weeklyHours?: number | null, isActive?: boolean | null, createdAt?: any | null, user?: { __typename?: 'User', id: string, email: string, phoneNumber?: string | null, profile?: { __typename?: 'Profile', firstname: string, lastname: string, photo?: string | null, gender?: string | null, address?: string | null } | null } | null, classes?: Array<{ __typename?: 'Classe', id: string, name: string, level: string, _count?: { __typename?: 'ClassCount', students: number } | null } | null> | null, lessons?: Array<{ __typename?: 'Lesson', id: string, name?: string | null, day: string, startTime?: string | null, endTime?: string | null, class?: { __typename?: 'Classe', name: string } | null, subject?: { __typename?: 'Subject', name: string } | null } | null> | null } | null };

export type DeleteTeachersMutationVariables = Exact<{
  teacherIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  schoolId: Scalars['ID']['input'];
}>;


export type DeleteTeachersMutation = { __typename?: 'Mutation', deleteTeachers?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };

export type CreateTeacherMutationVariables = Exact<{
  data: CreateTeacherInput;
  schoolId: Scalars['ID']['input'];
}>;


export type CreateTeacherMutation = { __typename?: 'Mutation', createListTeachers?: { __typename?: 'ApiResponse', ok?: boolean | null, message?: string | null } | null };



export const GetAdminDashboardStatsDocument = `
    query GetAdminDashboardStats($schoolId: SchoolId!) {
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
      attendance {
        rate
        presentCount
        absentCount
        totalExpected
        lateCount
        history {
          date
          rate
          present
          absent
          late
        }
      }
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

export const SearchStudentDocument = `
    query SearchStudent($input: StudentSearchInput!) {
  searchStudent(filter: $input) {
    id
    firstname
    lastname
    matricule
    photo
    className
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

export const GetClassSubjectsDocument = `
    query GetClassSubjects($input: StudentSearchInput!) {
  getClassSubjects(filter: $input) {
    id
    name
    level
    section
    subjects {
      id
      name
      code
    }
  }
}
    `;

export const useGetClassSubjectsQuery = <
      TData = GetClassSubjectsQuery,
      TError = unknown
    >(
      variables: GetClassSubjectsQueryVariables,
      options?: Omit<UseQueryOptions<GetClassSubjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetClassSubjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetClassSubjectsQuery, TError, TData>(
      {
    queryKey: ['GetClassSubjects', variables],
    queryFn: fetcher<GetClassSubjectsQuery, GetClassSubjectsQueryVariables>(GetClassSubjectsDocument, variables),
    ...options
  }
    )};

useGetClassSubjectsQuery.getKey = (variables: GetClassSubjectsQueryVariables) => ['GetClassSubjects', variables];

export const useInfiniteGetClassSubjectsQuery = <
      TData = InfiniteData<GetClassSubjectsQuery>,
      TError = unknown
    >(
      variables: GetClassSubjectsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetClassSubjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetClassSubjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetClassSubjectsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetClassSubjects.infinite', variables],
      queryFn: (metaData) => fetcher<GetClassSubjectsQuery, GetClassSubjectsQueryVariables>(GetClassSubjectsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetClassSubjectsQuery.getKey = (variables: GetClassSubjectsQueryVariables) => ['GetClassSubjects.infinite', variables];


useGetClassSubjectsQuery.fetcher = (variables: GetClassSubjectsQueryVariables, options?: RequestInit['headers']) => fetcher<GetClassSubjectsQuery, GetClassSubjectsQueryVariables>(GetClassSubjectsDocument, variables, options);

export const ConfirmCompleteProfileDocument = `
    mutation ConfirmCompleteProfile {
  confirmCompleteProfile {
    ok
    message
    user {
      id
      email
      profileCompleted
      hasMembership
    }
  }
}
    `;

export const useConfirmCompleteProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ConfirmCompleteProfileMutation, TError, ConfirmCompleteProfileMutationVariables, TContext>) => {
    
    return useMutation<ConfirmCompleteProfileMutation, TError, ConfirmCompleteProfileMutationVariables, TContext>(
      {
    mutationKey: ['ConfirmCompleteProfile'],
    mutationFn: (variables?: ConfirmCompleteProfileMutationVariables) => fetcher<ConfirmCompleteProfileMutation, ConfirmCompleteProfileMutationVariables>(ConfirmCompleteProfileDocument, variables)(),
    ...options
  }
    )};


useConfirmCompleteProfileMutation.fetcher = (variables?: ConfirmCompleteProfileMutationVariables, options?: RequestInit['headers']) => fetcher<ConfirmCompleteProfileMutation, ConfirmCompleteProfileMutationVariables>(ConfirmCompleteProfileDocument, variables, options);

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
      firstname
      lastname
      gender
      photo
    }
    memberships {
      id
      role
      school {
        id
        name
        logo
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

export const GetDashboardContextDocument = `
    query GetDashboardContext($input: SchoolId!) {
  me {
    schoolContext(schoolId: $input) {
      id
      role
      teacher {
        id
        departement
        specialization
        classes {
          id
          name
          section
          subjects {
            id
            name
            lessons {
              id
              name
              startTime
              endTime
              day
            }
          }
        }
        supervisedClasses {
          id
          section
          section
        }
      }
      staff {
        id
        position
        departement
        schoolUserId
      }
      parent {
        id
        isDelegate
        students {
          id
          className
          firstname
          matricule
        }
      }
      student {
        id
        className
        lastname
        firstname
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

export const GetSchoolTeachersDocument = `
    query GetSchoolTeachers($schoolId: SchoolId!, $page: Int, $limit: Int, $searchTerm: String, $classId: ID, $specialization: String, $isActive: Boolean, $isSupervisor: Boolean) {
  getSchoolTeachers(
    schoolId: $schoolId
    page: $page
    limit: $limit
    searchTerm: $searchTerm
    classId: $classId
    specialization: $specialization
    isActive: $isActive
    isSupervisor: $isSupervisor
  ) {
    meta {
      limit
      total
      totalPages
    }
    data {
      id
      schoolUserId
      supervisedClasses {
        id
        name
        level
      }
      weeklyHours
      specialization
      departement
      experience
      isActive
      user {
        email
        phoneNumber
        profile {
          firstname
          lastname
          photo
        }
      }
      classes {
        id
        name
      }
    }
  }
}
    `;

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

export const GetTeacherDetailsDocument = `
    query GetTeacherDetails($id: ID!) {
  teacher(id: $id) {
    id
    specialization
    diploma
    experience
    hireDate
    salary
    departement
    weeklyHours
    isActive
    createdAt
    user {
      id
      email
      phoneNumber
      profile {
        firstname
        lastname
        photo
        gender
        address
      }
    }
    classes {
      id
      name
      level
      _count {
        students
      }
    }
    lessons {
      id
      name
      day
      startTime
      endTime
      class {
        name
      }
      subject {
        name
      }
    }
  }
}
    `;

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

export const DeleteTeachersDocument = `
    mutation DeleteTeachers($teacherIds: [ID!]!, $schoolId: ID!) {
  deleteTeachers(teacherIds: $teacherIds, schoolId: $schoolId) {
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

export const CreateTeacherDocument = `
    mutation CreateTeacher($data: CreateTeacherInput!, $schoolId: ID!) {
  createListTeachers(data: $data, schoolId: $schoolId) {
    ok
    message
  }
}
    `;

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
