import { AttendanceStatus, ClassSubject, Profile } from '@stackschool/ui';

export type AttendanceMode = 'STUDENT' | 'TEACHER' | 'STAFF';

export type AttendanceProfile = Omit<Profile, 'id' | 'gender' | 'address'>;

export type ClassOption = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  profile: AttendanceProfile;
  class: ClassOption;
  status: AttendanceStatus;
};

export type Teacher = {
  id: string;
  profile: AttendanceProfile;
  status: AttendanceStatus;
};

export type Staff = {
  id: string;
  profile: AttendanceProfile;
  role: string;
  status: AttendanceStatus;
};

export type AttendanceUser = Student | Teacher | Staff;

export type AttendanceRow = {
  id: string;
  profile?: AttendanceProfile;
  status: AttendanceStatus | null;
  time?: {
    checkInTime: Date;
    date: Date;
  };
  class?: ClassOption;
  role?: string;
  assignments?: ClassSubject;
  userType: AttendanceMode;
};
