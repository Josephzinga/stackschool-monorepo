export interface Event {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    id?: string;
}
export declare const toMinutes: (time: string) => number;
export declare const getEventDateTimeRange: (event: Event, referenceDate?: Date) => {
    startDate: Date;
    endDate: Date;
};
export declare const doRangesOverlap: (s1: string, e1: string, s2: string, e2: string) => boolean;
export declare const checkEventConflicts: (newEvent: Event, existingEvents: Event[], excludeEventId?: string) => boolean;
//# sourceMappingURL=check-lesson-conflict.d.ts.map