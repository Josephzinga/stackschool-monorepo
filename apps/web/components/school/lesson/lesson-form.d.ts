import React from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { ResourceMode } from '@stackschool/ui';
export type InitialLessonData = {
    mode: 'CREATE';
    args: DateSelectArg;
} | {
    mode: 'UPDATE';
    args: EventClickArg;
} | undefined;
type LessonFormProps = {
    initialData: InitialLessonData;
    resourceId?: string;
    onSuccess: () => Promise<void>;
    onClose: () => void;
    resourceMode: ResourceMode;
    selectedFilter?: {
        type: ResourceMode;
        id: string;
    } | null;
    isClassOnly?: boolean;
};
export declare function LessonForm({ initialData, onSuccess, onClose, resourceMode, selectedFilter, resourceId, isClassOnly, }: LessonFormProps): React.JSX.Element;
export {};
//# sourceMappingURL=lesson-form.d.ts.map