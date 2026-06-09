export declare const classSubjectResolvers: {
    [x: string]: any;
    ApiResponse?: import("../../types.generated").ApiResponseResolvers<import("../../../types/context").Context, import("../../types.generated").ApiResponse> | undefined;
    Assessment?: import("../../types.generated").AssessmentResolvers<import("../../../types/context").Context, import("../../types.generated").Assessment> | undefined;
    AttendanceRecord?: import("../../types.generated").AttendanceRecordResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").AttendanceRecord, "recordedBy" | "person"> & {
        person?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Person"]>;
        recordedBy?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
    }> | undefined;
    AttendanceSessionPayload?: import("../../types.generated").AttendanceSessionPayloadResolvers<import("../../../types/context").Context, import("../../types.generated").AttendanceSessionPayload> | undefined;
    AttendanceStats?: import("../../types.generated").AttendanceStatsResolvers<import("../../../types/context").Context, import("../../types.generated").AttendanceStats> | undefined;
    Class?: import("../../types.generated").ClassResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Class, "students" | "group" | "supervisor" | "defaultRoom" | "teachingTeamMembers"> & {
        defaultRoom?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>;
        group?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Group"]>;
        students?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Student"]>>;
        supervisor?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
        teachingTeamMembers?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["TeachingTeamMember"]>>;
    }> | undefined;
    ClassAndSubject?: import("../../types.generated").ClassAndSubjectResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ClassAndSubject, "classes" | "subjects"> & {
        classes?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Class"]>>;
        subjects?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Subject"]>>;
    }> | undefined;
    ClassCount?: import("../../types.generated").ClassCountResolvers<import("../../../types/context").Context, import("../../types.generated").ClassCount> | undefined;
    ClassList?: import("../../types.generated").ClassListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ClassList, "data"> & {
        data?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Class"]>>;
    }> | undefined;
    ClassStats?: import("../../types.generated").ClassStatsResolvers<import("../../../types/context").Context, import("../../types.generated").ClassStats> | undefined;
    ClassSubject?: import("../../types.generated").ClassSubjectResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ClassSubject, "assessments" | "subject" | "group" | "assignment"> & {
        assessments?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Assessment"]>>;
        assignment?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["TeacherAssignments"]>;
        group: import("../../types.generated").ResolversParentTypes["Group"];
        subject: import("../../types.generated").ResolversParentTypes["Subject"];
    }> | undefined;
    ClassTeacher?: import("../../types.generated").ClassTeacherResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ClassTeacher, "classes" | "teacher" | "groups"> & {
        classes?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>>>;
        groups?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Group"]>>;
        teacher?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>>>;
    }> | undefined;
    DailyAttendance?: import("../../types.generated").DailyAttendanceResolvers<import("../../../types/context").Context, import("../../types.generated").DailyAttendance> | undefined;
    Date?: import("graphql").GraphQLScalarType;
    DateTime?: import("graphql").GraphQLScalarType;
    Day?: import("../../types.generated").EnumResolverSignature<{
        FRIDAY?: any;
        MONDAY?: any;
        SATURDAY?: any;
        SUNDAY?: any;
        THURSDAY?: any;
        TUESDAY?: any;
        WEDNESDAY?: any;
    }, import("@stackschool/db/src").$Enums.Day> | undefined;
    Gender?: import("../../types.generated").EnumResolverSignature<{
        FEMALE?: any;
        MALE?: any;
    }, import("@stackschool/db/src").$Enums.Gender> | undefined;
    GenderStats?: import("../../types.generated").GenderStatsResolvers<import("../../../types/context").Context, import("../../types.generated").GenderStats> | undefined;
    Group?: import("../../types.generated").GroupResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Group, "classes" | "classSubjects"> & {
        classSubjects?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ClassSubject"]>>>;
        classes: Array<import("../../types.generated").ResolversParentTypes["Class"]>;
    }> | undefined;
    GroupType?: import("../../types.generated").EnumResolverSignature<{
        MULTIPLE?: any;
        SOLO?: any;
    }, import("@stackschool/db/src").$Enums.GroupType> | undefined;
    Lesson?: import("../../types.generated").LessonResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Lesson, "room" | "teacherAssignment"> & {
        room?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>;
        teacherAssignment?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["TeacherAssignments"]>;
    }> | undefined;
    LessonResources?: import("../../types.generated").LessonResourcesResolvers<import("../../../types/context").Context, import("../../types.generated").LessonResources> | undefined;
    LessonStatus?: import("../../types.generated").EnumResolverSignature<{
        CANCELLED?: any;
        COMPLETED?: any;
        ONGOING?: any;
        PLANNED?: any;
        POSTPONED?: any;
    }, import("@stackschool/db/src").$Enums.LessonStatus> | undefined;
    LessonTeacher?: import("../../types.generated").LessonTeacherResolvers<import("../../../types/context").Context, import("../../types.generated").LessonTeacher> | undefined;
    LessonsData?: import("../../types.generated").LessonsDataResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").LessonsData, "events"> & {
        events?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["LessonsEvents"]>>;
    }> | undefined;
    LessonsEvents?: import("../../types.generated").LessonsEventsResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").LessonsEvents, "room" | "subject" | "group"> & {
        group?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Group"]>;
        room?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>;
        subject: import("../../types.generated").ResolversParentTypes["Subject"];
    }> | undefined;
    LessonsList?: import("../../types.generated").LessonsListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").LessonsList, "data"> & {
        data: import("../../types.generated").ResolversParentTypes["LessonsData"];
    }> | undefined;
    MonthlyRevenue?: import("../../types.generated").MonthlyRevenueResolvers<import("../../../types/context").Context, import("../../types.generated").MonthlyRevenue> | undefined;
    MonthlyStats?: import("../../types.generated").MonthlyStatsResolvers<import("../../../types/context").Context, import("../../types.generated").MonthlyStats> | undefined;
    Mutation?: import("../../types.generated").MutationResolvers<import("../../../types/context").Context, Record<PropertyKey, never>> | undefined;
    PaginationMeta?: import("../../types.generated").PaginationMetaResolvers<import("../../../types/context").Context, import("../../types.generated").PaginationMeta> | undefined;
    Parent?: import("../../types.generated").ParentResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Parent, "parentStudent" | "user"> & {
        parentStudent?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ParentStudent"]>>>;
        user?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
    }> | undefined;
    ParentList?: import("../../types.generated").ParentListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ParentList, "data"> & {
        data?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Parent"]>>;
    }> | undefined;
    ParentStudent?: import("../../types.generated").ParentStudentResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").ParentStudent, "student" | "parent"> & {
        parent?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Parent"]>;
        student?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Student"]>;
    }> | undefined;
    Person?: import("../../types.generated").PersonResolvers<import("../../../types/context").Context, import("../../types.generated").Staff | (import("../../types.generated").Omit<import("../../types.generated").Student, "parentStudent" | "schoolClass" | "attendances" | "user"> & {
        attendances?: import("../../types.generated").Maybe<(import("../../types.generated").Omit<import("../../types.generated").AttendanceRecord, "recordedBy" | "person"> & {
            person?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Person"]>;
            recordedBy?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
        })[]> | undefined;
        parentStudent?: import("../../types.generated").Maybe<import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").ParentStudent, "student" | "parent"> & {
            parent?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Parent"]>;
            student?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Student"]>;
        }>[]> | undefined;
        schoolClass?: import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").Class, "students" | "group" | "supervisor" | "defaultRoom" | "teachingTeamMembers"> & {
            defaultRoom?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>;
            group?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Group"]>;
            students?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Student"]>>;
            supervisor?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
            teachingTeamMembers?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["TeachingTeamMember"]>>;
        }> | undefined;
        user?: import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").User, "memberships" | "schoolContext"> & {
            memberships?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>>>;
            schoolContext?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>;
        }> | undefined;
    }) | (import("../../types.generated").Omit<import("../../types.generated").Teacher, "attendances" | "user" | "supervisedClasses" | "assignments"> & {
        assignments?: import("../../types.generated").Maybe<import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").TeacherAssignments, "lessons" | "classSubjects" | "teacher"> & {
            classSubjects?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ClassSubject"]>;
            lessons?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Lesson"]>>;
            teacher?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
        }>[]> | undefined;
        attendances?: import("../../types.generated").Maybe<(import("../../types.generated").Omit<import("../../types.generated").AttendanceRecord, "recordedBy" | "person"> & {
            person?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Person"]>;
            recordedBy?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
        })[]> | undefined;
        supervisedClasses?: import("../../types.generated").Maybe<import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").Class, "students" | "group" | "supervisor" | "defaultRoom" | "teachingTeamMembers"> & {
            defaultRoom?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>;
            group?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Group"]>;
            students?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Student"]>>;
            supervisor?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
            teachingTeamMembers?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["TeachingTeamMember"]>>;
        }>[]> | undefined;
        user?: import("../../types.generated").Maybe<import("../../types.generated").Omit<import("../../types.generated").User, "memberships" | "schoolContext"> & {
            memberships?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>>>;
            schoolContext?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>;
        }> | undefined;
    })> | undefined;
    Profile?: import("../../types.generated").ProfileResolvers<import("../../../types/context").Context, import("../../types.generated").Profile> | undefined;
    Query?: import("../../types.generated").QueryResolvers<import("../../../types/context").Context, Record<PropertyKey, never>> | undefined;
    RelationType?: import("../../types.generated").EnumResolverSignature<{
        AUNT?: any;
        FATHER?: any;
        GRAND_FATHER?: any;
        GRAND_MOTHER?: any;
        GUARDIAN?: any;
        MOTHER?: any;
        OTHER?: any;
        UNCLE?: any;
    }, import("@stackschool/db/src").$Enums.RelationType> | undefined;
    Room?: import("../../types.generated").RoomResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Room, "class" | "defaultForClass"> & {
        class?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>>>;
        defaultForClass?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>;
    }> | undefined;
    RoomList?: import("../../types.generated").RoomListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").RoomList, "data"> & {
        data: Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Room"]>>;
    }> | undefined;
    School?: import("../../types.generated").SchoolResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").School, "lessons" | "teachers"> & {
        lessons?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Lesson"]>>>;
        teachers?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>>>;
    }> | undefined;
    SchoolId?: import("graphql").GraphQLScalarType;
    SchoolMembership?: import("../../types.generated").SchoolMembershipResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").SchoolMembership, "student" | "school" | "teacher" | "parent"> & {
        parent?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Parent"]>;
        school: import("../../types.generated").ResolversParentTypes["School"];
        student?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Student"]>;
        teacher?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
    }> | undefined;
    SchoolSettings?: import("../../types.generated").SchoolSettingsResolvers<import("../../../types/context").Context, import("../../types.generated").SchoolSettings> | undefined;
    SchoolStats?: import("../../types.generated").SchoolStatsResolvers<import("../../../types/context").Context, import("../../types.generated").SchoolStats> | undefined;
    SearchClassesAndSubjects?: import("../../types.generated").SearchClassesAndSubjectsResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").SearchClassesAndSubjects, "searchClasses" | "searchSubjects"> & {
        searchClasses?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>>>;
        searchSubjects?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Subject"]>>>;
    }> | undefined;
    Staff?: import("../../types.generated").StaffResolvers<import("../../../types/context").Context, import("../../types.generated").Staff> | undefined;
    Student?: import("../../types.generated").StudentResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Student, "parentStudent" | "schoolClass" | "attendances" | "user"> & {
        attendances?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["AttendanceRecord"]>>;
        parentStudent?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ParentStudent"]>>>;
        schoolClass?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>;
        user?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
    }> | undefined;
    StudentDisciplinaryAction?: import("../../types.generated").StudentDisciplinaryActionResolvers<import("../../../types/context").Context, import("../../types.generated").StudentDisciplinaryAction> | undefined;
    StudentList?: import("../../types.generated").StudentListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").StudentList, "data"> & {
        data?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Student"]>>;
    }> | undefined;
    StudentStatus?: import("../../types.generated").EnumResolverSignature<{
        ACTIVE?: any;
        DECEASED?: any;
        DROPPED_OUT?: any;
        EXPELLED?: any;
        GRADUATED?: any;
        INACTIVE?: any;
        SUSPENDED?: any;
        TRANSFERRED?: any;
    }, import("@stackschool/db/src").$Enums.StudentStatus> | undefined;
    Subject?: import("../../types.generated").SubjectResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Subject, "mainTeacher" | "classSubject"> & {
        classSubject?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ClassSubject"]>>>;
        mainTeacher?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
    }> | undefined;
    SubjectAssignments?: import("../../types.generated").SubjectAssignmentsResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").SubjectAssignments, "subject"> & {
        subject: import("../../types.generated").ResolversParentTypes["Subject"];
    }> | undefined;
    SubjectCategory?: import("../../types.generated").EnumResolverSignature<{
        GENERAL?: any;
        LITERARY?: any;
        SCIENTIFIC?: any;
        SPORT?: any;
    }, import("@stackschool/db/src").$Enums.SubjectCategory> | undefined;
    SubjectList?: import("../../types.generated").SubjectListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").SubjectList, "data"> & {
        data: Array<import("../../types.generated").ResolversParentTypes["Subject"]>;
    }> | undefined;
    Teacher?: import("../../types.generated").TeacherResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").Teacher, "attendances" | "user" | "supervisedClasses" | "assignments"> & {
        assignments?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["TeacherAssignments"]>>>;
        attendances?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["AttendanceRecord"]>>;
        supervisedClasses?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Class"]>>>;
        user?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
    }> | undefined;
    TeacherAssignments?: import("../../types.generated").TeacherAssignmentsResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").TeacherAssignments, "lessons" | "classSubjects" | "teacher"> & {
        classSubjects?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["ClassSubject"]>;
        lessons?: import("../../types.generated").Maybe<Array<import("../../types.generated").ResolversParentTypes["Lesson"]>>;
        teacher?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["Teacher"]>;
    }> | undefined;
    TeacherList?: import("../../types.generated").TeacherListResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").TeacherList, "data"> & {
        data: Array<import("../../types.generated").ResolversParentTypes["Teacher"]>;
    }> | undefined;
    TeachingTeamMember?: import("../../types.generated").TeachingTeamMemberResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").TeachingTeamMember, "teacher" | "assignments"> & {
        assignments: Array<import("../../types.generated").ResolversParentTypes["SubjectAssignments"]>;
        teacher: import("../../types.generated").ResolversParentTypes["Teacher"];
    }> | undefined;
    TransportMode?: import("../../types.generated").EnumResolverSignature<{
        BUS?: any;
        CAR?: any;
        MOTO?: any;
        OTHER?: any;
        PARENT?: any;
        TAXI?: any;
        WALK?: any;
    }, import("@stackschool/db/src").$Enums.TransportMode> | undefined;
    User?: import("../../types.generated").UserResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").User, "memberships" | "schoolContext"> & {
        memberships?: import("../../types.generated").Maybe<Array<import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>>>;
        schoolContext?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["SchoolMembership"]>;
    }> | undefined;
    UserPayload?: import("../../types.generated").UserPayloadResolvers<import("../../../types/context").Context, import("../../types.generated").Omit<import("../../types.generated").UserPayload, "user"> & {
        user?: import("../../types.generated").Maybe<import("../../types.generated").ResolversParentTypes["User"]>;
    }> | undefined;
};
//# sourceMappingURL=index.d.ts.map