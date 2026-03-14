'use client';

import React, { useRef, useState } from 'react';
import '@/app/styles/schedule-grid.css';
import {
  LessonStatus,
  useGetNavigationDataQuery,
  useGetSchoolLessonsQuery,
} from '@stackschool/ui';
import TimeGrid from '@/components/school/time-grid';
import { Field, FieldLabel } from '@/components/ui/field';
import { DateSelectArg } from '@fullcalendar/core';
import { TimeInput } from '@/components/time-input';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, getDay } from 'date-fns';
import { GridForm } from '@/components/school/grid-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const createLessonSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  day: z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ]),
  teacherId: z.string(),
});
type CreateLessonForm = z.infer<typeof createLessonSchema>;

function LessonsListPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'CLASS' | 'TEACHER';
    id: string;
  } | null>(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateLessonForm>({
    resolver: zodResolver(createLessonSchema),
  });

  const { data: lessonsData } = useGetSchoolLessonsQuery(
    {
      classId:
        selectedFilter?.type === 'CLASS' ? selectedFilter?.id : undefined,
      teacherId:
        selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
    },
    {
      enabled: !!selectedFilter,
    },
  );

  const { data } = useGetNavigationDataQuery();
  const teacherData = data?.getClassTeacher?.teacher;
  const classData = data?.getClassTeacher?.class;
  const searchTerm = search.trim().toLowerCase();

  const handleDialogOpen = (args: DateSelectArg) => {
    setSelectedDate(args);
    setValue('startTime', format(args.start, 'HH:mm'));
    setValue('endTime', format(args.end, 'HH:mm'));
    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key] === getDay(args.start),
    );
    setValue('day', day as CreateLessonForm['day']);

    setOpen(true);
  };
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
  console.log('lessonsData', lessonsData);
  console.log('SelectedFilter', selectedFilter);

  const events = lessonsData?.getLessons?.map((lesson) => ({
    id: lesson?.id,
    title: lesson?.subject?.name,
    startTime: format(lesson?.startTime, 'HH:mm'),
    endTime: format(lesson?.endTime, 'HH:mm'),
    daysOfWeek: [dayMapping[lesson?.day!]],
    extendedProps: {
      subject: lesson?.subject?.name,
      teacher: lesson?.teacher,
      status: lesson?.status,
      day: lesson?.day,
      lesson: lesson,
      type: selectedFilter?.type,
    },
  }));
  return (
    <div className="flex-1 flex justify-centerpx-2 py-4 sm:px-4 md:px-6">
      <Card className=" flex flex-col gap-4 w-full">
        <CardHeader className="px-1">
          <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2">
            <div className="flex gap-8">
              <Button
                variant="outline"
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
                items={teacherData}
                itemToStringValue={(itemValue) =>
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
                  placeholder="Sélectionner un professeur"
                  showClear
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
                itemToStringValue={(itemValue) => itemValue?.name}
              >
                <ComboboxInput placeholder="Selectionner une classe" />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
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
        </CardHeader>
        <CardContent className="px-1">
          <TimeGrid
            editable={true}
            onEventSelect={handleDialogOpen}
            calendarRef={calendarRef}
            events={events}
            renderEventContent={renderEventContent}
            selectable={true}
          />
        </CardContent>
      </Card>

      <Dialog open={open} modal={false} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crée un leçon</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4 py-4">
            <GridForm className="w-full">
              <Field className="">
                <FieldLabel>Début</FieldLabel>
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field }) => <TimeInput {...field} />}
                />
              </Field>
              <Field>
                <FieldLabel>Fin</FieldLabel>
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field }) => <TimeInput {...field} />}
                />
              </Field>
            </GridForm>

            <GridForm className="w-full">
              <Field>
                <FieldLabel>Jour</FieldLabel>
                <Controller
                  control={control}
                  name="day"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Jour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONDAY">Lundi</SelectItem>
                        <SelectItem value="TUESDAY">Mardi</SelectItem>
                        <SelectItem value="WEDNESDAY">Mercredi</SelectItem>
                        <SelectItem value="THURSDAY">Jeudi</SelectItem>
                        <SelectItem value="FRIDAY">Vendredi</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Selectionner un professeur</FieldLabel>
                <Controller
                  control={control}
                  name="teacherId"
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un professeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {teacherData?.map((t) => (
                          <SelectItem value={t?.id!}>
                            {t?.user?.profile?.lastname}{' '}
                            {t?.user?.profile?.firstname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </GridForm>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LessonsListPage;

const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
  const lastname =
    eventInfo.event.extendedProps.teacher?.user?.profile?.lastname;
  const type = eventInfo.event.extendedProps?.type;
  const className = eventInfo.event.extendedProps.lesson.class.name;

  return (
    <div className="flex flex-col h-full overflow-hidden p-1 leading-tight">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs md:text-sm truncate">
          {eventInfo.event.extendedProps.subject}
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
        {type === 'TEACHER' ? className : lastname}
      </div>

      <div className="mt-auto text-sm text-gray-800 font-mono">
        {eventInfo.timeText}
      </div>
    </div>
  );
};
