import { EventInput } from '@fullcalendar/core';
export declare const useLessonCalendar: () => {
    events: EventInput[];
    isLoading: boolean;
    isError: boolean;
    resources: {
        id: string;
        title: string;
        extendedProps: {
            weeklyHours: number | null | undefined;
        };
    }[] | null;
    error: unknown;
};
//# sourceMappingURL=useLessonCalendar.d.ts.map