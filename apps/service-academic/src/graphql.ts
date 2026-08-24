
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum SubjectCategory {
    SCIENTIFIC = "SCIENTIFIC",
    LITERARY = "LITERARY",
    GENERAL = "GENERAL",
    SPORT = "SPORT"
}

export enum AssessmentType {
    EXAM = "EXAM",
    ASSIGNMENT = "ASSIGNMENT",
    QUIZ = "QUIZ",
    TEST = "TEST",
    PRACTICAL = "PRACTICAL",
    ORAL = "ORAL"
}

export enum AssessmentStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CLOSED = "CLOSED"
}

export enum LessonStatus {
    PLANNED = "PLANNED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED"
}

export enum GroupType {
    SOLO = "SOLO",
    MULTIPLE = "MULTIPLE"
}

export enum ResourceMode {
    TEACHER = "TEACHER",
    CLASS = "CLASS"
}

export enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export class ClassSubjectInput {
    id?: Nullable<string>;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId: string;
    coefficient: number;
    weeklyHours?: Nullable<number>;
}

export class CreateClassInput {
    section?: Nullable<string>;
    name: string;
    level: string;
    supervisorId?: Nullable<string>;
}

export class GetSchoolClassesInput {
    page: number;
    limit: number;
    level?: Nullable<string>;
    section?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
    schoolId?: Nullable<string>;
}

export class CreateGroupInput {
    name: string;
    classIds: string[];
}

export class GetLessonsInput {
    groupId?: Nullable<string>;
    teacherId?: Nullable<string>;
    classId?: Nullable<string>;
    department?: Nullable<string>;
    mode: ResourceMode;
    hasLessonOnly?: Nullable<boolean>;
    section?: Nullable<string>;
    status?: Nullable<LessonStatus>;
    level?: Nullable<string>;
    limit: number;
    page: number;
}

export class CreateLessonInput {
    day: Day;
    mode: ResourceMode;
    startTime: DateTime;
    endTime: DateTime;
    subjectId: string;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
}

export class UpdateLessonInput {
    id: string;
    startTime?: Nullable<DateTime>;
    endTime?: Nullable<DateTime>;
    groupId?: Nullable<string>;
    teacherId?: Nullable<string>;
    subjectId?: Nullable<string>;
    day?: Nullable<Day>;
    mode: ResourceMode;
}

export class CreateRoomInput {
    id?: Nullable<string>;
    name: string;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    code?: Nullable<string>;
    defaultClassId?: Nullable<string>;
}

export class GetSchoolRoomInput {
    page: number;
    limit: number;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    searchTerm?: Nullable<string>;
}

export class GetSubjectInput {
    page: number;
    limit: number;
    searchTerm?: Nullable<string>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
}

export class CreateSubjectInput {
    name: string;
    code: string;
    mainTeacherId?: Nullable<string>;
    category: SubjectCategory;
    classSubject?: Nullable<ClassSubjectInput[]>;
}

export class CreateTeacherAssignmentInput {
    classId: string;
    subjectIds: string[];
    teacherId: string;
}

export class Assessment {
    id: string;
    type?: Nullable<AssessmentType>;
    description?: Nullable<string>;
    status?: Nullable<AssessmentStatus>;
    weight?: Nullable<number>;
    maxScore?: Nullable<number>;
}

export class ClassSubject {
    id: string;
    coefficient?: Nullable<number>;
    weeklyHours?: Nullable<number>;
    teacherId?: Nullable<string>;
    subjectId?: Nullable<string>;
    groupId: string;
    subject: Subject;
    assignment?: Nullable<TeacherAssignment>;
    group: Group;
    assessments?: Nullable<Assessment[]>;
}

export class ClassAndSubject {
    classes?: Nullable<Class[]>;
    subjects?: Nullable<Subject[]>;
}

export class SearchClassesAndSubjects {
    searchClasses?: Nullable<Nullable<Class>[]>;
    searchSubjects?: Nullable<Nullable<Subject>[]>;
}

export class Class {
    id: string;
    name: string;
    level: string;
    section?: Nullable<string>;
    defaultRoom?: Nullable<Room>;
    groupId: string;
    group?: Nullable<Group>;
    teachingTeamMembers?: Nullable<TeacherAssignment[]>;
    statistics?: Nullable<ClassStatistics>;
    totalCoefficient?: Nullable<number>;
    totalWeeklyHours?: Nullable<number>;
}

export class SubjectAssignments {
    id: string;
    subject: Subject;
}

export class ClassList {
    data?: Nullable<Class[]>;
    meta: PaginationMeta;
}

export class ClassStatistics {
    teachers: number;
    subjects: number;
    students: GenderStats;
}

export class ClassLessons {
    classSubject?: Nullable<ClassSubject>;
    lesson?: Nullable<Lesson>;
}

export class Teacher {
    id: string;
    assignments?: Nullable<Nullable<TeacherAssignment>[]>;
    supervisedClasses?: Nullable<Nullable<Class>[]>;
}

export class Student {
    id: string;
    schoolClass?: Nullable<Class>;
}

export class SchoolStats {
    id: string;
    totalClasses: number;
    classesOccupancy?: Nullable<Nullable<ClassStats>[]>;
}

export class ClassStats {
    className: string;
    studentCount: number;
}

export class Group {
    id: string;
    name: string;
    type?: Nullable<GroupType>;
    classes: Class[];
    classSubjects?: Nullable<Nullable<ClassSubject>[]>;
}

export class Lesson {
    id: string;
    title?: Nullable<string>;
    startTime?: Nullable<DateTime>;
    endTime?: Nullable<DateTime>;
    day?: Nullable<Day>;
    teacherAssignmentId: string;
    teacherAssignment?: Nullable<TeacherAssignment>;
    status: LessonStatus;
    room?: Nullable<Room>;
}

export class LessonsEvents {
    id: string;
    resourceId?: Nullable<string>;
    title: string;
    startTime: string;
    endTime: string;
    day: Day;
    status?: Nullable<LessonStatus>;
    subject: Subject;
    group?: Nullable<Group>;
    teacher?: Nullable<LessonTeacher>;
    room?: Nullable<Room>;
}

export class LessonTeacher {
    id: string;
    firstName: string;
    lastName: string;
    weeklyHours?: Nullable<number>;
}

export class LessonsData {
    events?: Nullable<LessonsEvents[]>;
    resources?: Nullable<LessonResources[]>;
}

export class LessonsList {
    data: LessonsData;
    meta?: Nullable<PaginationMeta>;
}

export class LessonResources {
    id: string;
    title: string;
    weeklyHours?: Nullable<number>;
}

export abstract class IMutation {
    abstract createClass(data: CreateClassInput): Class | Promise<Class>;

    abstract updateClass(data: CreateClassInput, schoolId: string, classId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteClasses(classIds: string[], schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createSubject(input: CreateSubjectInput): Nullable<Subject> | Promise<Nullable<Subject>>;

    abstract deleteSubjects(subjectIds: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;

    abstract updateClassSubject(input: ClassSubjectInput): ClassSubject | Promise<ClassSubject>;

    abstract deleteClassSubjects(ids: string[]): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createLesson(input: CreateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract updateLessonStatus(status: LessonStatus, id: string): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract updateLesson(input: UpdateLessonInput): Nullable<Lesson> | Promise<Nullable<Lesson>>;

    abstract deleteLesson(id: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createRoom(input: CreateRoomInput): Room | Promise<Room>;

    abstract updateRoom(input: CreateRoomInput): Room | Promise<Room>;

    abstract createGroup(input: CreateGroupInput): Group | Promise<Group>;

    abstract createTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract syncTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteTeacherAssignment(id: string, subjectIds?: Nullable<string[]>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
}

export abstract class IQuery {
    abstract getClassSubjects(classId?: Nullable<string>, teacherId?: Nullable<string>, groupId?: Nullable<string>, searchTerm?: Nullable<string>): Nullable<ClassSubject[]> | Promise<Nullable<ClassSubject[]>>;

    abstract class(id: string): Nullable<Class> | Promise<Nullable<Class>>;

    abstract getSchoolClasses(input: GetSchoolClassesInput): ClassList | Promise<ClassList>;

    abstract getLessons(filter: GetLessonsInput): Nullable<LessonsList> | Promise<Nullable<LessonsList>>;

    abstract getSchoolSubjects(input: GetSubjectInput): Nullable<SubjectList> | Promise<Nullable<SubjectList>>;

    abstract getSchoolRooms(filter: GetSchoolRoomInput): RoomList | Promise<RoomList>;
}

export class Room {
    id: string;
    name: string;
    code?: Nullable<string>;
    capacity?: Nullable<number>;
    type?: Nullable<string>;
    class?: Nullable<Nullable<Class>[]>;
    defaultForClass?: Nullable<Class>;
}

export class RoomList {
    data: Nullable<Room>[];
    meta?: Nullable<PaginationMeta>;
}

export class Subject {
    id: string;
    name: string;
    code?: Nullable<string>;
    category?: Nullable<SubjectCategory>;
    totalWeeklyHours?: Nullable<number>;
    mainTeacherId?: Nullable<string>;
    classSubject?: Nullable<Nullable<ClassSubject>[]>;
}

export class SubjectList {
    data: Subject[];
    meta: PaginationMeta;
}

export class TeacherAssignment {
    id: string;
    teacherId: string;
    schoolId?: Nullable<string>;
    classSubjectId?: Nullable<string>;
    classSubject?: Nullable<ClassSubject>;
    lessons?: Nullable<Nullable<Lesson>[]>;
}

export class ApiResponse {
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    details?: Nullable<Nullable<string>[]>;
}

export class PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GenderStats {
    male: number;
    female: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
