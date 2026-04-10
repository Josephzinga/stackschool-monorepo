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

export const useLessonEvents = () => {
  const calendarRef = useRef<FullCalendar | null>(null);

  const {
    setCurrentView,
    setTargetEventDrop,
    setAlertOpen,
    setLessonDialogOpen,
    setSelectedLessonData,
    currentView,
    setResourceMode,
    resourceMode,
    setSelectedFilter,
  } = useLessonStore();
  const { events } = useLessonCalendar();

  const updateMutate = useUpdateLessonMutation();
  const createMutate = useCreateLessonMutation();
  const handleCalendarMount = useCallback((calendar: any) => {
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
      const relevantEvents = events.filter(
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

      setSelectedLessonData({ mode: 'CREATE', args });
      setLessonDialogOpen(true);
    },
    [setSelectedLessonData, setLessonDialogOpen],
  );

  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const { event, oldEvent, revert } = info;
      const newStart = event.start;
      const newEnd = event.end;

      if (!newStart || !newEnd) return;

      // Vérifier les conflits avec la date réelle
      const hasConflict = checkConflicts(
        event.id,
        newStart,
        newEnd,
        info?.event?.getResources()?.[0]?.id,
      );

      if (hasConflict) {
        revert(); // Annuler le déplacement visuel
        toast.error('Ce créneau est déjà occupé par un autre cours');
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
        originalStart: format(oldEvent.start!, 'HH:mm'),
        originalEnd: format(oldEvent.end!, 'HH:mm'),
        originalDay: oldDay,
        revertFunc: () => revert(),
      });
      setAlertOpen(true);
    },
    [checkConflicts, setTargetEventDrop, setAlertOpen],
  );

  // Handler pour le resize

  // Handler pour le resize
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

      // Vérifier les conflits
      const hasConflict = checkConflicts(
        event.id,
        newStart,
        newEnd,
        event.getResources()[0]?.id,
      );

      if (hasConflict) {
        revert();
        toast.error('Ce créneau est déjà occupé par un autre cours');
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

  // Handler pour annuler la mise à jour
  const handleCancelUpdate = () => {
    // Revert les changements dans le calendrier
    console.log('handleCancelUpdate', handleCancelUpdate);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.refetchEvents(); // Rafraîchir pour revenir à l'état original
    setTargetEventDrop(null);
    console.log('handleCancelUpdate', calendarApi);
    setAlertOpen(false);
  };

  return {
    calendarRef,
    handleCalendarMount,
    handleEventClick,
    handleEventSelect,
    handleEventDrop,
    handleEventResize,
    updateMutate,
    createMutate,
    handleCancelUpdate,
  };
};
