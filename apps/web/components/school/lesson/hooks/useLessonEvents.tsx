'use client';
import { useCallback, useRef } from 'react';
import { useLessonStore } from '@/store/lesson-store';
import {
  Day,
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from '@stackschool/ui';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { format, getDay } from 'date-fns';
import { dayMapping } from '@stackschool/shared';
import { toast } from 'sonner';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { checkEventConflicts } from '@/lib/lesson-calendar';
import { useLessonCalendar } from '@/components/school/lesson/hooks/useLessonCalendar';
import { Event } from '@/types/lessons-types';

export const useLessonEvents = () => {
  const calendarRef = useRef<FullCalendar | null>(null);

  const {
    setTargetEventDrop,
    setAlertOpen,
    setLessonDialogOpen,
    setSelectedLessonData,
    resource,
    setResource,
    selectedFilter,
  } = useLessonStore();
  const { events, resources } = useLessonCalendar();

  const updateMutate = useUpdateLessonMutation();
  const createMutate = useCreateLessonMutation();

  const handleCalendarMount = useCallback((calendar: FullCalendar) => {
    calendarRef.current = calendar;
  }, []);

  const checkConflicts = useCallback(
    (
      eventId: string,
      newStart: Date,
      newEnd: Date,
      resourceId?: string,
    ): boolean => {
      // Créer un objet événement pour la comparaison
      const newEvent = {
        id: eventId,
        resourceId: resourceId,
        daysOfWeek: [getDay(newStart)],
        startTime: format(newStart, 'HH:mm'),
        endTime: format(newEnd, 'HH:mm'),
      };

      // Filtrer les événements existants par ressource
      const relevantEvents: Event[] = events.filter(
        (event) => event.resourceId === resourceId,
      );

      // Vérifier les conflits
      return checkEventConflicts(newEvent, relevantEvents, eventId, newStart);
    },
    [events],
  );

  // Handler pour le clic sur un événement
  const handleEventClick = useCallback(
    (args: EventClickArg) => {
      setSelectedLessonData({ mode: 'UPDATE', args });
      setLessonDialogOpen(true);
    },
    [setSelectedLessonData, setLessonDialogOpen],
  );

  // Handler pour la sélection (création)
  const handleEventSelect = useCallback(
    (args: DateSelectArg) => {
      if (args.resource && !args.resource.id) {
        toast.error('Veuillez sélectionner une ressource');
        return;
      }
      if (
        !args.resource &&
        resources &&
        resources[0]?.id === selectedFilter?.id
      ) {
        setResource({ id: selectedFilter?.id, title: resources[0].title });
      }

      setSelectedLessonData({ mode: 'CREATE', args });
      setLessonDialogOpen(true);
    },
    [
      setSelectedLessonData,
      setLessonDialogOpen,
      selectedFilter,
      setResource,
      resources,
    ],
  );

  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const { event, oldEvent, revert } = info;
      const newStart = event.start;
      const newEnd = event.end;

      if (!newStart || !newEnd) return;
      const resourceId = event.getResources()?.[0]?.id || resource.id;
      const subjectId = event.extendedProps?.subject?.id;
      // Vérifier les conflits avec la date réelle
      const hasConflict = checkConflicts(
        event.id,
        newStart,
        newEnd,
        info?.event?.getResources()?.[0]?.id,
      );

      if (hasConflict) {
        revert();
        toast.error('Ce créneau est déjà occupé par un autre cours', {
          toasterId: 'dashboard',
        });
        return;
      }

      // Si pas de conflit, ouvrir la confirmation
      const newDay = Object.keys(dayMapping).find(
        (key) => dayMapping[key as Day] === getDay(newStart),
      ) as Day;

      const oldDay = Object.keys(dayMapping).find(
        (key) => dayMapping[key as Day] === getDay(oldEvent.start!),
      ) as Day;

      setTargetEventDrop({
        id: event.id,
        start: format(newStart, 'HH:mm'),
        end: format(newEnd, 'HH:mm'),
        day: newDay,
        resourceId,
        subjectId,
        originalStart: format(oldEvent.start!, 'HH:mm'),
        originalEnd: format(oldEvent.end!, 'HH:mm'),
        originalDay: oldDay,
        revertFunc: () => revert(),
      });
      setAlertOpen(true);
    },
    [checkConflicts, setTargetEventDrop, setAlertOpen],
  );

  const handleEventResize = useCallback(
    (info: EventResizeDoneArg) => {
      const { event, oldEvent, revert } = info;
      const newStart = event.start;
      const newEnd = event.end;

      if (!newStart || !newEnd) return;

      // Vérifier la durée minimale
      const duration = (newEnd.getTime() - newStart.getTime()) / (1000 * 60);
      if (duration < 30) {
        revert();
        toast.error("La durée minimum d'un cours est de 30 minutes");
        return;
      }
      const resourceId = event.getResources()?.[0]?.id;
      const subjectId = event.extendedProps?.subject?.id;
      // Vérifier les conflits
      const hasConflict = checkConflicts(
        event.id,
        newStart,
        newEnd,
        resourceId,
      );

      if (hasConflict) {
        revert();
        toast.error('Ce créneau est déjà occupé par un autre cours', {
          toasterId: 'dashboard',
        });
        return;
      }

      // Si pas de conflit, ouvrir la confirmation
      const newDay = Object.keys(dayMapping).find(
        (key) => dayMapping[key as Day] === getDay(newStart),
      ) as Day;

      setTargetEventDrop({
        id: event.id,
        start: format(newStart, 'HH:mm'),
        end: format(newEnd, 'HH:mm'),
        day: newDay,
        resourceId,
        subjectId,
        originalStart: format(oldEvent.start!, 'HH:mm'),
        originalEnd: format(oldEvent.end!, 'HH:mm'),
        originalDay: Object.keys(dayMapping).find(
          (key) => dayMapping[key as Day] === getDay(oldEvent.start!),
        ) as Day,
        revertFunc: () => revert(),
      });
      setAlertOpen(true);
    },
    [checkConflicts, setTargetEventDrop, setAlertOpen],
  );

  return {
    calendarRef,
    handleCalendarMount,
    handleEventClick,
    handleEventSelect,
    handleEventDrop,
    handleEventResize,
    updateMutate,
    createMutate,
  };
};
