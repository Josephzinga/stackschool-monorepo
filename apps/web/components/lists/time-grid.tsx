'use client';
import FullCalendar, {
  CalendarRef,
  DateSelectInfo,
  EventClickInfo,
  EventDisplayInfo,
  EventDragStartInfo,
  EventDragStopInfo,
  EventDropInfo,
  EventResizeDoneInfo,
  EventSourceInput,
  FormatterInput,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import resourceTimelinePlugin from '@fullcalendar/react-scheduler/timeline';
import resourceTimelineWeek from '@fullcalendar/react-scheduler/resource-timeline';
import timeline from '@fullcalendar/react-scheduler/resource-timeline';
import frLocale from '@fullcalendar/react/locales/fr';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import '@/app/styles/schedule-grid.css';
import { lessonStatusConfig } from '@/constant';
import {
  LessonStatus,
  useGetSchoolSettingsQuery,
  useUserStore,
} from '@stackschool/ui';
import { dayMapping } from '@stackschool/contracts';
import {
  ResourceCellInfo,
  ResourceSourceInput,
} from '@fullcalendar/react-scheduler';
import { LoaderOne } from '@/components/ui/loader';
import { ViewType } from '@/types/lessons-types';
import { TimeGridHeader } from '@/components/lists/lesson/time-grid-header';
import themesPlugin from '@fullcalendar/react/themes/monarch';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import '@/app/styles/calendar.css';
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME

export interface TimeGridHandle {
  getApi: () => any;
  prev: () => void;
  next: () => void;
  today: () => void;
  changeView: (view: ViewType) => void;
  getCurrentView: () => ViewType;
}

interface TimeGridProps {
  events?: EventSourceInput;
  renderEventContent: any;
  onDatesSet?: (arg: DateSelectInfo) => void;
  onEventClick?: (arg: EventClickInfo) => void;
  showNavigation?: boolean;
  showViewButtons?: boolean;
  hideResourceViewButtons?: boolean;
  selectable: boolean;
  editable: boolean;
  disabledTimeGrid?: boolean;
  onEventDrop?: (info: EventDropInfo) => void;
  onEventSelect?: (info: DateSelectInfo) => void;
  initialView?: ViewType;
  resources?: ResourceSourceInput;
  resourceHeaderContent?: string;
  renderResourceContent?: (info: ResourceCellInfo) => React.ReactNode;
  slotLabelFormat?: (args: FormatterInput) => any;
  onEventResize?: (info: EventResizeDoneInfo) => void;
  onEventDragStart?: (info: EventDragStartInfo) => void;
  onEventDragStop?: (info: EventDragStopInfo) => void;
  onViewChange?: (view: ViewType) => void;
  onResourceClick?: (resourceId: string) => void;
  hasFilter?: boolean;
}

const TimeGrid = forwardRef<any, TimeGridProps>(
  (
    {
      events,
      renderEventContent,
      onEventClick,
      editable = false,
      selectable = false,
      onEventDrop,
      onEventSelect,
      initialView = 'timeGridWeek',
      resources,
      slotLabelFormat,
      onEventResize,
      onEventDragStart,
      onEventDragStop,
      showViewButtons,
      showNavigation,
      hideResourceViewButtons,
      onViewChange,
      disabledTimeGrid,
      renderResourceContent,
    },
    ref,
  ) => {
    const [currentDateTitle, setCurrentDateTitle] = useState('');
    const [currentView, setCurrentView] = useState<ViewType>(
      initialView || 'resourceTimelineWeek',
    );
    const calendarRef = useRef<CalendarRef | null>(null);

    const { currentSchool } = useUserStore();
    const { data, isPending } = useGetSchoolSettingsQuery(
      {
        schoolId: currentSchool?.id!,
      },
      { enabled: !!currentSchool?.id },
    );

    const startHour = data?.school.settings?.startHour || '08';
    const endHour = data?.school.settings?.endHour || '18';
    const duration = data?.school.settings?.lessonDuration || '60';
    const daysOfWeek = data?.school.settings?.daysOfWeek?.map(
      (day) => dayMapping[day!],
    ) || [1, 2, 3, 4, 5];

    useImperativeHandle(ref, () => calendarRef.current);

    const handlePrev = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.prev();
        setCurrentView(api?.view.type as ViewType);
        onViewChange?.(api.view.type as ViewType);
      }
    }, []);
    const handleViewChange = useCallback((view: string) => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.changeView(view);
        setCurrentView(api?.view.type as ViewType);
        onViewChange?.(api.view.type as ViewType);
      }
    }, []);
    const handleNext = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.next();
      }
    }, []);

    const handleToday = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.today();
        setCurrentView(api?.view.type as ViewType);
      }
    }, []);
    if (isPending) {
      return (
        <div className="min-h-[70vh] flex justify-center items-center">
          <LoaderOne />
        </div>
      );
    }
    const isResourceView = currentView?.startsWith('resource');
    return (
      <div className="w-full h-full">
        {showNavigation !== false && (
          <TimeGridHeader
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            currentView={currentView}
            isResourceView={isResourceView}
            showViewButtons={showViewButtons}
            showNavigation={showNavigation}
            onChangeView={handleViewChange}
            disableNonResourceViews={disabledTimeGrid}
            hideResourceViewButtons={hideResourceViewButtons}
            currentDateTitle={new Date().toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          />
        )}
        <div className="rounded-lg border bg-card">
          <FullCalendar
            ref={calendarRef}
            className="overflow-x-auto w-full"
            plugins={[
              themesPlugin,
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              resourceTimelineWeek,
            ]}
            initialView={initialView}
            eventMinWidth={50}
            eventMinHeight={100}
            locale={frLocale}
            resources={resources}
            eventContent={renderEventContent}
            events={events}
            height="auto"
            eventDragStart={onEventDragStart}
            slotMinTime={`${startHour}:00:00`}
            slotMaxTime={`${endHour}:00:00`}
            eventDragMinDistance={5} // Distance minimum pour démarrer un drag
            eventResizableFromStart={true} // Permettre le resize depuis le début
            eventDurationEditable={true} // Permettre l'édition de la durée
            eventStartEditable={true} // Permettre l'édition du début unselectAuto={true} // Désélectionner automatiquement
            selectLongPressDelay={300} // Délai pour la sélection sur mobile
            headerToolbar={false}
            eventClass="bg-red-500"
            businessHours={{
              daysOfWeek,
              startTime: `${startHour}:00`,
              endTime: `${endHour}:00`,
            }}
            selectOverlap={false}
            eventConstraint={{
              start: `${startHour}:00`,
              end: '12:00',
            }}
            resourceColumnsWidth={'15%'}
            weekends={false}
            allDaySlot={false}
            nowIndicator={true}
            slotDuration={`00:${duration}:00`}
            firstDay={1}
            slotMinWidth={120}
            slotMinHeight={150}
            lazyFetching
            editable={true}
            selectable={true}
            selectMirror={true}
            datesSet={(info) => setCurrentDateTitle(info.view.title)}
            eventClick={onEventClick}
            eventDrop={onEventDrop}
            eventDragStop={onEventDragStop}
            select={onEventSelect}
            eventResize={onEventResize}
          />
        </div>
      </div>
    );
  },
);

export default TimeGrid;

export const renderEventContent = (eventInfo: EventDisplayInfo) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
  const profile = eventInfo.event.extendedProps.teacher;
  const mode = eventInfo.event.extendedProps?.mode;
  const className = eventInfo.event.extendedProps?.groupName;
  const isDragging = eventInfo?.isDragging;

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-hidden gap-1 leading-tight p-1 transition-all',
        isDragging && 'opacity-80 scale-95 shadow-lg',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs truncate">
          {eventInfo.event.extendedProps.subject?.name}
        </span>
      </div>

      <div
        className={cn(
          'text-[10px] opacity-80 font-medium truncate',
          mode === 'TEACHER' && 'uppercase text-xs tracking-tight',
        )}
      >
        {mode === 'TEACHER'
          ? className
          : `${profile?.firstName} ${profile?.lastName}`}
      </div>

      <div className="mt-auto text-[10px] text-gray-700 font-mono">
        {eventInfo.timeText}
      </div>

      <div className="w-full flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            'flex items-center gap-0.5 text-[9px] font-semibold px-1 py-px',
            cfg.badgeClass,
          )}
        >
          {' '}
          <cfg.icon />
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
};
