"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLessonStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useLessonStore = (0, zustand_1.create)()((0, middleware_1.devtools)((set) => ({
    currentView: 'resourceTimelineWeek',
    resourceMode: 'CLASS',
    selectedFilter: null,
    advancedFilters: {
        level: '',
        section: '',
        department: '',
        status: 'ALL',
    },
    showFilters: false,
    pagination: {
        limit: 10,
        page: 0,
        totalPages: 0,
        total: 0,
    },
    isLoading: false,
    isError: false,
    error: null,
    targetEventDrop: null,
    alertOpen: false,
    lessonDialogOpen: false,
    selectedLessonData: undefined,
    isClassOnly: false,
    resource: {
        id: '',
        name: '',
    },
    setCurrentView: (view) => set({ currentView: view }),
    setResourceMode: (mode) => set({
        resourceMode: mode,
        selectedFilter: null,
        advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
        },
    }),
    setIsClassOnly: (isClassOnly) => {
        return set({ isClassOnly: isClassOnly });
    },
    setResource: (resource) => set({ resource }),
    setSelectedFilter: (filter) => set({ selectedFilter: filter }),
    setAdvancedFilter: (key, value) => set((state) => ({
        advancedFilters: { ...state.advancedFilters, [key]: value },
    })),
    clearAdvancedFilters: () => set({
        advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
        },
    }),
    setPagination: (pagination) => set((state) => ({ ...state.pagination, pagination })),
    toggleShowFilters: () => set((state) => ({ showFilters: !state.showFilters })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ isError: !!error, error }),
    clearCalendarData: () => set({
        isLoading: false,
        isError: false,
        error: null,
    }),
    setTargetEventDrop: (drop) => set({ targetEventDrop: drop }),
    setAlertOpen: (open) => set({ alertOpen: open }),
    setLessonDialogOpen: (open) => set({ lessonDialogOpen: open }),
    setSelectedLessonData: (data) => set({ selectedLessonData: data }),
    resetFilters: () => set({
        selectedFilter: null,
        advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
        },
        showFilters: false,
    }),
    resetAll: () => set({
        currentView: 'resourceTimelineWeek',
        resourceMode: 'CLASS',
        selectedFilter: null,
        advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
        },
        showFilters: false,
        isLoading: false,
        isError: false,
        error: null,
        targetEventDrop: null,
        alertOpen: false,
        lessonDialogOpen: false,
        selectedLessonData: undefined,
    }),
}), { name: 'LessonStore' }));
//# sourceMappingURL=lesson-store.js.map