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

export type SearchStudentQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type SearchStudentQuery = { __typename?: 'Query', searchStudent?: Array<{ __typename?: 'Student', id: string, firstname: string, lastname: string, matricule: string, photo?: string | null, className: string } | null> | null };

export type SearchSchoolQueryVariables = Exact<{
  input: SchoolSearchInput;
}>;


export type SearchSchoolQuery = { __typename?: 'Query', searchSchool?: Array<{ __typename?: 'School', id?: string | null, name: string, address: string, code?: string | null, logo?: string | null }> | null };

export type GetClassSubjectsQueryVariables = Exact<{
  input: StudentSearchInput;
}>;


export type GetClassSubjectsQuery = { __typename?: 'Query', getClassSubjects?: Array<{ __typename?: 'Classes', id: string, name: string, level: string, section?: string | null, subjects?: Array<{ __typename?: 'Subject', id: string, name: string, code?: string | null } | null> | null } | null> | null };

export type ConfirmCompleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type ConfirmCompleteProfileMutation = { __typename?: 'Mutation', confirmCompleteProfile?: { __typename?: 'UserPayload', ok?: boolean | null, message?: string | null, user: { __typename?: 'User', id: string, email?: string | null, profileCompleted?: boolean | null, hasMembership?: boolean | null } } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email?: string | null, username?: string | null, phoneNumber?: string | null, hasMembership?: boolean | null, profileCompleted?: boolean | null, profile?: { __typename?: 'Profile', id: string, firstname: string, lastname: string, photo?: string | null, gender?: string | null } | null } | null };

export type VerifyInvitationCodeQueryVariables = Exact<{
  input: InvitationCodeInput;
}>;


export type VerifyInvitationCodeQuery = { __typename?: 'Query', verifyInvitationCode?: string | null };



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
    email
    username
    phoneNumber
    hasMembership
    profileCompleted
    profile {
      id
      firstname
      lastname
      photo
      gender
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

export const VerifyInvitationCodeDocument = `
    query VerifyInvitationCode($input: InvitationCodeInput!) {
  verifyInvitationCode(code: $input)
}
    `;

export const useVerifyInvitationCodeQuery = <
      TData = VerifyInvitationCodeQuery,
      TError = unknown
    >(
      variables: VerifyInvitationCodeQueryVariables,
      options?: Omit<UseQueryOptions<VerifyInvitationCodeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<VerifyInvitationCodeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<VerifyInvitationCodeQuery, TError, TData>(
      {
    queryKey: ['VerifyInvitationCode', variables],
    queryFn: fetcher<VerifyInvitationCodeQuery, VerifyInvitationCodeQueryVariables>(VerifyInvitationCodeDocument, variables),
    ...options
  }
    )};

useVerifyInvitationCodeQuery.getKey = (variables: VerifyInvitationCodeQueryVariables) => ['VerifyInvitationCode', variables];

export const useInfiniteVerifyInvitationCodeQuery = <
      TData = InfiniteData<VerifyInvitationCodeQuery>,
      TError = unknown
    >(
      variables: VerifyInvitationCodeQueryVariables,
      options: Omit<UseInfiniteQueryOptions<VerifyInvitationCodeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<VerifyInvitationCodeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<VerifyInvitationCodeQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['VerifyInvitationCode.infinite', variables],
      queryFn: (metaData) => fetcher<VerifyInvitationCodeQuery, VerifyInvitationCodeQueryVariables>(VerifyInvitationCodeDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteVerifyInvitationCodeQuery.getKey = (variables: VerifyInvitationCodeQueryVariables) => ['VerifyInvitationCode.infinite', variables];


useVerifyInvitationCodeQuery.fetcher = (variables: VerifyInvitationCodeQueryVariables, options?: RequestInit['headers']) => fetcher<VerifyInvitationCodeQuery, VerifyInvitationCodeQueryVariables>(VerifyInvitationCodeDocument, variables, options);
