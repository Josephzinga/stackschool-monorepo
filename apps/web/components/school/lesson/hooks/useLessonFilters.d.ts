export declare const useLessonFilters: () => {
    resourceMode: any;
    selectedFilter: any;
    advancedFilters: any;
    teacherData: {
        __typename?: "Teacher";
        id: string;
        user?: {
            __typename?: "User";
            profile?: {
                __typename?: "Profile";
                firstname?: string | null;
                lastname?: string | null;
            } | null;
        } | null;
    }[] | undefined;
    classData: {
        id: string | undefined;
        name: string | undefined;
        level: string;
        section: string | null | undefined;
    }[] | undefined;
    uniqueLevels: string[];
    uniqueSections: string[];
    uniqueDepartments: string[];
    hasActiveAdvancedFilters: boolean;
    setSelectedFilter: any;
    setAdvancedFilter: any;
    clearAdvancedFilters: any;
};
//# sourceMappingURL=useLessonFilters.d.ts.map