interface ResourceWithDetails {
    id: string;
    title: string;
    totalHours?: number;
    lessons?: Array<{
        subject: string;
        day: string;
        start: string;
        end: string;
        room?: string;
    }>;
}
export declare function RenderResourceContent({ resource, onClick, }: {
    resource: ResourceWithDetails;
    onClick: (r: any) => void;
}): import("react").JSX.Element;
export declare const TimeGridContainer: ({ children, }: {
    children: React.ReactNode;
}) => import("react").JSX.Element;
export {};
//# sourceMappingURL=render-resource-content.d.ts.map