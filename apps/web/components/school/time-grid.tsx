import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import frLocale from '@fullcalendar/core/locales/fr';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  CustomContentGenerator,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventSourceInput,
} from '@fullcalendar/core';
import '@/app/styles/schedule-grid.css';
import { lessonStatusConfig } from '@/constant';
import {
  LessonStatus,
  useGetSchoolSettingsQuery,
  useUserStore,
} from '@stackschool/ui';
import { dayMapping } from '@stackschool/shared';
import {
  ResourceLabelContentArg,
  ResourceSourceInput,
} from '@fullcalendar/resource';
import { LoaderOne } from '@/components/ui/loader';
import { ViewType } from '@/types/lessons-types';
import { TimeGridHeader } from '@/components/school/lesson/time-grid-header';
import { VerboseFormattingArg } from '@fullcalendar/core/internal';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  renderEventContent: CustomContentGenerator<EventContentArg>;
  onDatesSet?: (arg: DatesSetArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  showNavigation?: boolean;
  showViewButtons?: boolean;
  hideResourceViewButtons?: boolean;
  selectable: boolean;
  editable: boolean;
  disabledTimeGrid?: boolean;
  onEventDrop?: (info: EventDropArg) => void;
  onEventSelect?: (info: DateSelectArg) => void;
  initialView?: ViewType;
  resources?: ResourceSourceInput;
  resourceHeaderContent?: string;
  renderResourceContent?: CustomContentGenerator<ResourceLabelContentArg>;
  slotLabelFormat?: (args: VerboseFormattingArg) => any;
  onEventResize?: (arg: EventResizeDoneArg) => void;
  onEventDragStart?: () => void;
  onEventDragStop?: () => void;
  onViewChange?: (view: ViewType) => void;
  onResourceClick?: (resourceId: string) => void;
  onCalendarMount?: (calendar: FullCalendar) => void;
  hasFilter?: boolean;
}

const TimeGrid = forwardRef<any, TimeGridProps>(
  (
    {
      events,
      renderEventContent,
      onDatesSet,
      onEventClick,
      editable = false,
      selectable = false,
      onEventDrop,
      onEventSelect,
      initialView = 'timeGridWeek',
      resources,
      resourceHeaderContent,
      slotLabelFormat,
      onEventResize,
      onEventDragStart,
      onEventDragStop,
      onResourceClick,
      onCalendarMount,
      showViewButtons,
      showNavigation,
      hideResourceViewButtons,
      onViewChange,
      disabledTimeGrid,
      renderResourceContent,
      hasFilter,
    },
    ref,
  ) => {
    const [currentDateTitle, setCurrentDateTitle] = useState('');
    const [currentView, setCurrentView] = useState<ViewType>(
      initialView || 'resourceTimelineWeek',
    );
    const calendarRef = useRef<FullCalendar | null>(null);

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
        <div className="w-full min-h-[70vh] flex justify-center items-center">
          <LoaderOne />
        </div>
      );
    }
    const isResourceView = currentView?.startsWith('resource');
    return (
      <div className="w-full">
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
        <div className="h-full w-full rounded-lg border bg-card overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              resourceTimelinePlugin,
            ]}
            initialView={initialView}
            locale={frLocale}
            resources={resources}
            eventContent={renderEventContent}
            eventBorderColor="black"
            eventClassNames="rounded-[6px]!"
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
            slotLabelFormat={slotLabelFormat}
            resourceLabelContent={renderResourceContent}
            headerToolbar={false}
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
            slotLabelClassNames="text-muted-foreground text-sm font-medium"
            dayHeaderClassNames="text-foreground font-semibold py-2 border-none h-10!"
            resourceLabelClassNames="bg-gray-200 dark:bg-gray-900/80!"
            resourceAreaWidth={'15%'}
            weekends={false}
            allDaySlot={false}
            nowIndicator={true}
            slotDuration={`00:${duration}:00`}
            firstDay={1}
            slotMinWidth={100}
            lazyFetching
            resourceAreaHeaderContent={resourceHeaderContent}
            editable={editable}
            selectable={selectable}
            selectMirror={true}
            datesSet={(info) => setCurrentDateTitle(info.view.title)}
            eventClick={onEventClick}
            eventDrop={onEventDrop}
            eventDragStop={onEventDragStop}
            select={onEventSelect}
            eventResize={onEventResize}
            slotLaneClassNames={(arg) => {
              const hour = arg.date?.getHours();
              if (hour === 12) {
                return 'bg-gray-700/70 line-through text-muted-foreground/50';
              }
              return '';
            }}
          />
        </div>
      </div>
    );
  },
);

export default TimeGrid;

export const renderEventContent = (eventInfo: any) => {
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
          : `${profile?.firstname} ${profile?.lastname}`}
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
