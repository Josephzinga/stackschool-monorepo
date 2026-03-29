import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import frLocale from '@fullcalendar/core/locales/fr';
import React, { useState } from 'react';
import {
  CustomContentGenerator,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventSourceInput,
  FormatterInput,
} from '@fullcalendar/core';
import '@/app/styles/schedule-grid.css';
import { useGetSchoolSettingsQuery, useUserStore } from '@stackschool/ui';
import { Card } from '@/components/ui/card';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoaderFour } from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { dayMapping } from '@/constant';
import { ResourceSourceInput } from '@fullcalendar/resource';

interface TimeGridProps {
  calendarRef?: React.Ref<FullCalendar>;
  events?: EventSourceInput;
  renderEventContent: CustomContentGenerator<EventContentArg>;
  onDatesSet?: (arg: DatesSetArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  selectable: boolean;
  editable: boolean;
  onEventDrop?: (info: EventDropArg) => void;
  onEventSelect?: (info: DateSelectArg) => void;
  initialView?: string;
  resources?: ResourceSourceInput;
  resourceHeaderContent?: string;
  slotLabelFormat?: FormatterInput | FormatterInput[];
  onEventResize?: (arg: EventResizeDoneArg) => void;
}

export default function TimeGrid({
  events,
  renderEventContent,
  onDatesSet,
  onEventClick,
  editable = false,
  selectable = false,
  onEventDrop,
  onEventSelect,
  calendarRef,
  initialView = 'timeGridWeek',
  resources,
  resourceHeaderContent,
  slotLabelFormat,
  onEventResize,
}: TimeGridProps) {
  const [currentDateTitle, setCurrentDateTitle] = useState('');
  const { currentSchool } = useUserStore();
  const { data, isPending } = useGetSchoolSettingsQuery(
    {
      schoolId: currentSchool?.id!,
    },
    { enabled: !!currentSchool?.id },
  );
  const startHour = data?.school.settings?.startHour || '08';
  const endHour = data?.school.settings?.endHour || '16';
  const duration = data?.school.settings?.lessonDuration || '50';
  const daysOfWeek = data?.school.settings?.daysOfWeek?.map(
    (day) => dayMapping[day!],
  ) || [1, 2, 3, 4, 5];

  if (isPending) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoaderFour text="Chargement de parametre en cours..." />
      </div>
    );
  }

  return (
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
        events={events}
        height="auto"
        slotMinTime={`${startHour}:00:00`}
        slotMaxTime={`${endHour}:00:00`}
        slotLabelFormat={slotLabelFormat}
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
        resourceAreaWidth={'15%'}
        weekends={false}
        allDaySlot={false}
        nowIndicator={true}
        firstDay={1}
        slotMinWidth={100}
        resourceAreaHeaderContent={resourceHeaderContent}
        editable={editable}
        selectable={selectable}
        eventResizableFromStart={true}
        datesSet={(info) => setCurrentDateTitle(info.view.title)}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
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
  );
}
export function TimeGridHeader({
  handleToday,
  handlePrev,
  handleNext,
  view,
  handleViewChange,
  title,
}: {
  handleToday?: () => void;
  handlePrev?: () => void;
  handleNext?: () => void;
  title?: string;
  handleViewChange: (view: string) => void;
  view: string;
}) {
  return (
    <Card className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2 rounded-lg border">
      {/* Navigation Gauche : Aujourd'hui + Précédent/Suivant */}
      <ButtonGroup className="">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="font-medium"
        >
          Aujourd'hui
        </Button>
        <ButtonGroup className="">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-8 w-8 rounded-r-none border-r"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8 rounded-l-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      {/* Titre Central (Date) */}
      <h2 className="text-lg font-semibold capitalize min-w-50 text-center">
        {title}
      </h2>

      {/* Navigation Droite : Vue Jour/Semaine */}
      <ButtonGroup className="">
        <Button
          onClick={() => handleViewChange('timeGridDay')}
          variant={view === 'timeGridDay' ? 'default' : 'outline'}
          className={cn()}
        >
          Jour
        </Button>
        <ButtonGroupSeparator orientation="vertical" />
        <Button
          onClick={() => handleViewChange('timeGridWeek')}
          variant={view === 'timeGridWeek' ? 'default' : 'outline'}
        >
          Semaine
        </Button>
      </ButtonGroup>
    </Card>
  );
}
