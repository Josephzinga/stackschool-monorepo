import { Day, LessonStatus, PaginationMeta } from '@stackschool/ui';
import { InitialData } from '@/components/school/lesson/lesson-dialog';

export type EventsData = {
  id: string;
  resourceId?: string;
  title: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  extendedProps: {
    subject: {
      id: string;
      name: string;
      code: string | null;
    };
    teacher: {
      id: string;
      user: {
        id: string;
        profile: {
          firstName: string;
          lastName: string;
        };
      };
    };
    lessonId: string;
    groupName: string;
    groupId: string;
    status: LessonStatus;
    day: Day;
    mode: resourceMode;
  };
};

export type ResourceData = {
  id: string;
  title: string;
};

export type ResourceMode = 'CLASS' | 'TEACHER';
export type ViewType =
  | 'resourceTimelineWeek'
  | 'resourceTimelineDay'
  | 'timeGridWeek'
  | 'timeGridDay';

export interface AdvancedFilters {
  level: string;
  section: string;
  department: string;
}

export interface TargetEventDrop {
  id: string;
  start: string;
  end: string;
  day: Day;
  originalStart?: string;
  originalEnd?: string;
  originalDay?: Day;
  revertFunc?: () => void;
}
interface Pagination {
  limit: number;
  page: number;
}
export interface LessonState {
  // Vue
  currentView: ViewType;

  // Mode ressource
  resourceMode: ResourceMode;

  // Filtres
  selectedFilter?: { type: ResourceMode; id: string } | null;
  advancedFilters: AdvancedFilters;
  showFilters: boolean;
  pagination?: Partial<PaginationMeta>;

  isLoading: boolean;
  isError: boolean;
  error: any;

  // Dialogue de confirmation
  targetEventDrop: TargetEventDrop | null;
  alertOpen: boolean;

  // Dialogue principal
  lessonDialogOpen: boolean;
  selectedLessonData: InitialData;

  // ===== ACTIONS =====
  // Actions de vue
  setCurrentView: (view: ViewType) => void;
  setResourceMode: (mode: ResourceMode) => void;

  // Actions de filtres
  setSelectedFilter: (
    filter: { type: ResourceMode; id: string } | null,
  ) => void;
  setAdvancedFilter: (key: keyof AdvancedFilters, value: string) => void;
  clearAdvancedFilters: () => void;
  toggleShowFilters: () => void;
  setPagination: (pagination?: Partial<PaginationMeta>) => void;
  // Actions données calendrier
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  clearCalendarData: () => void;

  // Actions mutations
  setTargetEventDrop: (drop: TargetEventDrop | null) => void;
  setAlertOpen: (open: boolean) => void;
  setLessonDialogOpen: (open: boolean) => void;
  setSelectedLessonData: (data: InitialData) => void;

  // Actions combinées
  resetFilters: () => void;
  resetAll: () => void;
}
