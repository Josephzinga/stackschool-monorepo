export declare const useLessonStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<LessonState>, "setState" | "devtools"> & {
    setState(partial: any, replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: any, replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}>;
//# sourceMappingURL=lesson-store.d.ts.map