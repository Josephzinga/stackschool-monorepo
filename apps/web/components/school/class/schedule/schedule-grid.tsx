'use client';
import React, { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import '@/app/styles/schedule-grid.css';
import TimeGrid from '@/components/school/time-grid';
import {
  Day,
  Lesson,
  LessonStatus,
  ResourceMode,
  useGetSchoolLessonsQuery,
  useUpdateLessonMutation,
} from '@stackschool/ui';
import { useWindowSize } from 'react-use';
import { lessonStatusConfig } from '@/constant';
import { dayMapping } from '@stackschool/shared';
import { Badge } from '@/components/ui/badge';
import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from '@fullcalendar/core';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { InitialLessonData } from '@/components/school/lesson/lesson-form';
import { ScheduleDialog } from '@/components/school/class/schedule/schedule-dialog';

const ClassScheduleGrid = ({ classId }: { classId?: string }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState('timeGridWeek');
  const [currentDateTitle, setCurrentDateTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedLessonData, setSelectedLessonData] =
    useState<InitialLessonData>();
  const { width } = useWindowSize();
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();

  const { data, isError, isPending, error } = useGetSchoolLessonsQuery(
    {
      filter: {
        classId,
        mode: ResourceMode.Class,
      },
    },
    {
      enabled: !!classId,
    },
  );
  const { mutateAsync } = useUpdateLessonMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getClassLessons'] });
    },
  });

  const events: EventInput[] = useMemo(() => {
    if (!data?.getLessons?.data.events) return [];
    return (
      data?.getLessons?.data?.events?.map((e) => ({
        id: e.id,
        title: e?.title,
        startTime: format(new Date(e.startTime), 'HH:mm'),
        endTime: format(new Date(e.endTime), 'HH:mm'),
        daysOfWeek: [dayMapping[e.day as Day]],
        extendedProps: {
          subject: e.subject,
          status: e.status,
          teacher: e.teacher,
          group: e?.group,
          mode: 'CLASS',
          lessonId: e.id,
          groupName:
            e.group?.type === 'SOLO' ? e.group.classes[0]?.name : e.group?.name,
        },
      })) || []
    );
  }, [data?.getLessons?.data?.events, isPending]);
  console.log('events', events);
  const handleEventDrop = async (info: EventDropArg) => {
    const start = info.event.start;
    const end = info.event.end;
    if (!start || !end) return;
    await updateLesson({
      id: info.event.id,
      endTime: end,
      startTime: start,
      day: info.event.extendedProps.day,
    });
  };

  const handleEventClick = (args: EventClickArg) => {
    setSelectedLessonData({ mode: 'UPDATE', args });
    setOpen(true);
  };

  const handleSelect = async (args: DateSelectArg) => {
    setSelectedLessonData({ mode: 'CREATE', args });
    setOpen(true);
  };

  async function updateLesson({
    id,
    targetStatus,
    startTime,
    endTime,
    day,
  }: {
    id: string;
    targetStatus?: LessonStatus;
    startTime?: Date;
    endTime?: Date;
    day?: Day;
  }) {
    const promise = mutateAsync({
      input: {
        lessonId: id,
        targetStatus,
        startTime,
        endTime,
        classId: classId!,
        day,
      },
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours...',
      success: 'Mise à jour réussi avec succès',
      error: (err) => {
        return err?.message || 'Erreur lors de la mise à jour';
      },
      toasterId: 'dashboard',
    });
  }

  return (
    <div className="p-1 flex flex-col gap-4">
      <TimeGrid
        editable={true}
        selectable={true}
        ref={calendarRef}
        events={events}
        renderEventContent={renderEventContent}
        onEventClick={handleEventClick}
        onDatesSet={(value) => setCurrentDateTitle(value.view.title)}
        onEventDrop={handleEventDrop}
        onEventSelect={handleSelect}
        hideResourceViewButtons={true}
      />

      <ScheduleDialog
        initialData={selectedLessonData}
        onOpenChange={setOpen}
        open={open}
        classId={classId}
      />
    </div>
  );
};

export default ClassScheduleGrid;
const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;

  return (
    <div className="flex flex-col h-full overflow-hidden p-1 leading-tight">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs md:text-sm truncate">
          {eventInfo.event.extendedProps.subject?.name}
        </span>

        {/* Badge status */}
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold px-2 py-0.5  ${cfg.badgeClass}`}
        >
          {cfg.label}
        </Badge>
      </div>

      <div className="text-[10px] opacity-80 truncate uppercase">
        {eventInfo.event.extendedProps.teacher?.lastname}
      </div>

      <div className="mt-auto text-sm text-gray-800 font-mono">
        {eventInfo.timeText}
      </div>
    </div>
  );
};
