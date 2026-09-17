'use client';
import FullCalendar, {
  BusinessHoursInput,
  CalendarRef,
  ClassNameGenerator,
  ConstraintInput,
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
import resourceTimelineWeek from '@fullcalendar/react-scheduler/resource-timeline';
import frLocale from '@fullcalendar/react/locales/fr';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import '@/app/styles/schedule-grid.css';
import {
  ResourceCellInfo,
  ResourceSourceInput,
} from '@fullcalendar/react-scheduler';
import { ViewType } from '@/types/lessons-types';
import { TimeGridHeader } from '@/components/lists/lesson/time-grid-header';
import themesPlugin from '@fullcalendar/react/themes/monarch';

import '@/app/styles/calendar.css';
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME

// ---------------------------------------------------------------------------
// Domain-agnostic calendar shell. It knows nothing about lessons, teachers,
// or school settings — schedule bounds (business hours, slot sizing) and
// event appearance (eventClass, renderEventContent) are all supplied by the
// caller. This is what makes it safe to reuse for a different resource type
// (exam rooms, staff schedules, ...) later without dragging lesson-specific
// fetching or styling along with it.
// ---------------------------------------------------------------------------

interface TimeGridProps {
  events?: EventSourceInput;
  renderEventContent: any;
  eventClass?: ClassNameGenerator<EventDisplayInfo>;
  onDatesSet?: (arg: DateSelectInfo) => void;
  onEventClick?: (info: EventClickInfo) => void;
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
  // Schedule bounds — caller computes these from whatever settings are
  // relevant to it (school hours, room availability, exam windows...).
  businessHours?: BusinessHoursInput;
  slotMinTime?: string;
  slotMaxTime?: string;
  slotDuration?: string;
  eventConstraint?: ConstraintInput;
}

const TimeGrid = forwardRef<any, TimeGridProps>(
  (
    {
      events,
      renderEventContent,
      eventClass,
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
      businessHours,
      slotMinTime = '08:00:00',
      slotMaxTime = '18:00:00',
      slotDuration = '00:60:00',
      eventConstraint,
    },
    ref,
  ) => {
    const [currentDateTitle, setCurrentDateTitle] = useState('');
    const [currentView, setCurrentView] = useState<ViewType>(
      initialView || 'resourceTimelineWeek',
    );
    const calendarRef = useRef<CalendarRef | null>(null);

    // Keep the latest onViewChange without forcing every navigation
    // callback to be redefined (and re-passed to children) whenever the
    // parent's callback identity changes.
    const onViewChangeRef = useRef(onViewChange);
    onViewChangeRef.current = onViewChange;

    useImperativeHandle(ref, () => calendarRef.current);

    const handlePrev = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.prev();
        setCurrentView(api.view.type as ViewType);
        onViewChangeRef.current?.(api.view.type as ViewType);
      }
    }, []);

    const handleViewChange = useCallback((view: string) => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.changeView(view);
        setCurrentView(api.view.type as ViewType);
        onViewChangeRef.current?.(api.view.type as ViewType);
      }
    }, []);

    const handleNext = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.next();
        setCurrentView(api.view.type as ViewType);
        onViewChangeRef.current?.(api.view.type as ViewType);
      }
    }, []);

    const handleToday = useCallback(() => {
      const api = calendarRef.current?.getApi();
      if (api) {
        api.today();
        setCurrentView(api.view.type as ViewType);
        onViewChangeRef.current?.(api.view.type as ViewType);
      }
    }, []);

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
            // Fixed: previously always showed today's month/year regardless
            // of navigation. This now reflects the calendar's actual
            // current view, updated via datesSet below.
            currentDateTitle={currentDateTitle}
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
            resourceCellContent={renderResourceContent}
            locale={frLocale}
            resources={resources}
            eventContent={renderEventContent}
            eventClass={eventClass}
            events={events}
            height="auto"
            eventDragStart={onEventDragStart}
            slotMinTime={slotMinTime}
            slotMaxTime={slotMaxTime}
            eventDragMinDistance={5}
            eventResizableFromStart
            eventDurationEditable
            eventStartEditable={true}
            selectLongPressDelay={300}
            headerToolbar={false}
            businessHours={businessHours}
            selectOverlap={false}
            eventConstraint={eventConstraint}
            resourceColumnsWidth={'15%'}
            weekends={false}
            allDaySlot={false}
            nowIndicator
            slotDuration={slotDuration}
            firstDay={1}
            slotMinWidth={120}
            slotMinHeight={150}
            lazyFetching
            editable={editable}
            selectable={selectable}
            selectMirror
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
