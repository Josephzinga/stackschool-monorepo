import { LessonStatus } from '@stackschool/db';
export declare const allowedTransitions: {
    PLANNED: string[];
    ONGOING: string[];
    POSTPONED: string[];
    COMPLETED: never[];
    CANCELLED: never[];
};
export declare function canTransition(current: LessonStatus | null, target: string): boolean | undefined;
//# sourceMappingURL=lesson-check-status.d.ts.map