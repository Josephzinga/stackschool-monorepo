import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LessonState } from '@/types/lessons-types';

export const useLessonStore = create<LessonState>()(
  devtools(
    (set) => ({
      // ===== ÉTATS INITIAUX =====
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

      setCurrentView: (view) => set({ currentView: view }),

      setResourceMode: (mode) =>
        set({
          resourceMode: mode,
          selectedFilter: null,
          advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
          },
        }),

      setSelectedFilter: (filter) => set({ selectedFilter: filter }),

      setAdvancedFilter: (key, value) =>
        set((state) => ({
          advancedFilters: { ...state.advancedFilters, [key]: value },
        })),

      clearAdvancedFilters: () =>
        set({
          advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
          },
        }),

      setPagination: (pagination) =>
        set((state) => ({ ...state.pagination, pagination })),
      toggleShowFilters: () =>
        set((state) => ({ showFilters: !state.showFilters })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ isError: !!error, error }),

      clearCalendarData: () =>
        set({
          isLoading: false,
          isError: false,
          error: null,
        }),

      setTargetEventDrop: (drop) => set({ targetEventDrop: drop }),
      setAlertOpen: (open) => set({ alertOpen: open }),
      setLessonDialogOpen: (open) => set({ lessonDialogOpen: open }),
      setSelectedLessonData: (data) => set({ selectedLessonData: data }),

      // ===== ACTIONS COMPOSÉES =====
      resetFilters: () =>
        set({
          selectedFilter: null,
          advancedFilters: {
            level: '',
            section: '',
            department: '',
            status: 'ALL',
          },
          showFilters: false,
        }),

      resetAll: () =>
        set({
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
    }),
    { name: 'LessonStore' },
  ),
);
