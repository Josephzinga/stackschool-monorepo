'use client';

import React, { useMemo, useRef, useState } from 'react';
import '@/app/styles/schedule-grid.css';
import {
  Day,
  LessonStatus,
  useCreateLessonMutation,
  useGetNavigationDataQuery,
  useGetSchoolLessonsQuery,
} from '@stackschool/ui';
import TimeGrid from '@/components/school/time-grid';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { format, getDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayMapping, lessonStatusConfig } from '@/constant';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { cn } from '@/lib/utils';
import FullCalendar from '@fullcalendar/react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { useQueryClient } from '@tanstack/react-query';
import LessonDialog, {
  InitialData,
} from '@/components/school/lesson/lesson-dialog';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function LessonsListPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [targetEventDrop, setTargetEventDrop] = useState<{
    start: string;
    end: string;
    day: Day;
  } | null>(null);
  const [view, setView] = useState('');
  const [globalView, setGlobalView] = useState('resourceTimeLine');
  const [selectedData, setSelectedData] = useState<InitialData>();
  const [resourceMode, setResourceMode] = useState<'CLASS' | 'TEACHER'>(
    'CLASS',
  );
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'CLASS' | 'TEACHER';
    id: string;
  } | null>(null);

  // requête principale de recupération de toutes les leçons
  const { data: lessonsData } = useGetSchoolLessonsQuery({
    filter: {
      classId:
        selectedFilter?.type === 'CLASS' ? selectedFilter?.id : undefined,
      teacherId:
        selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
      limit: 10,
    },
  });

  const { data } = useGetNavigationDataQuery();
  const { mutateAsync } = useCreateLessonMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
    },
  });

  const teacherData = data?.getClassTeacher?.teacher;
  const classData = data?.getClassTeacher?.class;

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
    handleViewChange('timeGridDay');
    calendarApi?.today();
  };
  const handleResourceToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    handleViewChange('resourceTimelineDay');
    calendarApi?.today();
  };

  const events = useMemo(
    () =>
      lessonsData?.getLessons?.data?.map((lesson) => ({
        id: lesson?.id,
        resourceId:
          resourceMode === 'CLASS'
            ? (lesson?.classSubject?.group?.id ?? undefined)
            : (lesson.classSubject?.teacher?.id ?? undefined),
        title: lesson?.classSubject?.subject?.name,
        startTime: format(lesson?.startTime, 'HH:mm'),
        endTime: format(lesson?.endTime, 'HH:mm'),
        daysOfWeek: [dayMapping[lesson?.day!]], // il renvoie [1 , 2, 4]
        extendedProps: {
          subject: lesson?.classSubject?.subject,
          teacher: lesson?.classSubject?.teacher,
          lessonId: lesson?.id,
          groupName:
            lesson?.classSubject?.group?.type === 'SOLO'
              ? lesson?.classSubject?.group?.classes[0].name
              : lesson?.classSubject?.group?.name,
          groupId: lesson?.classSubject?.group?.id,
          status: lesson?.status,
          day: lesson?.day,
          mode: resourceMode,
        },
      })) || [],
    [lessonsData, resourceMode, selectedFilter],
  );
  const resources = useMemo(() => {
    if (resourceMode === 'CLASS') {
      return (
        lessonsData?.getLessons?.data?.map((lesson) => ({
          id: lesson?.classSubject?.group?.id ?? undefined,
          title:
            lesson?.classSubject?.group?.type === 'SOLO'
              ? lesson?.classSubject?.group?.classes[0]?.name
              : lesson?.classSubject?.group?.name,
        })) || []
      );
    } else {
      return (
        lessonsData?.getLessons?.data?.map((lesson) => ({
          id: lesson?.classSubject?.teacher?.id ?? undefined,
          title: `${lesson?.classSubject?.teacher?.user?.profile?.firstname} ${lesson?.classSubject?.teacher?.user?.profile?.lastname}`,
        })) || []
      );
    }
  }, [lessonsData, selectedFilter, resourceMode]);

  const handleEventClick = (args: EventClickArg) => {
    setSelectedData({ mode: 'UPDATE', args });
    setOpen(true);
  };

  const handleEventSelect = (args: DateSelectArg) => {
    setSelectedData({ mode: 'CREATE', args });
    setOpen(true);
  };
  const handleEventDrop = async (info: EventDropArg) => {
    console.log('Event drop', info);

    const start = info.event.start
      ? format(info.event.start, 'HH:mm')
      : undefined;
    const end = info.event.end ? format(info.event.end, 'HH:mm') : undefined;
    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(info.event.start!),
    );
    setTargetEventDrop({
      start: start ?? '',
      end: end ?? '',
      day: day! as Day,
    });
    setAlertOpen(true);
    console.log('Start', start, '\t end', end, '\t day', day);
  };

  const handleResize = (info: EventResizeDoneArg) => {
    console.log('Resieze info', info);
    const start = info.event.start
      ? format(info.event.start, 'HH:mm')
      : undefined;
    const end = info.event.end ? format(info.event.end, 'HH:mm') : undefined;
    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(info.event.start!),
    );
    setTargetEventDrop({ start: start!, end: end!, day: day! as Day });
    setAlertOpen(true);
    console.log('Start', start, '\t end', end, '\t day', day);
  };

  return (
    <div className="flex-1 flex justify-centerpx-2 py-4 sm:px-4 md:px-6">
      <Card className=" flex flex-col gap-4 w-full">
        <CardHeader className="px-1">
          <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2">
            <div className="flex gap-8">
              <Button
                variant="outline"
                onClick={handleResourceToday}
                className="font-medium"
              >
                Aujourd'hui
              </Button>
              <ButtonGroup className="">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="h-8 w-10 rounded-r-none border-r"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-10 rounded-l-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </ButtonGroup>
              <Combobox
                items={teacherData!}
                itemToStringValue={(itemValue: any) =>
                  itemValue?.user?.profile?.lastname
                }
                onValueChange={(name) => {
                  const id = teacherData?.find(
                    (t) => t?.user?.profile?.lastname === name,
                  )?.id;
                  if (id) setSelectedFilter({ type: 'TEACHER', id });
                }}
              >
                <ComboboxInput
                  showClear
                  onClear={() => setSelectedFilter({ type: 'TEACHER', id: '' })}
                  placeholder="Sélectionner un professeur"
                />
                <ComboboxContent>
                  <ComboboxEmpty>Aucun résultat trouver</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem
                        key={item?.id}
                        value={item?.user?.profile?.lastname}
                      >
                        {item?.user?.profile?.lastname}{' '}
                        {item?.user?.profile?.firstname}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <Combobox
                items={classData!}
                onValueChange={(value) => {
                  const classId = classData?.find((c) => c?.name === value)?.id;
                  if (classId)
                    setSelectedFilter({ type: 'CLASS', id: classId });
                }}
                itemToStringValue={(itemValue: any) => itemValue?.name}
              >
                <ComboboxInput
                  onClear={() => setSelectedFilter({ type: 'CLASS', id: '' })}
                  showClear
                  placeholder="Selectionner une classe"
                />
                <ComboboxContent>
                  <ComboboxEmpty>Aucun résultat trouver</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item?.id} value={item?.name}>
                        {item?.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <ButtonGroup className="flex justify-self-end">
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
          </div>
          <div>
            <ButtonGroup>
              <Button
                variant={resourceMode === 'CLASS' ? 'secondary' : 'outline'}
                onClick={() => setResourceMode('CLASS')}
              >
                Classes
              </Button>
              <ButtonGroupSeparator orientation="vertical" />
              <Button
                variant={resourceMode === 'TEACHER' ? 'secondary' : 'outline'}
                onClick={() => setResourceMode('TEACHER')}
                className="font-medium font-sans dark:text-white"
              >
                Enseignent
              </Button>
            </ButtonGroup>
          </div>
        </CardHeader>
        <CardContent className="px-1">
          <TimeGrid
            editable={true}
            initialView="resourceTimelineWeek"
            onEventSelect={handleEventSelect}
            calendarRef={calendarRef}
            onEventClick={handleEventClick}
            resourceHeaderContent={
              resourceMode === 'CLASS' ? 'Classes' : 'Enseignent'
            }
            slotLabelFormat={[
              { weekday: 'long', day: 'numeric', month: 'long' }, // Ligne du haut : "Lundi 23 Mars"
              { hour: '2-digit', minute: '2-digit', hour12: false }, // Ligne du bas : "08:00"
            ]}
            events={events}
            resources={resources}
            onEventDrop={handleEventDrop}
            renderEventContent={renderEventContent}
            onEventResize={handleResize}
            selectable={true}
          />
        </CardContent>
      </Card>
      <LessonDialog
        key={
          (selectedData?.mode === 'UPDATE'
            ? selectedData?.args.event.start?.toString()
            : selectedData?.args.start.toString()) || 'new'
        }
        open={open}
        onOpenChange={setOpen}
        initialData={selectedData}
        resourceMode={resourceMode}
      />

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-70!">
          <AlertDialogHeader>
            <AlertDialogTitle>Ete-vous sur ?</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-1">
            <p>
              Debut: <span>{targetEventDrop?.start}</span>
            </p>
            <p>
              Fin: <span>{targetEventDrop?.end}</span>
            </p>
            <p>
              Jour: <span>{targetEventDrop?.day}</span>
            </p>
            <p>
              Durée :{' '}
              <span>
                {new Date(targetEventDrop?.end!).getHours() -
                  new Date(targetEventDrop?.start!).getHours()}
              </span>
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Confirmer</AlertDialogAction>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LessonsListPage;

const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
  const profile = eventInfo.event.extendedProps.teacher?.user?.profile;
  const mode = eventInfo.event.extendedProps?.mode;
  const className = eventInfo.event.extendedProps.groupName;

  return (
    <div className="flex flex-col h-full overflow-hidden gap-2 leading-tight">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs truncate">
          {eventInfo.event.extendedProps.subject?.name}
        </span>

        {/* Badge status */}
      </div>

      <div
        className={cn(
          'text-[10px] opacity-80 font-medium truncate',
          mode === 'TEACHER' && 'uppercase text-xs',
        )}
      >
        {mode === 'TEACHER'
          ? className
          : `${profile?.firstname}  ${profile?.lastname}`}
      </div>

      <div className="mt-auto text-sm text-gray-800 font-mono">
        {eventInfo.timeText}
      </div>

      <div className="w-full flex justify-end-safe px-1">
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold font-inter px-1  ${cfg.badgeClass}`}
        >
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
};
