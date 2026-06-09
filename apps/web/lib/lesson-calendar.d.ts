import { Event } from '@/types/lessons-types';
export declare const getEventDateTimeRange: (event: Event, referenceDate?: Date) => {
    startDate: Date;
    endDate: Date;
};
export declare const doRangesOverlap: (start1: Date, end1: Date, start2: Date, end2: Date) => boolean;
export declare const checkEventConflicts: (newEvent: Event, existingEvents: Event[], excludeEventId?: string, specificDate?: Date) => boolean;
//# sourceMappingURL=lesson-calendar.d.ts.map