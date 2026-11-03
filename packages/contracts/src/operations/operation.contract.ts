import { z } from 'zod';

export const AttendanceStatus = z.enum([
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
]);

export type AttendanceStatus = z.infer<typeof AttendanceStatus>;
