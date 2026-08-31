import { Day, LessonStatusEnum } from '@stackschool/contracts';
import { PaginationMeta } from '../generated/v2/graphql';

export interface Event {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  id?: string;
}

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
  status: LessonStatusEnum | 'ALL';
}

export interface TargetEventDrop {
  id: string;
  start: string;
  end: string;
  day: Day;
  resourceId: string;
  originalStart?: string;
  originalEnd?: string;
  originalDay?: Day;
  originalResourceId?: string;
  subjectId: string;
  revertFunc?: () => void;
}
interface Pagination {
  limit: number;
  page: number;
}
interface Resource {
  id: string;
  title: string;
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
  isClassOnly: boolean;
  resource: Resource;

  // Dialogue de confirmation
  targetEventDrop: TargetEventDrop | null;
  alertOpen: boolean;

  // Dialogue principal
  lessonDialogOpen: boolean;
  selectedLessonData: any;

  // ===== ACTIONS =====
  // Actions de vue
  setCurrentView: (view: ViewType) => void;
  setResourceMode: (mode: ResourceMode) => void;

  // Actions de filtres
  setSelectedFilter: (
    filter: { type: ResourceMode; id: string } | null,
  ) => void;
  setAdvancedFilter: (
    key: keyof AdvancedFilters,
    value: string | LessonStatusEnum,
  ) => void;
  clearAdvancedFilters: () => void;
  toggleShowFilters: () => void;
  setPagination: (pagination?: Partial<PaginationMeta>) => void;
  // Actions données calendrier
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  clearCalendarData: () => void;
  setIsClassOnly: (isClassOnly: boolean) => void;
  setResource: (resource: Resource) => void;

  // Actions mutations
  setTargetEventDrop: (drop: TargetEventDrop | null) => void;
  setAlertOpen: (open: boolean) => void;
  setLessonDialogOpen: (open: boolean) => void;
  setSelectedLessonData: (data: any) => void;

  // Actions combinées
  resetFilters: () => void;
  resetAll: () => void;
}
