interface LectureCardProps {
    classe: string;
    time: string;
    realStartTime?: string;
    title: string;
    subject: string;
    chapter: string;
    teacher?: {
        name: string;
        photo?: string;
    };
    room?: string;
    status: 'SCHEDULED' | 'STARTED' | 'FINISHED';
}
export declare function LectureCard({ classe, time, title, subject, chapter, teacher, room, status, realStartTime, }: LectureCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=lecture-card.d.ts.map