import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
export declare const useLessonEvents: () => {
    calendarRef: import("react").RefObject<FullCalendar | null>;
    handleCalendarMount: (calendar: FullCalendar) => void;
    handleEventClick: (args: EventClickArg) => void;
    handleEventSelect: (args: DateSelectArg) => void;
    handleEventDrop: (info: EventDropArg) => void;
    handleEventResize: (info: EventResizeDoneArg) => void;
    updateMutate: import("@tanstack/react-query").UseMutationResult<import("@stackschool/ui").UpdateLessonMutation, unknown, import("@stackschool/ui").Exact<{
        input: import("@stackschool/ui").UpdateLessonInput;
    }>, unknown>;
    createMutate: import("@tanstack/react-query").UseMutationResult<import("@stackschool/ui").CreateLessonMutation, unknown, import("@stackschool/ui").Exact<{
        input: import("@stackschool/ui").CreateLessonInput;
    }>, unknown>;
};
//# sourceMappingURL=useLessonEvents.d.ts.map