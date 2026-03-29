'use client';
import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { LessonStatus, useGetTeacherScheduleQuery } from '@stackschool/ui';
import '@/app/styles/schedule-grid.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import TimeGrid from '@/components/school/time-grid';
import { format } from 'date-fns';
import { dayMapping, lessonStatusConfig } from '@/constant';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';

const TeacherScheduleGrid = ({ id }: { id: string }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState('timeGridWeek');
  const [currentDateTitle, setCurrentDateTitle] = useState('');

  const { data, isPending, isError } = useGetTeacherScheduleQuery(
    {
      id,
    },
    { enabled: !!id },
  );

  const events =
    data?.teacher?.classSubjects?.flatMap((cs) => {
      // On récupère le nom de la matière et des classes liées
      const subjectName = cs?.subject?.name;
      const className =
        cs?.group?.type === 'SOLO'
          ? cs.group?.classes[0]?.name
          : cs?.group?.name;

      return (
        cs?.lessons?.map((lesson) => ({
          id: lesson.id,
          title: `${subjectName} (${className})`,
          startTime: format(lesson.startTime, 'HH:mm'),
          endTime: format(lesson.endTime, 'HH:mm'),
          daysOfWeek: [dayMapping[lesson?.day!]],

          extendedProps: {
            status: lesson.status,
            className,
            subjectId: cs?.subject?.id,
            subjectName: cs?.subject?.name,
          },
        })) || []
      );
    }) || [];

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
    const status = eventInfo.event.extendedProps.status as LessonStatus;
    const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
    const className = eventInfo.event.extendedProps.className;

    return (
      <div className="flex flex-col h-full overflow-hidden p-1 leading-tight">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-xs md:text-sm truncate">
            {eventInfo.event.extendedProps.subjectName}
          </span>

          {/* Badge status */}
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold px-1  ${cfg.badgeClass}`}
          >
            {cfg.label}
          </Badge>
        </div>

        <div
          className={cn(
            'text-[10px] mt-2 opacity-80 font-medium truncate uppercase',
          )}
        >
          {className}
        </div>

        <div className="mt-auto text-sm text-gray-800 font-mono">
          {eventInfo.timeText}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-2 rounded-lg border">
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

      {isPending ? (
        <Loader />
      ) : (
        <TimeGrid
          selectable={false}
          editable={false}
          events={events}
          initialView="dayGridWeek"
          renderEventContent={renderEventContent}
          calendarRef={calendarRef}
          onDatesSet={(arg) => setCurrentDateTitle(arg.view.title)}
        />
      )}
    </div>
  );
};

export default TeacherScheduleGrid;
