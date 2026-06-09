import React from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
export type InitialData = {
    mode: 'CREATE';
    args: DateSelectArg;
} | {
    mode: 'UPDATE';
    args: EventClickArg;
} | undefined;
interface LessonDialogProps {
    onSuccess: () => Promise<void>;
}
export default function LessonDialog({ onSuccess }: LessonDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=lesson-dialog.d.ts.map