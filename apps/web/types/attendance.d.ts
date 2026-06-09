import { AttendanceStatus, ClassSubject } from '@stackschool/ui';
export type AttendanceMode = 'STUDENT' | 'TEACHER' | 'STAFF';
export type Profile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
};
export type ClassOption = {
    id: string;
    name: string;
};
export type Student = {
    id: string;
    profile: Profile;
    class: ClassOption;
    status: AttendanceStatus;
};
export type Teacher = {
    id: string;
    profile: Profile;
    status: AttendanceStatus;
};
export type Staff = {
    id: string;
    profile: Profile;
    role: string;
    status: AttendanceStatus;
};
export type AttendanceUser = Student | Teacher | Staff;
export type AttendanceRow = {
    id: string;
    profile?: Profile;
    status: AttendanceStatus;
    class?: ClassOption;
    role?: string;
    assignments?: ClassSubject;
    userType: AttendanceMode;
};
//# sourceMappingURL=attendance.d.ts.map