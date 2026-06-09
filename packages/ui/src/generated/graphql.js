"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetClassesOptionsQuery = exports.GetClassesOptionsDocument = exports.useCreateClassMutation = exports.CreateClassDocument = exports.useInfiniteGetTeachersTeamQuery = exports.useGetTeachersTeamQuery = exports.GetTeachersTeamDocument = exports.useInfiniteGetClassStudentsQuery = exports.useGetClassStudentsQuery = exports.GetClassStudentsDocument = exports.useInfiniteGetClassDetailsQuery = exports.useGetClassDetailsQuery = exports.GetClassDetailsDocument = exports.useInfiniteGetSchoolClassesQuery = exports.useGetSchoolClassesQuery = exports.GetSchoolClassesDocument = exports.useMarkStudentAttendanceMutation = exports.MarkStudentAttendanceDocument = exports.useInfiniteGetSchoolSettingsQuery = exports.useGetSchoolSettingsQuery = exports.GetSchoolSettingsDocument = exports.useInfiniteGetAdminDashboardStatsQuery = exports.useGetAdminDashboardStatsQuery = exports.GetAdminDashboardStatsDocument = exports.TeacherListDataFragmentDoc = exports.StudentDetailsFragmentDoc = exports.RoomFragmentFragmentDoc = exports.ParentListFragmentDoc = exports.SubjectWithTeacherFragmentDoc = exports.UserProfileFragmentDoc = exports.ClassListFragmentFragmentDoc = exports.UpdateMode = exports.TransportMode = exports.SubjectSortField = exports.SubjectCategory = exports.StudentStatus = exports.StudentSortField = exports.SortOrder = exports.SchoolRole = exports.ResourceMode = exports.RelationType = exports.LessonStatus = exports.GroupType = exports.Gender = exports.DisciplinaryType = exports.Day = exports.ContactPreference = exports.AttendanceStatus = exports.AssessmentType = exports.AssessmentStatus = void 0;
exports.useGetSchoolParentsQuery = exports.GetSchoolParentsDocument = exports.useDeleteLessonMutation = exports.DeleteLessonDocument = exports.useUpdateLessonMutation = exports.UpdateLessonDocument = exports.useUpdateLessonStatusMutation = exports.UpdateLessonStatusDocument = exports.useCreateLessonMutation = exports.CreateLessonDocument = exports.useInfiniteGetSchoolLessonsQuery = exports.useGetSchoolLessonsQuery = exports.GetSchoolLessonsDocument = exports.useInfiniteGetAssignmentsQuery = exports.useGetAssignmentsQuery = exports.GetAssignmentsDocument = exports.useInfiniteGetClassesAndTeachersQuery = exports.useGetClassesAndTeachersQuery = exports.GetClassesAndTeachersDocument = exports.useInfiniteGetDashboardContextQuery = exports.useGetDashboardContextQuery = exports.GetDashboardContextDocument = exports.useInfiniteGetMeQuery = exports.useGetMeQuery = exports.GetMeDocument = exports.useConfirmCompleteProfileMutation = exports.ConfirmCompleteProfileDocument = exports.useInfiniteSearchSchoolQuery = exports.useSearchSchoolQuery = exports.SearchSchoolDocument = exports.useInfiniteSearchStudentQuery = exports.useSearchStudentQuery = exports.SearchStudentDocument = exports.useUpdateClassSubjectMutation = exports.UpdateClassSubjectDocument = exports.useCreateClassSubjectMutation = exports.CreateClassSubjectDocument = exports.useInfiniteGetClassSubjectsOptionQuery = exports.useGetClassSubjectsOptionQuery = exports.GetClassSubjectsOptionDocument = exports.useInfiniteGetClassSubjectTableQuery = exports.useGetClassSubjectTableQuery = exports.GetClassSubjectTableDocument = exports.useDeleteClassSubjectsMutation = exports.DeleteClassSubjectsDocument = exports.useDeleteClassesMutation = exports.DeleteClassesDocument = exports.useUpdateClassMutation = exports.UpdateClassDocument = exports.useInfiniteGetClassesOptionsQuery = void 0;
exports.useInfiniteTeacherForAttendancesQuery = exports.useTeacherForAttendancesQuery = exports.TeacherForAttendancesDocument = exports.useInfiniteGetTeacherForAttendanceQuery = exports.useGetTeacherForAttendanceQuery = exports.GetTeacherForAttendanceDocument = exports.useInfiniteGetTeacherOptionsQuery = exports.useGetTeacherOptionsQuery = exports.GetTeacherOptionsDocument = exports.useInfiniteGetSchoolTeachersQuery = exports.useGetSchoolTeachersQuery = exports.GetSchoolTeachersDocument = exports.useDeleteSubjectsMutation = exports.DeleteSubjectsDocument = exports.useCreateSubjectMutation = exports.CreateSubjectDocument = exports.useInfiniteGetClassSubjectOptionsQuery = exports.useGetClassSubjectOptionsQuery = exports.GetClassSubjectOptionsDocument = exports.useInfiniteGetSubjectsOptionsQuery = exports.useGetSubjectsOptionsQuery = exports.GetSubjectsOptionsDocument = exports.useInfiniteGetSchoolSubjectsQuery = exports.useGetSchoolSubjectsQuery = exports.GetSchoolSubjectsDocument = exports.useDeleteStudentsMutation = exports.DeleteStudentsDocument = exports.useCreateListStudentMutation = exports.CreateListStudentDocument = exports.useUpdateStudentMutation = exports.UpdateStudentDocument = exports.useInfiniteGetStudentForAttendanceQuery = exports.useGetStudentForAttendanceQuery = exports.GetStudentForAttendanceDocument = exports.useInfiniteGetStudentDetailsQuery = exports.useGetStudentDetailsQuery = exports.GetStudentDetailsDocument = exports.useInfiniteGetSchoolStudentsQuery = exports.useGetSchoolStudentsQuery = exports.GetSchoolStudentsDocument = exports.useUpdateRoomMutation = exports.UpdateRoomDocument = exports.useCreateRoomMutation = exports.CreateRoomDocument = exports.useInfiniteGetSchoolRoomQuery = exports.useGetSchoolRoomQuery = exports.GetSchoolRoomDocument = exports.useCreateParentMutation = exports.CreateParentDocument = exports.useInfiniteGetSchoolParentsQuery = void 0;
exports.useUpdateTeacherMutation = exports.UpdateTeacherDocument = exports.useSyncTeacherAssignmentMutation = exports.SyncTeacherAssignmentDocument = exports.useCreateTeacherAssignmentMutation = exports.CreateTeacherAssignmentDocument = exports.useCreateTeacherMutation = exports.CreateTeacherDocument = exports.useDeleteTeachersMutation = exports.DeleteTeachersDocument = exports.useInfiniteGetTeacherDetailsQuery = exports.useGetTeacherDetailsQuery = exports.GetTeacherDetailsDocument = exports.useInfiniteGetTeacherScheduleQuery = exports.useGetTeacherScheduleQuery = exports.GetTeacherScheduleDocument = void 0;
const react_query_1 = require("@tanstack/react-query");
const graphql_fetcher_1 = require("../lib/graphql-fetcher");
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["Closed"] = "CLOSED";
    AssessmentStatus["Draft"] = "DRAFT";
    AssessmentStatus["Published"] = "PUBLISHED";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["Assignment"] = "ASSIGNMENT";
    AssessmentType["Exam"] = "EXAM";
    AssessmentType["Oral"] = "ORAL";
    AssessmentType["Practical"] = "PRACTICAL";
    AssessmentType["Quiz"] = "QUIZ";
    AssessmentType["Test"] = "TEST";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["Absent"] = "ABSENT";
    AttendanceStatus["Excused"] = "EXCUSED";
    AttendanceStatus["Late"] = "LATE";
    AttendanceStatus["Present"] = "PRESENT";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var ContactPreference;
(function (ContactPreference) {
    ContactPreference["Email"] = "EMAIL";
    ContactPreference["Phone"] = "PHONE";
    ContactPreference["Whatsapp"] = "WHATSAPP";
})(ContactPreference || (exports.ContactPreference = ContactPreference = {}));
var Day;
(function (Day) {
    Day["Friday"] = "FRIDAY";
    Day["Monday"] = "MONDAY";
    Day["Saturday"] = "SATURDAY";
    Day["Sunday"] = "SUNDAY";
    Day["Thursday"] = "THURSDAY";
    Day["Tuesday"] = "TUESDAY";
    Day["Wednesday"] = "WEDNESDAY";
})(Day || (exports.Day = Day = {}));
var DisciplinaryType;
(function (DisciplinaryType) {
    DisciplinaryType["Expulsion"] = "EXPULSION";
    DisciplinaryType["Suspension"] = "SUSPENSION";
    DisciplinaryType["Warning"] = "WARNING";
})(DisciplinaryType || (exports.DisciplinaryType = DisciplinaryType = {}));
var Gender;
(function (Gender) {
    Gender["Female"] = "FEMALE";
    Gender["Male"] = "MALE";
})(Gender || (exports.Gender = Gender = {}));
var GroupType;
(function (GroupType) {
    GroupType["Multiple"] = "MULTIPLE";
    GroupType["Solo"] = "SOLO";
})(GroupType || (exports.GroupType = GroupType = {}));
var LessonStatus;
(function (LessonStatus) {
    LessonStatus["Cancelled"] = "CANCELLED";
    LessonStatus["Completed"] = "COMPLETED";
    LessonStatus["Ongoing"] = "ONGOING";
    LessonStatus["Planned"] = "PLANNED";
    LessonStatus["Postponed"] = "POSTPONED";
})(LessonStatus || (exports.LessonStatus = LessonStatus = {}));
var RelationType;
(function (RelationType) {
    RelationType["Aunt"] = "AUNT";
    RelationType["Father"] = "FATHER";
    RelationType["GrandFather"] = "GRAND_FATHER";
    RelationType["GrandMother"] = "GRAND_MOTHER";
    RelationType["Guardian"] = "GUARDIAN";
    RelationType["Mother"] = "MOTHER";
    RelationType["Other"] = "OTHER";
    RelationType["Uncle"] = "UNCLE";
})(RelationType || (exports.RelationType = RelationType = {}));
var ResourceMode;
(function (ResourceMode) {
    ResourceMode["Class"] = "CLASS";
    ResourceMode["Teacher"] = "TEACHER";
})(ResourceMode || (exports.ResourceMode = ResourceMode = {}));
var SchoolRole;
(function (SchoolRole) {
    SchoolRole["Admin"] = "ADMIN";
    SchoolRole["Parent"] = "PARENT";
    SchoolRole["Staff"] = "STAFF";
    SchoolRole["Student"] = "STUDENT";
    SchoolRole["Teacher"] = "TEACHER";
})(SchoolRole || (exports.SchoolRole = SchoolRole = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["Asc"] = "ASC";
    SortOrder["Desc"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var StudentSortField;
(function (StudentSortField) {
    StudentSortField["EnrolementYear"] = "enrolementYear";
    StudentSortField["Firstname"] = "firstname";
    StudentSortField["Lastname"] = "lastname";
})(StudentSortField || (exports.StudentSortField = StudentSortField = {}));
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "ACTIVE";
    StudentStatus["Deceased"] = "DECEASED";
    StudentStatus["DroppedOut"] = "DROPPED_OUT";
    StudentStatus["Expelled"] = "EXPELLED";
    StudentStatus["Graduated"] = "GRADUATED";
    StudentStatus["Inactive"] = "INACTIVE";
    StudentStatus["Suspended"] = "SUSPENDED";
    StudentStatus["Transferred"] = "TRANSFERRED";
})(StudentStatus || (exports.StudentStatus = StudentStatus = {}));
var SubjectCategory;
(function (SubjectCategory) {
    SubjectCategory["General"] = "GENERAL";
    SubjectCategory["Literary"] = "LITERARY";
    SubjectCategory["Scientific"] = "SCIENTIFIC";
    SubjectCategory["Sport"] = "SPORT";
})(SubjectCategory || (exports.SubjectCategory = SubjectCategory = {}));
var SubjectSortField;
(function (SubjectSortField) {
    SubjectSortField["Coefficient"] = "coefficient";
    SubjectSortField["Name"] = "name";
    SubjectSortField["Ponderation"] = "ponderation";
})(SubjectSortField || (exports.SubjectSortField = SubjectSortField = {}));
var TransportMode;
(function (TransportMode) {
    TransportMode["Bus"] = "BUS";
    TransportMode["Car"] = "CAR";
    TransportMode["Moto"] = "MOTO";
    TransportMode["Other"] = "OTHER";
    TransportMode["Parent"] = "PARENT";
    TransportMode["Taxi"] = "TAXI";
    TransportMode["Walk"] = "WALK";
})(TransportMode || (exports.TransportMode = TransportMode = {}));
var UpdateMode;
(function (UpdateMode) {
    UpdateMode["Connect"] = "CONNECT";
    UpdateMode["Create"] = "CREATE";
})(UpdateMode || (exports.UpdateMode = UpdateMode = {}));
exports.ClassListFragmentFragmentDoc = `
    fragment ClassListFragment on Class {
  id
  name
  section
  level
  supervisor {
    id
    user {
      id
      profile {
        id
        lastname
        firstname
        photo
      }
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
          user {
            profile {
              lastname
              firstname
            }
          }
        }
      }
    }
  }
  _count {
    students {
      male
      female
    }
    teachers
    subjects
  }
}
    `;
exports.UserProfileFragmentDoc = `
    fragment UserProfile on User {
  id
  email
  profile {
    firstname
    lastname
    photo
  }
}
    `;
exports.SubjectWithTeacherFragmentDoc = `
    fragment SubjectWithTeacher on ClassSubject {
  id
  coefficient
  weeklyHours
  assignment {
    id
    teacher {
      id
      user {
        ...UserProfile
      }
    }
  }
  subject {
    id
    name
    code
  }
}
    ${exports.UserProfileFragmentDoc}`;
exports.ParentListFragmentDoc = `
    fragment ParentList on Parent {
  id
  profession
  user {
    id
    phoneNumber
    email
    isActive
    profile {
      id
      firstname
      lastname
      address
      photo
    }
  }
  parentStudent {
    student {
      id
      user {
        profile {
          firstname
          lastname
        }
      }
      schoolClass {
        id
        name
        level
      }
    }
  }
}
    `;
exports.RoomFragmentFragmentDoc = `
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
    `;
exports.StudentDetailsFragmentDoc = `
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
      user {
        phoneNumber
        isActive
        ...UserProfile
        profile {
          address
        }
      }
    }
  }
  schoolClass {
    id
    name
    section
    level
  }
  user {
    id
    phoneNumber
    email
    username
    isActive
    profile {
      id
      firstname
      lastname
      photo
      gender
      address
    }
  }
}
    ${exports.UserProfileFragmentDoc}`;
exports.TeacherListDataFragmentDoc = `
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
  user {
    email
    phoneNumber
    profile {
      firstname
      lastname
      photo
      gender
    }
  }
  assignments {
    classSubjects {
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
exports.GetAdminDashboardStatsDocument = `
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
const useGetAdminDashboardStatsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetAdminDashboardStats', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetAdminDashboardStatsDocument, variables),
        ...options
    });
};
exports.useGetAdminDashboardStatsQuery = useGetAdminDashboardStatsQuery;
exports.useGetAdminDashboardStatsQuery.getKey = (variables) => ['GetAdminDashboardStats', variables];
const useInfiniteGetAdminDashboardStatsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetAdminDashboardStats.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetAdminDashboardStatsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetAdminDashboardStatsQuery = useInfiniteGetAdminDashboardStatsQuery;
exports.useInfiniteGetAdminDashboardStatsQuery.getKey = (variables) => ['GetAdminDashboardStats.infinite', variables];
exports.useGetAdminDashboardStatsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetAdminDashboardStatsDocument, variables, options);
exports.GetSchoolSettingsDocument = `
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
    `;
const useGetSchoolSettingsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolSettings', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSettingsDocument, variables),
        ...options
    });
};
exports.useGetSchoolSettingsQuery = useGetSchoolSettingsQuery;
exports.useGetSchoolSettingsQuery.getKey = (variables) => ['GetSchoolSettings', variables];
const useInfiniteGetSchoolSettingsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolSettings.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSettingsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolSettingsQuery = useInfiniteGetSchoolSettingsQuery;
exports.useInfiniteGetSchoolSettingsQuery.getKey = (variables) => ['GetSchoolSettings.infinite', variables];
exports.useGetSchoolSettingsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSettingsDocument, variables, options);
exports.MarkStudentAttendanceDocument = `
    mutation MarkStudentAttendance($input: MarkStudentAttendanceInput!) {
  markStudentAttendance(input: $input) {
    id
    date
    checkInTime
    recordedBy {
      id
      profile {
        firstname
        lastname
      }
    }
    person {
      ... on Student {
        id
        schoolClass {
          name
        }
        profile {
          firstname
          lastname
        }
      }
    }
  }
}
    `;
const useMarkStudentAttendanceMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['MarkStudentAttendance'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.MarkStudentAttendanceDocument, variables)(),
        ...options
    });
};
exports.useMarkStudentAttendanceMutation = useMarkStudentAttendanceMutation;
exports.useMarkStudentAttendanceMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.MarkStudentAttendanceDocument, variables, options);
exports.GetSchoolClassesDocument = `
    query GetSchoolClasses($input: GetSchoolClassesInput!) {
  getSchoolClasses(input: $input) {
    meta {
      limit
      totalPages
      total
    }
    data {
      ...ClassListFragment
    }
  }
}
    ${exports.ClassListFragmentFragmentDoc}`;
const useGetSchoolClassesQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolClasses', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolClassesDocument, variables),
        ...options
    });
};
exports.useGetSchoolClassesQuery = useGetSchoolClassesQuery;
exports.useGetSchoolClassesQuery.getKey = (variables) => ['GetSchoolClasses', variables];
const useInfiniteGetSchoolClassesQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolClasses.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolClassesDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolClassesQuery = useInfiniteGetSchoolClassesQuery;
exports.useInfiniteGetSchoolClassesQuery.getKey = (variables) => ['GetSchoolClasses.infinite', variables];
exports.useGetSchoolClassesQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolClassesDocument, variables, options);
exports.GetClassDetailsDocument = `
    query GetClassDetails($id: ID!) {
  class(id: $id) {
    id
    name
    level
    section
    totalCoefficient
    totalWeeklyHours
    group {
      id
      type
    }
    supervisor {
      id
      user {
        email
        phoneNumber
        profile {
          firstname
          lastname
          photo
        }
      }
    }
    _count {
      students {
        male
        female
      }
      subjects
      teachers
    }
  }
}
    `;
const useGetClassDetailsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassDetails', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassDetailsDocument, variables),
        ...options
    });
};
exports.useGetClassDetailsQuery = useGetClassDetailsQuery;
exports.useGetClassDetailsQuery.getKey = (variables) => ['GetClassDetails', variables];
const useInfiniteGetClassDetailsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassDetails.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassDetailsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassDetailsQuery = useInfiniteGetClassDetailsQuery;
exports.useInfiniteGetClassDetailsQuery.getKey = (variables) => ['GetClassDetails.infinite', variables];
exports.useGetClassDetailsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassDetailsDocument, variables, options);
exports.GetClassStudentsDocument = `
    query GetClassStudents($input: GetSchoolStudentsInput!) {
  getSchoolStudents(input: $input) {
    meta {
      page
      totalPages
      total
      limit
    }
    data {
      id
      matricule
      status
      studentNumber
      user {
        profile {
          firstname
          lastname
          photo
          gender
        }
      }
    }
  }
}
    `;
const useGetClassStudentsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassStudents', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassStudentsDocument, variables),
        ...options
    });
};
exports.useGetClassStudentsQuery = useGetClassStudentsQuery;
exports.useGetClassStudentsQuery.getKey = (variables) => ['GetClassStudents', variables];
const useInfiniteGetClassStudentsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassStudents.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassStudentsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassStudentsQuery = useInfiniteGetClassStudentsQuery;
exports.useInfiniteGetClassStudentsQuery.getKey = (variables) => ['GetClassStudents.infinite', variables];
exports.useGetClassStudentsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassStudentsDocument, variables, options);
exports.GetTeachersTeamDocument = `
    query getTeachersTeam($classId: ID!) {
  class(id: $classId) {
    id
    teachingTeamMembers {
      teacher {
        id
        user {
          profile {
            firstname
            lastname
            photo
          }
        }
      }
      assignments {
        id
        subject {
          id
          name
          code
        }
      }
    }
  }
}
    `;
const useGetTeachersTeamQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['getTeachersTeam', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetTeachersTeamDocument, variables),
        ...options
    });
};
exports.useGetTeachersTeamQuery = useGetTeachersTeamQuery;
exports.useGetTeachersTeamQuery.getKey = (variables) => ['getTeachersTeam', variables];
const useInfiniteGetTeachersTeamQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['getTeachersTeam.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetTeachersTeamDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetTeachersTeamQuery = useInfiniteGetTeachersTeamQuery;
exports.useInfiniteGetTeachersTeamQuery.getKey = (variables) => ['getTeachersTeam.infinite', variables];
exports.useGetTeachersTeamQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetTeachersTeamDocument, variables, options);
exports.CreateClassDocument = `
    mutation CreateClass($data: CreateClassInput!) {
  createClass(data: $data) {
    ...ClassListFragment
  }
}
    ${exports.ClassListFragmentFragmentDoc}`;
const useCreateClassMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateClass'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateClassDocument, variables)(),
        ...options
    });
};
exports.useCreateClassMutation = useCreateClassMutation;
exports.useCreateClassMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateClassDocument, variables, options);
exports.GetClassesOptionsDocument = `
    query GetClassesOptions($input: GetSchoolClassesInput!) {
  getSchoolClasses(input: $input) {
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
const useGetClassesOptionsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassesOptions', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassesOptionsDocument, variables),
        ...options
    });
};
exports.useGetClassesOptionsQuery = useGetClassesOptionsQuery;
exports.useGetClassesOptionsQuery.getKey = (variables) => ['GetClassesOptions', variables];
const useInfiniteGetClassesOptionsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassesOptions.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassesOptionsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassesOptionsQuery = useInfiniteGetClassesOptionsQuery;
exports.useInfiniteGetClassesOptionsQuery.getKey = (variables) => ['GetClassesOptions.infinite', variables];
exports.useGetClassesOptionsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassesOptionsDocument, variables, options);
exports.UpdateClassDocument = `
    mutation UpdateClass($classId: ID!, $data: CreateClassInput!, $schoolId: ID!) {
  updateClass(classId: $classId, data: $data, schoolId: $schoolId) {
    ok
    message
  }
}
    `;
const useUpdateClassMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateClass'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateClassDocument, variables)(),
        ...options
    });
};
exports.useUpdateClassMutation = useUpdateClassMutation;
exports.useUpdateClassMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateClassDocument, variables, options);
exports.DeleteClassesDocument = `
    mutation DeleteClasses($classIds: [ID!]!, $schoolId: ID!) {
  deleteClasses(classIds: $classIds, schoolId: $schoolId) {
    ok
    message
  }
}
    `;
const useDeleteClassesMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteClasses'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteClassesDocument, variables)(),
        ...options
    });
};
exports.useDeleteClassesMutation = useDeleteClassesMutation;
exports.useDeleteClassesMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteClassesDocument, variables, options);
exports.DeleteClassSubjectsDocument = `
    mutation DeleteClassSubjects($ids: [ID!]!) {
  deleteClassSubjects(ids: $ids) {
    ok
    message
  }
}
    `;
const useDeleteClassSubjectsMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteClassSubjects'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteClassSubjectsDocument, variables)(),
        ...options
    });
};
exports.useDeleteClassSubjectsMutation = useDeleteClassSubjectsMutation;
exports.useDeleteClassSubjectsMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteClassSubjectsDocument, variables, options);
exports.GetClassSubjectTableDocument = `
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
            user {
              profile {
                firstname
                lastname
              }
            }
          }
        }
      }
    }
  }
}
    `;
const useGetClassSubjectTableQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassSubjectTable', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectTableDocument, variables),
        ...options
    });
};
exports.useGetClassSubjectTableQuery = useGetClassSubjectTableQuery;
exports.useGetClassSubjectTableQuery.getKey = (variables) => ['GetClassSubjectTable', variables];
const useInfiniteGetClassSubjectTableQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassSubjectTable.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectTableDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassSubjectTableQuery = useInfiniteGetClassSubjectTableQuery;
exports.useInfiniteGetClassSubjectTableQuery.getKey = (variables) => ['GetClassSubjectTable.infinite', variables];
exports.useGetClassSubjectTableQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectTableDocument, variables, options);
exports.GetClassSubjectsOptionDocument = `
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
  }
}
    `;
const useGetClassSubjectsOptionQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassSubjectsOption', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectsOptionDocument, variables),
        ...options
    });
};
exports.useGetClassSubjectsOptionQuery = useGetClassSubjectsOptionQuery;
exports.useGetClassSubjectsOptionQuery.getKey = (variables) => ['GetClassSubjectsOption', variables];
const useInfiniteGetClassSubjectsOptionQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassSubjectsOption.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectsOptionDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassSubjectsOptionQuery = useInfiniteGetClassSubjectsOptionQuery;
exports.useInfiniteGetClassSubjectsOptionQuery.getKey = (variables) => ['GetClassSubjectsOption.infinite', variables];
exports.useGetClassSubjectsOptionQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectsOptionDocument, variables, options);
exports.CreateClassSubjectDocument = `
    mutation CreateClassSubject($input: ClassSubjectInput!) {
  createClassSubject(input: $input) {
    ...SubjectWithTeacher
  }
}
    ${exports.SubjectWithTeacherFragmentDoc}`;
const useCreateClassSubjectMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateClassSubject'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateClassSubjectDocument, variables)(),
        ...options
    });
};
exports.useCreateClassSubjectMutation = useCreateClassSubjectMutation;
exports.useCreateClassSubjectMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateClassSubjectDocument, variables, options);
exports.UpdateClassSubjectDocument = `
    mutation UpdateClassSubject($input: ClassSubjectInput!) {
  updateClassSubject(input: $input) {
    ...SubjectWithTeacher
  }
}
    ${exports.SubjectWithTeacherFragmentDoc}`;
const useUpdateClassSubjectMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateClassSubject'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateClassSubjectDocument, variables)(),
        ...options
    });
};
exports.useUpdateClassSubjectMutation = useUpdateClassSubjectMutation;
exports.useUpdateClassSubjectMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateClassSubjectDocument, variables, options);
exports.SearchStudentDocument = `
    query SearchStudent($input: StudentSearchInput!) {
  searchStudent(filter: $input) {
    id
    user {
      profile {
        firstname
        lastname
        photo
      }
    }
    schoolClass {
      name
    }
    matricule
  }
}
    `;
const useSearchStudentQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['SearchStudent', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.SearchStudentDocument, variables),
        ...options
    });
};
exports.useSearchStudentQuery = useSearchStudentQuery;
exports.useSearchStudentQuery.getKey = (variables) => ['SearchStudent', variables];
const useInfiniteSearchStudentQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['SearchStudent.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.SearchStudentDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteSearchStudentQuery = useInfiniteSearchStudentQuery;
exports.useInfiniteSearchStudentQuery.getKey = (variables) => ['SearchStudent.infinite', variables];
exports.useSearchStudentQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.SearchStudentDocument, variables, options);
exports.SearchSchoolDocument = `
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
const useSearchSchoolQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['SearchSchool', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.SearchSchoolDocument, variables),
        ...options
    });
};
exports.useSearchSchoolQuery = useSearchSchoolQuery;
exports.useSearchSchoolQuery.getKey = (variables) => ['SearchSchool', variables];
const useInfiniteSearchSchoolQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['SearchSchool.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.SearchSchoolDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteSearchSchoolQuery = useInfiniteSearchSchoolQuery;
exports.useInfiniteSearchSchoolQuery.getKey = (variables) => ['SearchSchool.infinite', variables];
exports.useSearchSchoolQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.SearchSchoolDocument, variables, options);
exports.ConfirmCompleteProfileDocument = `
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
const useConfirmCompleteProfileMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['ConfirmCompleteProfile'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.ConfirmCompleteProfileDocument, variables)(),
        ...options
    });
};
exports.useConfirmCompleteProfileMutation = useConfirmCompleteProfileMutation;
exports.useConfirmCompleteProfileMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.ConfirmCompleteProfileDocument, variables, options);
exports.GetMeDocument = `
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
const useGetMeQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetMeDocument, variables),
        ...options
    });
};
exports.useGetMeQuery = useGetMeQuery;
exports.useGetMeQuery.getKey = (variables) => variables === undefined ? ['GetMe'] : ['GetMe', variables];
const useInfiniteGetMeQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? variables === undefined ? ['GetMe.infinite'] : ['GetMe.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetMeDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetMeQuery = useInfiniteGetMeQuery;
exports.useInfiniteGetMeQuery.getKey = (variables) => variables === undefined ? ['GetMe.infinite'] : ['GetMe.infinite', variables];
exports.useGetMeQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetMeDocument, variables, options);
exports.GetDashboardContextDocument = `
    query GetDashboardContext($input: SchoolId!) {
  me {
    schoolContext(schoolId: $input) {
      id
      role
      teacher {
        id
        department
        specialization
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
        parentStudent {
          student {
            id
            user {
              id
              profile {
                lastname
                firstname
                photo
              }
            }
            matricule
          }
        }
      }
      student {
        id
        user {
          id
          profile {
            id
            firstname
            lastname
            photo
          }
        }
        matricule
      }
    }
  }
}
    `;
const useGetDashboardContextQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetDashboardContext', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetDashboardContextDocument, variables),
        ...options
    });
};
exports.useGetDashboardContextQuery = useGetDashboardContextQuery;
exports.useGetDashboardContextQuery.getKey = (variables) => ['GetDashboardContext', variables];
const useInfiniteGetDashboardContextQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetDashboardContext.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetDashboardContextDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetDashboardContextQuery = useInfiniteGetDashboardContextQuery;
exports.useInfiniteGetDashboardContextQuery.getKey = (variables) => ['GetDashboardContext.infinite', variables];
exports.useGetDashboardContextQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetDashboardContextDocument, variables, options);
exports.GetClassesAndTeachersDocument = `
    query GetClassesAndTeachers($limit: Int!) {
  getSchoolTeachers(input: {limit: $limit}) {
    data {
      id
      user {
        ...UserProfile
      }
    }
  }
  getSchoolClasses(input: {limit: $limit}) {
    data {
      id
      name
      level
    }
  }
}
    ${exports.UserProfileFragmentDoc}`;
const useGetClassesAndTeachersQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetClassesAndTeachers', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassesAndTeachersDocument, variables),
        ...options
    });
};
exports.useGetClassesAndTeachersQuery = useGetClassesAndTeachersQuery;
exports.useGetClassesAndTeachersQuery.getKey = (variables) => ['GetClassesAndTeachers', variables];
const useInfiniteGetClassesAndTeachersQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetClassesAndTeachers.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassesAndTeachersDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassesAndTeachersQuery = useInfiniteGetClassesAndTeachersQuery;
exports.useInfiniteGetClassesAndTeachersQuery.getKey = (variables) => ['GetClassesAndTeachers.infinite', variables];
exports.useGetClassesAndTeachersQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassesAndTeachersDocument, variables, options);
exports.GetAssignmentsDocument = `
    query GetAssignments($filter: GetAssignmentInput!) {
  getAssignments(filter: $filter) {
    id
    teacher {
      id
      department
      user {
        ...UserProfile
      }
    }
    classSubjects {
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
    ${exports.UserProfileFragmentDoc}`;
const useGetAssignmentsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetAssignments', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetAssignmentsDocument, variables),
        ...options
    });
};
exports.useGetAssignmentsQuery = useGetAssignmentsQuery;
exports.useGetAssignmentsQuery.getKey = (variables) => ['GetAssignments', variables];
const useInfiniteGetAssignmentsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetAssignments.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetAssignmentsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetAssignmentsQuery = useInfiniteGetAssignmentsQuery;
exports.useInfiniteGetAssignmentsQuery.getKey = (variables) => ['GetAssignments.infinite', variables];
exports.useGetAssignmentsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetAssignmentsDocument, variables, options);
exports.GetSchoolLessonsDocument = `
    query GetSchoolLessons($filter: GetLessonsInput!) {
  getLessons(filter: $filter) {
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
          firstname
          lastname
          weeklyHours
        }
      }
    }
  }
}
    `;
const useGetSchoolLessonsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolLessons', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolLessonsDocument, variables),
        ...options
    });
};
exports.useGetSchoolLessonsQuery = useGetSchoolLessonsQuery;
exports.useGetSchoolLessonsQuery.getKey = (variables) => ['GetSchoolLessons', variables];
const useInfiniteGetSchoolLessonsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolLessons.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolLessonsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolLessonsQuery = useInfiniteGetSchoolLessonsQuery;
exports.useInfiniteGetSchoolLessonsQuery.getKey = (variables) => ['GetSchoolLessons.infinite', variables];
exports.useGetSchoolLessonsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolLessonsDocument, variables, options);
exports.CreateLessonDocument = `
    mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    id
    status
    startTime
    endTime
    day
    teacherAssignment {
      classSubjects {
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
            user {
              profile {
                firstname
                lastname
              }
            }
          }
        }
      }
    }
  }
}
    `;
const useCreateLessonMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateLesson'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateLessonDocument, variables)(),
        ...options
    });
};
exports.useCreateLessonMutation = useCreateLessonMutation;
exports.useCreateLessonMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateLessonDocument, variables, options);
exports.UpdateLessonStatusDocument = `
    mutation UpdateLessonStatus($status: LessonStatus!, $id: ID!) {
  updateLessonStatus(status: $status, id: $id) {
    id
    status
  }
}
    `;
const useUpdateLessonStatusMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateLessonStatus'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateLessonStatusDocument, variables)(),
        ...options
    });
};
exports.useUpdateLessonStatusMutation = useUpdateLessonStatusMutation;
exports.useUpdateLessonStatusMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateLessonStatusDocument, variables, options);
exports.UpdateLessonDocument = `
    mutation UpdateLesson($input: UpdateLessonInput!) {
  updateLesson(input: $input) {
    id
    status
    startTime
    endTime
    day
  }
}
    `;
const useUpdateLessonMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateLesson'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateLessonDocument, variables)(),
        ...options
    });
};
exports.useUpdateLessonMutation = useUpdateLessonMutation;
exports.useUpdateLessonMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateLessonDocument, variables, options);
exports.DeleteLessonDocument = `
    mutation DeleteLesson($id: ID!) {
  deleteLesson(id: $id) {
    ok
    message
    details
  }
}
    `;
const useDeleteLessonMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteLesson'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteLessonDocument, variables)(),
        ...options
    });
};
exports.useDeleteLessonMutation = useDeleteLessonMutation;
exports.useDeleteLessonMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteLessonDocument, variables, options);
exports.GetSchoolParentsDocument = `
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
    ${exports.ParentListFragmentDoc}`;
const useGetSchoolParentsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolParents', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolParentsDocument, variables),
        ...options
    });
};
exports.useGetSchoolParentsQuery = useGetSchoolParentsQuery;
exports.useGetSchoolParentsQuery.getKey = (variables) => ['GetSchoolParents', variables];
const useInfiniteGetSchoolParentsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolParents.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolParentsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolParentsQuery = useInfiniteGetSchoolParentsQuery;
exports.useInfiniteGetSchoolParentsQuery.getKey = (variables) => ['GetSchoolParents.infinite', variables];
exports.useGetSchoolParentsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolParentsDocument, variables, options);
exports.CreateParentDocument = `
    mutation CreateParent($input: CreateParentInput!) {
  createParent(input: $input) {
    ...ParentList
  }
}
    ${exports.ParentListFragmentDoc}`;
const useCreateParentMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateParent'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateParentDocument, variables)(),
        ...options
    });
};
exports.useCreateParentMutation = useCreateParentMutation;
exports.useCreateParentMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateParentDocument, variables, options);
exports.GetSchoolRoomDocument = `
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
    ${exports.RoomFragmentFragmentDoc}`;
const useGetSchoolRoomQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolRoom', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolRoomDocument, variables),
        ...options
    });
};
exports.useGetSchoolRoomQuery = useGetSchoolRoomQuery;
exports.useGetSchoolRoomQuery.getKey = (variables) => ['GetSchoolRoom', variables];
const useInfiniteGetSchoolRoomQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolRoom.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolRoomDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolRoomQuery = useInfiniteGetSchoolRoomQuery;
exports.useInfiniteGetSchoolRoomQuery.getKey = (variables) => ['GetSchoolRoom.infinite', variables];
exports.useGetSchoolRoomQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolRoomDocument, variables, options);
exports.CreateRoomDocument = `
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    ...RoomFragment
  }
}
    ${exports.RoomFragmentFragmentDoc}`;
const useCreateRoomMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateRoom'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateRoomDocument, variables)(),
        ...options
    });
};
exports.useCreateRoomMutation = useCreateRoomMutation;
exports.useCreateRoomMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateRoomDocument, variables, options);
exports.UpdateRoomDocument = `
    mutation UpdateRoom($input: CreateRoomInput!) {
  updateRoom(input: $input) {
    ...RoomFragment
  }
}
    ${exports.RoomFragmentFragmentDoc}`;
const useUpdateRoomMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateRoom'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateRoomDocument, variables)(),
        ...options
    });
};
exports.useUpdateRoomMutation = useUpdateRoomMutation;
exports.useUpdateRoomMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateRoomDocument, variables, options);
exports.GetSchoolStudentsDocument = `
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
      user {
        id
        email
        phoneNumber
        profile {
          id
          photo
          firstname
          lastname
          address
        }
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
    `;
const useGetSchoolStudentsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolStudents', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolStudentsDocument, variables),
        ...options
    });
};
exports.useGetSchoolStudentsQuery = useGetSchoolStudentsQuery;
exports.useGetSchoolStudentsQuery.getKey = (variables) => ['GetSchoolStudents', variables];
const useInfiniteGetSchoolStudentsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolStudents.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolStudentsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolStudentsQuery = useInfiniteGetSchoolStudentsQuery;
exports.useInfiniteGetSchoolStudentsQuery.getKey = (variables) => ['GetSchoolStudents.infinite', variables];
exports.useGetSchoolStudentsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolStudentsDocument, variables, options);
exports.GetStudentDetailsDocument = `
    query GetStudentDetails($id: ID!) {
  student(id: $id) {
    ...StudentDetails
  }
}
    ${exports.StudentDetailsFragmentDoc}`;
const useGetStudentDetailsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetStudentDetails', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetStudentDetailsDocument, variables),
        ...options
    });
};
exports.useGetStudentDetailsQuery = useGetStudentDetailsQuery;
exports.useGetStudentDetailsQuery.getKey = (variables) => ['GetStudentDetails', variables];
const useInfiniteGetStudentDetailsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetStudentDetails.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetStudentDetailsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetStudentDetailsQuery = useInfiniteGetStudentDetailsQuery;
exports.useInfiniteGetStudentDetailsQuery.getKey = (variables) => ['GetStudentDetails.infinite', variables];
exports.useGetStudentDetailsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetStudentDetailsDocument, variables, options);
exports.GetStudentForAttendanceDocument = `
    query GetStudentForAttendance($input: GetSchoolStudentsInput!, $date: Date) {
  getSchoolStudents(input: $input) {
    data {
      id
      user {
        email
        profile {
          firstname
          lastname
          photo
        }
      }
      schoolClass {
        id
        name
      }
      attendances(date: $date) {
        status
      }
    }
  }
}
    `;
const useGetStudentForAttendanceQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetStudentForAttendance', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetStudentForAttendanceDocument, variables),
        ...options
    });
};
exports.useGetStudentForAttendanceQuery = useGetStudentForAttendanceQuery;
exports.useGetStudentForAttendanceQuery.getKey = (variables) => ['GetStudentForAttendance', variables];
const useInfiniteGetStudentForAttendanceQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetStudentForAttendance.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetStudentForAttendanceDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetStudentForAttendanceQuery = useInfiniteGetStudentForAttendanceQuery;
exports.useInfiniteGetStudentForAttendanceQuery.getKey = (variables) => ['GetStudentForAttendance.infinite', variables];
exports.useGetStudentForAttendanceQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetStudentForAttendanceDocument, variables, options);
exports.UpdateStudentDocument = `
    mutation UpdateStudent($studentId: ID!, $data: CreateStudentInput!, $schoolId: ID!) {
  updateStudent(studentId: $studentId, data: $data, schoolId: $schoolId) {
    ...StudentDetails
  }
}
    ${exports.StudentDetailsFragmentDoc}`;
const useUpdateStudentMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateStudent'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateStudentDocument, variables)(),
        ...options
    });
};
exports.useUpdateStudentMutation = useUpdateStudentMutation;
exports.useUpdateStudentMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateStudentDocument, variables, options);
exports.CreateListStudentDocument = `
    mutation CreateListStudent($schoolId: ID!, $data: CreateStudentInput!) {
  createListStudent(schoolId: $schoolId, data: $data) {
    ok
    message
  }
}
    `;
const useCreateListStudentMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateListStudent'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateListStudentDocument, variables)(),
        ...options
    });
};
exports.useCreateListStudentMutation = useCreateListStudentMutation;
exports.useCreateListStudentMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateListStudentDocument, variables, options);
exports.DeleteStudentsDocument = `
    mutation DeleteStudents($schoolId: ID!, $studentIds: [ID!]!, $soft: Boolean) {
  deleteStudents(schoolId: $schoolId, studentIds: $studentIds, soft: $soft) {
    ok
    message
  }
}
    `;
const useDeleteStudentsMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteStudents'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteStudentsDocument, variables)(),
        ...options
    });
};
exports.useDeleteStudentsMutation = useDeleteStudentsMutation;
exports.useDeleteStudentsMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteStudentsDocument, variables, options);
exports.GetSchoolSubjectsDocument = `
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
        user {
          ...UserProfile
        }
      }
      classSubject {
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
    ${exports.UserProfileFragmentDoc}`;
const useGetSchoolSubjectsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolSubjects', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSubjectsDocument, variables),
        ...options
    });
};
exports.useGetSchoolSubjectsQuery = useGetSchoolSubjectsQuery;
exports.useGetSchoolSubjectsQuery.getKey = (variables) => ['GetSchoolSubjects', variables];
const useInfiniteGetSchoolSubjectsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolSubjects.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSubjectsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolSubjectsQuery = useInfiniteGetSchoolSubjectsQuery;
exports.useInfiniteGetSchoolSubjectsQuery.getKey = (variables) => ['GetSchoolSubjects.infinite', variables];
exports.useGetSchoolSubjectsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolSubjectsDocument, variables, options);
exports.GetSubjectsOptionsDocument = `
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
const useGetSubjectsOptionsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSubjectsOptions', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSubjectsOptionsDocument, variables),
        ...options
    });
};
exports.useGetSubjectsOptionsQuery = useGetSubjectsOptionsQuery;
exports.useGetSubjectsOptionsQuery.getKey = (variables) => ['GetSubjectsOptions', variables];
const useInfiniteGetSubjectsOptionsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSubjectsOptions.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSubjectsOptionsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSubjectsOptionsQuery = useInfiniteGetSubjectsOptionsQuery;
exports.useInfiniteGetSubjectsOptionsQuery.getKey = (variables) => ['GetSubjectsOptions.infinite', variables];
exports.useGetSubjectsOptionsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSubjectsOptionsDocument, variables, options);
exports.GetClassSubjectOptionsDocument = `
    query GetClassSubjectOptions($classId: ID, $teacherId: ID, $groupId: ID) {
  getClassSubjects(classId: $classId, teacherId: $teacherId, groupId: $groupId) {
    id
    assignment {
      id
      teacher {
        id
        user {
          profile {
            firstname
            lastname
          }
        }
      }
    }
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
  }
}
    `;
const useGetClassSubjectOptionsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: variables === undefined ? ['GetClassSubjectOptions'] : ['GetClassSubjectOptions', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectOptionsDocument, variables),
        ...options
    });
};
exports.useGetClassSubjectOptionsQuery = useGetClassSubjectOptionsQuery;
exports.useGetClassSubjectOptionsQuery.getKey = (variables) => variables === undefined ? ['GetClassSubjectOptions'] : ['GetClassSubjectOptions', variables];
const useInfiniteGetClassSubjectOptionsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? variables === undefined ? ['GetClassSubjectOptions.infinite'] : ['GetClassSubjectOptions.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectOptionsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetClassSubjectOptionsQuery = useInfiniteGetClassSubjectOptionsQuery;
exports.useInfiniteGetClassSubjectOptionsQuery.getKey = (variables) => variables === undefined ? ['GetClassSubjectOptions.infinite'] : ['GetClassSubjectOptions.infinite', variables];
exports.useGetClassSubjectOptionsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetClassSubjectOptionsDocument, variables, options);
exports.CreateSubjectDocument = `
    mutation CreateSubject($input: CreateSubjectInput!) {
  createSubject(input: $input) {
    id
    name
    code
    totalWeeklyHours
    mainTeacher {
      id
      user {
        ...UserProfile
      }
    }
    classSubject {
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
          user {
            ...UserProfile
          }
        }
      }
    }
  }
}
    ${exports.UserProfileFragmentDoc}`;
const useCreateSubjectMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateSubject'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateSubjectDocument, variables)(),
        ...options
    });
};
exports.useCreateSubjectMutation = useCreateSubjectMutation;
exports.useCreateSubjectMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateSubjectDocument, variables, options);
exports.DeleteSubjectsDocument = `
    mutation DeleteSubjects($subjectIds: [ID!]!) {
  deleteSubjects(subjectIds: $subjectIds) {
    ok
    message
  }
}
    `;
const useDeleteSubjectsMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteSubjects'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteSubjectsDocument, variables)(),
        ...options
    });
};
exports.useDeleteSubjectsMutation = useDeleteSubjectsMutation;
exports.useDeleteSubjectsMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteSubjectsDocument, variables, options);
exports.GetSchoolTeachersDocument = `
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
    ${exports.TeacherListDataFragmentDoc}`;
const useGetSchoolTeachersQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetSchoolTeachers', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetSchoolTeachersDocument, variables),
        ...options
    });
};
exports.useGetSchoolTeachersQuery = useGetSchoolTeachersQuery;
exports.useGetSchoolTeachersQuery.getKey = (variables) => ['GetSchoolTeachers', variables];
const useInfiniteGetSchoolTeachersQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetSchoolTeachers.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolTeachersDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetSchoolTeachersQuery = useInfiniteGetSchoolTeachersQuery;
exports.useInfiniteGetSchoolTeachersQuery.getKey = (variables) => ['GetSchoolTeachers.infinite', variables];
exports.useGetSchoolTeachersQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetSchoolTeachersDocument, variables, options);
exports.GetTeacherOptionsDocument = `
    query GetTeacherOptions($input: GetSchoolTeachersInput!) {
  getSchoolTeachers(input: $input) {
    data {
      id
      user {
        profile {
          firstname
          lastname
        }
      }
    }
  }
}
    `;
const useGetTeacherOptionsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetTeacherOptions', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetTeacherOptionsDocument, variables),
        ...options
    });
};
exports.useGetTeacherOptionsQuery = useGetTeacherOptionsQuery;
exports.useGetTeacherOptionsQuery.getKey = (variables) => ['GetTeacherOptions', variables];
const useInfiniteGetTeacherOptionsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetTeacherOptions.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherOptionsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetTeacherOptionsQuery = useInfiniteGetTeacherOptionsQuery;
exports.useInfiniteGetTeacherOptionsQuery.getKey = (variables) => ['GetTeacherOptions.infinite', variables];
exports.useGetTeacherOptionsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherOptionsDocument, variables, options);
exports.GetTeacherForAttendanceDocument = `
    query GetTeacherForAttendance($input: GetSchoolTeachersInput!, $date: Date) {
  getSchoolTeachers(input: $input) {
    data {
      id
      user {
        profile {
          firstname
          lastname
        }
      }
      attendances(date: $date) {
        status
      }
      assignments {
        classSubjects {
          subject {
            id
            name
          }
          group {
            classes {
              id
              name
            }
          }
        }
      }
    }
  }
}
    `;
const useGetTeacherForAttendanceQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetTeacherForAttendance', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetTeacherForAttendanceDocument, variables),
        ...options
    });
};
exports.useGetTeacherForAttendanceQuery = useGetTeacherForAttendanceQuery;
exports.useGetTeacherForAttendanceQuery.getKey = (variables) => ['GetTeacherForAttendance', variables];
const useInfiniteGetTeacherForAttendanceQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetTeacherForAttendance.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherForAttendanceDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetTeacherForAttendanceQuery = useInfiniteGetTeacherForAttendanceQuery;
exports.useInfiniteGetTeacherForAttendanceQuery.getKey = (variables) => ['GetTeacherForAttendance.infinite', variables];
exports.useGetTeacherForAttendanceQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherForAttendanceDocument, variables, options);
exports.TeacherForAttendancesDocument = `
    query TeacherForAttendances($filter: GetTeacherForAttendanceInput!) {
  getTeachersForAttendance(filter: $filter) {
    data {
      id
      user {
        profile {
          lastname
          firstname
        }
      }
      assignments {
        classSubjects {
          subject {
            id
            name
          }
          group {
            classes {
              id
              name
            }
          }
        }
      }
    }
  }
}
    `;
const useTeacherForAttendancesQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['TeacherForAttendances', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.TeacherForAttendancesDocument, variables),
        ...options
    });
};
exports.useTeacherForAttendancesQuery = useTeacherForAttendancesQuery;
exports.useTeacherForAttendancesQuery.getKey = (variables) => ['TeacherForAttendances', variables];
const useInfiniteTeacherForAttendancesQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['TeacherForAttendances.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.TeacherForAttendancesDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteTeacherForAttendancesQuery = useInfiniteTeacherForAttendancesQuery;
exports.useInfiniteTeacherForAttendancesQuery.getKey = (variables) => ['TeacherForAttendances.infinite', variables];
exports.useTeacherForAttendancesQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.TeacherForAttendancesDocument, variables, options);
exports.GetTeacherScheduleDocument = `
    query GetTeacherSchedule($id: ID!) {
  teacher(id: $id) {
    assignments {
      classSubjects {
        group {
          id
          type
          name
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
      lessons {
        id
        endTime
        startTime
        status
        day
      }
    }
  }
}
    `;
const useGetTeacherScheduleQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetTeacherSchedule', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetTeacherScheduleDocument, variables),
        ...options
    });
};
exports.useGetTeacherScheduleQuery = useGetTeacherScheduleQuery;
exports.useGetTeacherScheduleQuery.getKey = (variables) => ['GetTeacherSchedule', variables];
const useInfiniteGetTeacherScheduleQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetTeacherSchedule.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherScheduleDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetTeacherScheduleQuery = useInfiniteGetTeacherScheduleQuery;
exports.useInfiniteGetTeacherScheduleQuery.getKey = (variables) => ['GetTeacherSchedule.infinite', variables];
exports.useGetTeacherScheduleQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherScheduleDocument, variables, options);
exports.GetTeacherDetailsDocument = `
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
    assignments {
      classSubjects {
        id
        group {
          id
          type
          name
          classes {
            id
            name
            level
          }
        }
        subject {
          id
          name
          code
        }
      }
    }
  }
}
    `;
const useGetTeacherDetailsQuery = (variables, options) => {
    return (0, react_query_1.useQuery)({
        queryKey: ['GetTeacherDetails', variables],
        queryFn: (0, graphql_fetcher_1.fetcher)(exports.GetTeacherDetailsDocument, variables),
        ...options
    });
};
exports.useGetTeacherDetailsQuery = useGetTeacherDetailsQuery;
exports.useGetTeacherDetailsQuery.getKey = (variables) => ['GetTeacherDetails', variables];
const useInfiniteGetTeacherDetailsQuery = (variables, options) => {
    return (0, react_query_1.useInfiniteQuery)((() => {
        const { queryKey: optionsQueryKey, ...restOptions } = options;
        return {
            queryKey: optionsQueryKey ?? ['GetTeacherDetails.infinite', variables],
            queryFn: (metaData) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherDetailsDocument, { ...variables, ...(metaData.pageParam ?? {}) })(),
            ...restOptions
        };
    })());
};
exports.useInfiniteGetTeacherDetailsQuery = useInfiniteGetTeacherDetailsQuery;
exports.useInfiniteGetTeacherDetailsQuery.getKey = (variables) => ['GetTeacherDetails.infinite', variables];
exports.useGetTeacherDetailsQuery.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.GetTeacherDetailsDocument, variables, options);
exports.DeleteTeachersDocument = `
    mutation DeleteTeachers($teacherIds: [ID!]!, $soft: Boolean) {
  deleteTeachers(teacherIds: $teacherIds, soft: $soft) {
    ok
    message
  }
}
    `;
const useDeleteTeachersMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['DeleteTeachers'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.DeleteTeachersDocument, variables)(),
        ...options
    });
};
exports.useDeleteTeachersMutation = useDeleteTeachersMutation;
exports.useDeleteTeachersMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.DeleteTeachersDocument, variables, options);
exports.CreateTeacherDocument = `
    mutation CreateTeacher($input: CreateTeacherInput!) {
  createTeacher(input: $input) {
    ...TeacherListData
  }
}
    ${exports.TeacherListDataFragmentDoc}`;
const useCreateTeacherMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateTeacher'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateTeacherDocument, variables)(),
        ...options
    });
};
exports.useCreateTeacherMutation = useCreateTeacherMutation;
exports.useCreateTeacherMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateTeacherDocument, variables, options);
exports.CreateTeacherAssignmentDocument = `
    mutation CreateTeacherAssignment($input: CreateTeacherAssignmentInput!) {
  createTeacherAssignment(input: $input) {
    ok
    message
    details
  }
}
    `;
const useCreateTeacherAssignmentMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['CreateTeacherAssignment'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.CreateTeacherAssignmentDocument, variables)(),
        ...options
    });
};
exports.useCreateTeacherAssignmentMutation = useCreateTeacherAssignmentMutation;
exports.useCreateTeacherAssignmentMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.CreateTeacherAssignmentDocument, variables, options);
exports.SyncTeacherAssignmentDocument = `
    mutation SyncTeacherAssignment($input: CreateTeacherAssignmentInput!) {
  syncTeacherAssignment(input: $input) {
    ok
    message
    details
  }
}
    `;
const useSyncTeacherAssignmentMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['SyncTeacherAssignment'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.SyncTeacherAssignmentDocument, variables)(),
        ...options
    });
};
exports.useSyncTeacherAssignmentMutation = useSyncTeacherAssignmentMutation;
exports.useSyncTeacherAssignmentMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.SyncTeacherAssignmentDocument, variables, options);
exports.UpdateTeacherDocument = `
    mutation UpdateTeacher($teacherId: ID!, $data: CreateTeacherInput!) {
  updateTeacher(teacherId: $teacherId, data: $data) {
    ...TeacherListData
  }
}
    ${exports.TeacherListDataFragmentDoc}`;
const useUpdateTeacherMutation = (options) => {
    return (0, react_query_1.useMutation)({
        mutationKey: ['UpdateTeacher'],
        mutationFn: (variables) => (0, graphql_fetcher_1.fetcher)(exports.UpdateTeacherDocument, variables)(),
        ...options
    });
};
exports.useUpdateTeacherMutation = useUpdateTeacherMutation;
exports.useUpdateTeacherMutation.fetcher = (variables, options) => (0, graphql_fetcher_1.fetcher)(exports.UpdateTeacherDocument, variables, options);
//# sourceMappingURL=graphql.js.map