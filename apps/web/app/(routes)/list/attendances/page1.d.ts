import React from 'react';
import { AttendanceStatus } from '@stackschool/ui';
import { z } from 'zod';
export declare const attendanceSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<typeof AttendanceStatus>;
    userType: z.ZodEnum<{
        TEACHER: "TEACHER";
        STUDENT: "STUDENT";
        STAFF: "STAFF";
    }>;
}, z.core.$strip>>;
export type AttendanceFormType = z.infer<typeof attendanceSchema>;
export declare function AttendanceDashboard(): React.JSX.Element;
//# sourceMappingURL=page1.d.ts.map