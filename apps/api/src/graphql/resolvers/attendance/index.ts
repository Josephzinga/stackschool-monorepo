import { markStudentAttendanceResolver } from './mutation/mark-students.resolver';
import { attendanceResolver } from './query/attendance.resolver';

export const attendanceResolvers = {
  ...markStudentAttendanceResolver,
  ...attendanceResolver,
};
