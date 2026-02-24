import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { GetTeacherDetailsQuery } from '@stackschool/ui';
import '@/app/styles/schedule-grid.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

type OnlyLessons = Pick<
  NonNullable<GetTeacherDetailsQuery['teacher']>,
  'lessons'
>;

const TimeGrid = ({ lessons }: OnlyLessons) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState('timeGridWeek');
  const [currentDateTitle, setCurrentDateTitle] = useState('');

  const events = lessons?.map((lesson) => ({
    id: lesson?.id,
    title: `${lesson?.class?.name} - ${lesson?.subject?.name}`,
    start: lesson?.startTime,
    end: lesson?.endTime,
    extendedProps: {
      className: lesson?.class?.name,
      subject: lesson?.subject?.name,
    },
  }));

  const handleViewChange = (newView: string) => {
    setView(newView);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
    }
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="fc-event-main-frame px-1 lg:px-2 w-full!">
        <div className="fc-event-title font-semibold">
          <p className="font-jost text-xs ">
            {eventInfo.event.extendedProps.className}
          </p>
          <p className="text-accent text-xs">
            {eventInfo.event.extendedProps.subject}
          </p>
        </div>
        <div className="fc-event-time text-xs text-gray-600">
          {eventInfo.timeText}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Barre d'outils personnalisée */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-2 rounded-lg border">
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
          {currentDateTitle}
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

      {/* Calendrier FullCalendar */}
      <div className="h-full w-full rounded-lg border bg-card overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'timeGridWeek'}
          locale={frLocale}
          headerToolbar={false} // On désactive la toolbar par défaut
          eventContent={renderEventContent}
          events={events}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotLabelClassNames="text-muted-foreground text-sm font-medium"
          dayHeaderClassNames="text-foreground font-semibold py-2 border-none"
          weekends={false}
          allDaySlot={false}
          nowIndicator={true}
          editable={false}
          selectable={false}
          datesSet={(dateInfo) => {
            setCurrentDateTitle(dateInfo.view.title);
          }}
          eventClick={(info) => {
            console.log('Cours cliqué :', info.event);
          }}
        />
      </div>
    </div>
  );
};

export default TimeGrid;
