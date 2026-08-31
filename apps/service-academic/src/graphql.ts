
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

export enum GroupType {
    SOLO = "SOLO",
    MULTIPLE = "MULTIPLE"
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

export enum LessonStatus {
    PLANNED = "PLANNED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED"
}

export enum ResourceMode {
    TEACHER = "TEACHER",
    CLASS = "CLASS"
}

export enum link__Purpose {
    SECURITY = "SECURITY",
    EXECUTION = "EXECUTION"
}

export class ClassSubjectInput {
    id?: Nullable<string>;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    subjectId?: Nullable<string>;
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

export class CreateLessonInput {
    day: Day;
    mode: ResourceMode;
    startTime: DateTime;
    endTime: DateTime;
    subjectId: string;
    teacherId?: Nullable<string>;
    groupId?: Nullable<string>;
    roomId?: Nullable<string>;
    title?: Nullable<string>;
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
    classSubjects?: Nullable<ClassSubjectInput[]>;
}

export class DeleteSubjectsInput {
    subjectIds: string[];
    soft: boolean;
}

export class CreateTeacherAssignmentInput {
    classId: string;
    subjectIds: string[];
    teacherId: string;
}

export class GetTeacherAssignmentInput {
    groupId?: Nullable<string>;
    classId?: Nullable<string>;
    teacherId?: Nullable<string>;
    limit?: Nullable<number>;
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
    subjectId: string;
    groupId: string;
    subject?: Nullable<Subject>;
    assignment?: Nullable<TeacherAssignment>;
    group?: Nullable<Group>;
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
    classId: string;
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
    classes?: Nullable<Class[]>;
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

export class LessonEvents {
    id: string;
    subject?: Nullable<Subject>;
    room?: Nullable<Room>;
}

export class Subject {
    id: string;
    name: string;
    code?: Nullable<string>;
    category?: Nullable<SubjectCategory>;
    totalWeeklyHours?: Nullable<number>;
    mainTeacherId?: Nullable<string>;
    classSubjects?: Nullable<Nullable<ClassSubject>[]>;
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

export abstract class IMutation {
    abstract createClass(data: CreateClassInput): Class | Promise<Class>;

    abstract updateClass(data: CreateClassInput, schoolId: string, classId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteClasses(classIds: string[], schoolId: string): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract createSubject(input: CreateSubjectInput): Nullable<Subject> | Promise<Nullable<Subject>>;

    abstract deleteSubjects(input: DeleteSubjectsInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

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

    abstract createTeacherAssignment(input: CreateTeacherAssignmentInput): TeacherAssignment | Promise<TeacherAssignment>;

    abstract syncTeacherAssignment(input: CreateTeacherAssignmentInput): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;

    abstract deleteTeacherAssignment(id: string, subjectIds?: Nullable<string[]>): Nullable<ApiResponse> | Promise<Nullable<ApiResponse>>;
}

export abstract class IQuery {
    abstract getClassSubjects(classId?: Nullable<string>, teacherId?: Nullable<string>, groupId?: Nullable<string>, searchTerm?: Nullable<string>): Nullable<ClassSubject[]> | Promise<Nullable<ClassSubject[]>>;

    abstract class(id: string): Nullable<Class> | Promise<Nullable<Class>>;

    abstract getSchoolClasses(input: GetSchoolClassesInput): ClassList | Promise<ClassList>;

    abstract getSchoolSubjects(input: GetSubjectInput): Nullable<SubjectList> | Promise<Nullable<SubjectList>>;

    abstract getSchoolRooms(filter: GetSchoolRoomInput): RoomList | Promise<RoomList>;

    abstract getTeacherAssignments(filter?: Nullable<GetTeacherAssignmentInput>): Nullable<Nullable<TeacherAssignment>[]> | Promise<Nullable<Nullable<TeacherAssignment>[]>>;
}

export class RoomList {
    data: Nullable<Room>[];
    meta?: Nullable<PaginationMeta>;
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

export class _Service {
    sdl?: Nullable<string>;
}

export type DateTime = any;
export type link__Import = any;
export type federation__FieldSet = any;
export type _Any = any;

export class ISchema {
    Query: IQuery;
    Mutation: IMutation;
}

export type _Entity = Class | ClassStats | LessonEvents | Room | SchoolStats | Student | Subject | Teacher | TeacherAssignment;
type Nullable<T> = T | null;
