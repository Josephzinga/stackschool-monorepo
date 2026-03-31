'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@/app/styles/schedule-grid.css';
import {
  Day,
  LessonStatus,
  useGetNavigationDataQuery,
  useGetSchoolLessonsQuery,
  useUpdateLessonMutation,
} from '@stackschool/ui';
import TimeGrid from '@/components/school/time-grid';
import { format, getDay } from 'date-fns';
import { dayConstant, dayMapping, lessonStatusConfig } from '@/constant';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import FullCalendar from '@fullcalendar/react';
import { Badge } from '@/components/ui/badge';
import { useQueryClient } from '@tanstack/react-query';
import LessonDialog, {
  InitialData,
} from '@/components/school/lesson/lesson-dialog';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { toast } from 'sonner';
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
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { ResourceApi } from '@fullcalendar/resource';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

function LessonsListPage() {
  const [isDragging, setIsDragging] = useState(false);

  const calendarRef = useRef<FullCalendar | null>(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [targetEventDrop, setTargetEventDrop] = useState<{
    id: string;
    start: string;
    end: string;
    day: Day;
    originalStart: string;
    originalEnd: string;
    originalDay: Day;
  } | null>(null);
  const [currentView, setCurrentView] = useState('resourceTimelineWeek');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedData, setSelectedData] = useState<InitialData>();
  const [resourceMode, setResourceMode] = useState<'CLASS' | 'TEACHER'>(
    'CLASS',
  );
  const queryClient = useQueryClient();

  // Filtres principaux
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'CLASS' | 'TEACHER';
    id: string;
  } | null>(null);

  // Filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState({
    level: '', // Pour le mode CLASS
    section: '', // Pour le mode CLASS
    department: '', // Pour le mode TEACHER
  });

  const { data: lessonsData, isPending } = useGetSchoolLessonsQuery({
    filter: {
      classId:
        selectedFilter?.type === 'CLASS' ? selectedFilter?.id : undefined,
      teacherId:
        selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
      level: advancedFilters.level || undefined,
      section: advancedFilters.section || undefined,
      department: advancedFilters.department || undefined,
      limit: 10,
    },
  });

  const { mutateAsync: updateMutate } = useUpdateLessonMutation();
  const { data } = useGetNavigationDataQuery();

  const teacherData = data?.getClassTeacher?.teacher;
  const classData = data?.getClassTeacher?.class;

  // Extraire les niveaux uniques des classes
  const uniqueLevels = useMemo(() => {
    if (!classData) return [];
    const levels = new Map();
    classData.forEach((classItem) => {
      if (classItem?.level && !levels.has(classItem.level)) {
        levels.set(classItem.level, classItem.level);
      }
    });
    return Array.from(levels.values());
  }, [classData]);

  // Extraire les sections uniques des classes
  const uniqueSections = useMemo(() => {
    if (!classData) return [];
    const sections = new Map();
    classData.forEach((classItem) => {
      if (classItem?.section && !sections.has(classItem.section)) {
        sections.set(classItem.section, classItem.section);
      }
    });
    return Array.from(sections.values());
  }, [classData]);

  // Extraire les départements uniques des enseignants
  const uniqueDepartments = useMemo(() => {
    if (!teacherData) return [];
    const departments = new Map();
    teacherData.forEach((teacher) => {
      if (teacher?.department && !departments.has(teacher.department)) {
        departments.set(teacher.department, teacher.department);
      }
    });
    return Array.from(departments.values());
  }, [teacherData]);

  // Réinitialiser les filtres avancés quand on change de mode
  useEffect(() => {
    setAdvancedFilters({
      level: '',
      section: '',
      department: '',
    });
  }, [resourceMode]);

  // Gestionnaires pour les filtres avancés
  const handleLevelChange = (levelId: string) => {
    setAdvancedFilters((prev) => ({ ...prev, level: levelId }));
  };

  const handleSectionChange = (section: string) => {
    setAdvancedFilters((prev) => ({ ...prev, section }));
  };

  const handleDepartmentChange = (department: string) => {
    setAdvancedFilters((prev) => ({ ...prev, department }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      level: '',
      section: '',
      department: '',
    });
  };

  // Vérifier si des filtres avancés sont actifs
  const hasActiveAdvancedFilters = useMemo(() => {
    if (resourceMode === 'CLASS') {
      return !!(advancedFilters.level || advancedFilters.section);
    } else {
      return !!advancedFilters.department;
    }
  }, [resourceMode, advancedFilters]);

  const hasActiveFilters = !!(selectedFilter?.id || hasActiveAdvancedFilters);

  const isResourceView = currentView.startsWith('resource');

  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
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
    if (calendarApi) {
      let todayView: string;
      if (isResourceView) {
        todayView = currentView.includes('Week')
          ? 'resourceTimelineWeek'
          : 'resourceTimelineDay';
      } else {
        todayView = currentView.includes('Week')
          ? 'timeGridWeek'
          : 'timeGridDay';
      }
      handleViewChange(todayView);
      calendarApi.today();
    }
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
        daysOfWeek: [dayMapping[lesson?.day as Day]],
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
    [lessonsData, resourceMode, selectedFilter, advancedFilters],
  );
  const filteredEvents = useMemo(() => {
    if (!isResourceView && selectedFilter?.id) {
      return events.filter((event) => event.resourceId === selectedFilter.id);
    }
    return events;
  }, [events, isResourceView, selectedFilter]);

  const resources = useMemo(() => {
    if (resourceMode === 'CLASS') {
      const uniqueResources = new Map();
      lessonsData?.getLessons?.data?.forEach((lesson) => {
        const id = lesson?.classSubject?.group?.id;
        if (id && !uniqueResources.has(id)) {
          uniqueResources.set(id, {
            id: id,
            title:
              lesson?.classSubject?.group?.type === 'SOLO'
                ? lesson?.classSubject?.group?.classes[0]?.name
                : lesson?.classSubject?.group?.name,
          });
        }
      });
      return Array.from(uniqueResources.values());
    } else {
      const uniqueResources = new Map();
      lessonsData?.getLessons?.data?.forEach((lesson) => {
        const id = lesson?.classSubject?.teacher?.id;
        if (id && !uniqueResources.has(id)) {
          uniqueResources.set(id, {
            id: id,
            title: `${lesson?.classSubject?.teacher?.user?.profile?.firstname} ${lesson?.classSubject?.teacher?.user?.profile?.lastname}`,
          });
        }
      });
      return Array.from(uniqueResources.values());
    }
  }, [lessonsData, resourceMode]);

  // Filtrer les ressources pour les vues timeGrid
  const filteredResources = useMemo(() => {
    if (!isResourceView && selectedFilter?.id) {
      const filtered = resources.filter(
        (resource) => resource.id === selectedFilter.id,
      );
      return filtered.length > 0 ? filtered : [];
    }
    return resources;
  }, [resources, isResourceView, selectedFilter]);

  const handleResourceClick = (resource: ResourceApi) => {
    if (isResourceView && resource.id) {
      const newView = currentView.includes('Week')
        ? 'timeGridWeek'
        : 'timeGridDay';
      setSelectedFilter({ type: resourceMode, id: resource.id });
      handleViewChange(newView);
    }
  };

  // Handler pour le clic sur un événement existant
  const handleEventClick = (args: EventClickArg) => {
    // Empêcher l'ouverture du dialog si on est en train de drag/drop
    if (isDragging) return;

    const event = args.event;
    const lessonId = event.extendedProps.lessonId;

    // Récupérer les données complètes de la leçon
    const lesson = lessonsData?.getLessons?.data?.find(
      (l) => l.id === lessonId,
    );

    if (lesson) {
      setSelectedData({
        mode: 'UPDATE',
        args: {
          event: event,
          // Ajouter les données supplémentaires nécessaires pour l'édition
          lesson: lesson,
        } as any,
      });
      setOpen(true);
    }
  };

  // Handler pour la sélection d'une plage horaire (création)
  const handleEventSelect = (args: DateSelectArg) => {
    // Vérifier qu'on a une ressource sélectionnée (pour les vues avec ressources)
    if (args.resource && !args.resource.id) {
      toast.error('Veuillez sélectionner une ressource (classe ou enseignant)');
      return;
    }

    console.log('args eventSelect', args);

    // Vérifier que la plage sélectionnée est valide
    const start = args.start;
    const end = args.end;

    if (!start || !end) {
      toast.error('Sélection invalide');
      return;
    }

    // Calculer la durée en minutes
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    // Vérifier que la durée est valide (minimum 30 minutes, maximum 4 heures)
    if (duration < 30) {
      toast.error("La durée minimum d'un cours est de 30 minutes");
      return;
    }

    if (duration > 240) {
      toast.error("La durée maximum d'un cours est de 4 heures");
      return;
    }

    // Récupérer le jour de la semaine
    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(start),
    ) as Day;

    setSelectedData({
      mode: 'CREATE',
      args: {
        ...args,
        resourceId: args.resource?.id,
        day: day,
        startTime: format(start, 'HH:mm'),
        endTime: format(end, 'HH:mm'),
      } as any,
    });
    setOpen(true);
  };

  // Handler pour le drop (déplacement) d'un événement
  const handleEventDrop = async (info: EventDropArg) => {
    const event = info.event;
    const oldStart = info.oldEvent.start;
    const oldEnd = info.oldEvent.end;
    const newStart = event.start;
    const newEnd = event.end;

    if (!newStart || !newEnd || !oldStart || !oldEnd) return;

    // Calculer le nouveau jour
    const newDay = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(newStart),
    ) as Day;

    // Calculer l'ancien jour
    const oldDay = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(oldStart),
    ) as Day;

    // Vérifier si le drop est valide (pas de conflit avec d'autres cours)
    const hasConflict = checkForConflicts(
      event.id,
      newStart,
      newEnd,
      event.getResources()[0]?.id,
    );

    if (hasConflict) {
      // Revert le drop
      info.revert();
      toast.error("Conflit d'horaires avec un autre cours");
      return;
    }

    setTargetEventDrop({
      id: event.id,
      start: format(newStart, 'HH:mm'),
      end: format(newEnd, 'HH:mm'),
      day: newDay,
      originalStart: format(oldStart, 'HH:mm'),
      originalEnd: format(oldEnd, 'HH:mm'),
      originalDay: oldDay,
    });
    setAlertOpen(true);
  };

  // Handler pour le resize (redimensionnement) d'un événement
  const handleEventResize = (info: EventResizeDoneArg) => {
    const event = info.event;
    const oldStart = info.oldEvent.start;
    const oldEnd = info.oldEvent.end;
    const newStart = event.start;
    const newEnd = event.end;

    if (!newStart || !newEnd || !oldStart || !oldEnd) return;

    // Calculer la nouvelle durée
    const newDuration = (newEnd.getTime() - newStart.getTime()) / (1000 * 60);

    // Vérifier les contraintes de durée
    if (newDuration < 30) {
      info.revert();
      toast.error("La durée minimum d'un cours est de 30 minutes");
      return;
    }

    if (newDuration > 240) {
      info.revert();
      toast.error("La durée maximum d'un cours est de 4 heures");
      return;
    }

    // Vérifier les conflits
    const hasConflict = checkForConflicts(
      event.id,
      newStart,
      newEnd,
      event.getResources()[0]?.id,
      true, // ignore self
    );

    if (hasConflict) {
      info.revert();
      toast.error("Conflit d'horaires avec un autre cours");
      return;
    }

    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(newStart),
    ) as Day;

    setTargetEventDrop({
      id: event.id,
      start: format(newStart, 'HH:mm'),
      end: format(newEnd, 'HH:mm'),
      day: day,
      originalStart: format(oldStart, 'HH:mm'),
      originalEnd: format(oldEnd, 'HH:mm'),
      originalDay: Object.keys(dayMapping).find(
        (key) => dayMapping[key as Day] === getDay(oldStart),
      ) as Day,
    });
    setAlertOpen(true);
  };

  // Fonction utilitaire pour vérifier les conflits d'horaires
  const checkForConflicts = (
    eventId: string,
    newStart: Date,
    newEnd: Date,
    resourceId?: string,
    ignoreSelf: boolean = false,
  ): boolean => {
    // Récupérer tous les événements actuels
    const currentEvents = events.filter((event) => {
      // Ignorer l'événement lui-même si demandé
      if (ignoreSelf && event.id === eventId) return false;

      // Filtrer par ressource si spécifiée
      if (resourceId && event.resourceId !== resourceId) return false;

      return true;
    });

    // Vérifier chaque événement pour un chevauchement
    for (const event of currentEvents) {
      const eventStart = parseEventTime(event.startTime, event.daysOfWeek[0]);
      const eventEnd = parseEventTime(event.endTime, event.daysOfWeek[0]);

      if (eventStart && eventEnd) {
        // Vérifier si les plages horaires se chevauchent
        if (newStart < eventEnd && newEnd > eventStart) {
          return true; // Conflit détecté
        }
      }
    }

    return false; // Pas de conflit
  };

  // Fonction utilitaire pour parser le temps d'un événement
  const parseEventTime = (time: string, dayOfWeek: number): Date | null => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    } catch (error) {
      console.error('Error parsing event time:', error);
      return null;
    }
  };

  // Handler pour confirmer la mise à jour
  const handleUpdate = async () => {
    if (!targetEventDrop) return;

    const promise = updateMutate({
      input: {
        id: targetEventDrop.id,
        startTime: targetEventDrop.start,
        endTime: targetEventDrop.end,
        day: targetEventDrop.day,
      },
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours...',
      success: () => {
        // Invalider les queries pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ['getSchoolLessons'] });
        setTargetEventDrop(null);
        return 'Leçon mise à jour avec succès';
      },
      error: (err) => {
        console.error('Update error:', err);
        return err?.message || 'Erreur lors de la mise à jour de la leçon';
      },
    });

    try {
      await promise;
    } catch (error) {
      // Si l'update échoue, on pourrait vouloir revert le drop/resize
      // Mais FullCalendar a déjà appliqué le changement visuellement
      // Il faudrait rafraîchir le calendrier
      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.refetchEvents();
    } finally {
      setAlertOpen(false);
    }
  };

  // Handler pour annuler la mise à jour
  const handleCancelUpdate = () => {
    // Revert les changements dans le calendrier
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.refetchEvents(); // Rafraîchir pour revenir à l'état original
    setTargetEventDrop(null);
    setAlertOpen(false);
  };

  // Handler pour le début du drag
  const handleEventDragStart = () => {
    setIsDragging(true);
  };

  // Handler pour la fin du drag
  const handleEventDragStop = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 flex justify-centerpx-2 py-4 sm:px-4 md:px-6">
      <Card className="flex flex-col gap-4 w-full">
        <CardHeader className="px-4">
          <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2">
            <div className="flex gap-8">
              <Button onClick={() => handleViewChange('resourceTimeLineWeek')}>
                Resources
              </Button>
              <Button onClick={() => handleViewChange('timeGridWeek')}>
                vue grid
              </Button>
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
            </div>

            <ButtonGroup className="flex justify-self-end">
              <Button
                onClick={() =>
                  handleViewChange(
                    isResourceView ? 'resourceTimelineDay' : 'timeGridDay',
                  )
                }
                variant={
                  (isResourceView && currentView === 'resourceTimelineDay') ||
                  (!isResourceView && currentView === 'timeGridDay')
                    ? 'default'
                    : 'outline'
                }
              >
                Jour
              </Button>
              <ButtonGroupSeparator orientation="vertical" />
              <Button
                onClick={() =>
                  handleViewChange(
                    isResourceView ? 'resourceTimelineWeek' : 'timeGridWeek',
                  )
                }
                variant={
                  (isResourceView && currentView === 'resourceTimelineWeek') ||
                  (!isResourceView && currentView === 'timeGridWeek')
                    ? 'default'
                    : 'outline'
                }
              >
                Semaine
              </Button>
            </ButtonGroup>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <ButtonGroup className="h-8!">
                <Button
                  variant={resourceMode === 'CLASS' ? 'secondary' : 'outline'}
                  onClick={() => setResourceMode('CLASS')}
                  className="cursor-pointer"
                >
                  Classes
                </Button>
                <ButtonGroupSeparator orientation="vertical" />
                <Button
                  variant={resourceMode === 'TEACHER' ? 'secondary' : 'outline'}
                  onClick={() => setResourceMode('TEACHER')}
                  className="font-medium font-sans dark:text-white cursor-pointer"
                >
                  Enseignent
                </Button>
              </ButtonGroup>

              {resourceMode === 'CLASS' ? (
                <Combobox
                  items={classData!}
                  onValueChange={(value) => {
                    const classId = classData?.find(
                      (c) => c?.name === value,
                    )?.id;
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
              ) : (
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
                    onClear={() =>
                      setSelectedFilter({ type: 'TEACHER', id: '' })
                    }
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
              )}
            </div>

            <div className="flex gap-4">
              {showFilters && (
                <div className="flex gap-2 items-center">
                  {resourceMode === 'CLASS' ? (
                    <>
                      {/* Filtre par niveau */}
                      <Select
                        onValueChange={handleLevelChange}
                        value={advancedFilters.level}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Filtre par section */}
                      <Select
                        onValueChange={handleSectionChange}
                        value={advancedFilters.section}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner une section" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueSections.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Bouton pour effacer les filtres avancés */}
                      {(advancedFilters.level || advancedFilters.section) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAdvancedFilters}
                          className="h-8 px-2"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Effacer
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Filtre par département */}
                      <Select
                        onValueChange={handleDepartmentChange}
                        value={advancedFilters.department}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueDepartments.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Bouton pour effacer le filtre département */}
                      {advancedFilters.department && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAdvancedFilters}
                          className="h-8 px-2"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Effacer
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial dark:bg-slate-900! bg-slate-700! cursor-pointer border hover:bg-slate-500!"
              variant={hasActiveAdvancedFilters ? 'secondary' : 'outline'}
            >
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Filtres</span>
              <span className="hidden sm:inline">Filtres avancés</span>
              {hasActiveAdvancedFilters && (
                <span className="ml-0.5 sm:ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
              )}
            </Button>
          </div>
        </CardHeader>

        {!isPending && (
          <CardContent className="px-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: 'easeInOut' as const,
              }}
            >
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
                  currentView.includes('timeGrid')
                    ? {}
                    : {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      },
                  { hour: '2-digit', minute: '2-digit', hour12: false },
                ]}
                events={filteredEvents}
                resources={filteredResources}
                onEventDrop={handleEventDrop}
                renderEventContent={renderEventContent}
                onEventResize={handleEventResize}
                onEventDragStart={handleEventDragStart}
                onEventDragStop={handleEventDragStop}
                selectable={true}
                onResourceClick={handleResourceClick}
              />
            </motion.div>
          </CardContent>
        )}
      </Card>

      {/* Dialog pour la création/édition */}
      <LessonDialog
        key={
          (selectedData?.mode === 'UPDATE'
            ? selectedData?.args.event.start?.toString()
            : selectedData?.args.start?.toString()) || 'new'
        }
        open={open}
        onOpenChange={setOpen}
        initialData={selectedData}
        resourceMode={resourceMode}
        onSuccess={async () => {
          // Rafraîchir le calendrier après création/édition
          const calendarApi = calendarRef.current?.getApi();
          calendarApi?.refetchEvents();
          await queryClient.invalidateQueries({
            queryKey: ['getSchoolLessons'],
          });
        }}
      />

      {/* AlertDialog pour confirmation de modification */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir modifier cette leçon ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-2 gap-3 text-sm p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Avant :</p>
              <div className="space-y-1">
                <p>
                  Début:{' '}
                  <span className="text-foreground font-mono">
                    {targetEventDrop?.originalStart}
                  </span>
                </p>
                <p>
                  Fin:{' '}
                  <span className="text-foreground font-mono">
                    {targetEventDrop?.originalEnd}
                  </span>
                </p>
                <p>
                  Jour:{' '}
                  <span className="text-foreground">
                    {
                      dayConstant.find(
                        (d) => d.value === targetEventDrop?.originalDay,
                      )?.label
                    }
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-primary">Après :</p>
              <div className="space-y-1">
                <p>
                  Début:{' '}
                  <span className="text-foreground font-mono">
                    {targetEventDrop?.start}
                  </span>
                </p>
                <p>
                  Fin:{' '}
                  <span className="text-foreground font-mono">
                    {targetEventDrop?.end}
                  </span>
                </p>
                <p>
                  Jour:{' '}
                  <span className="text-foreground">
                    {
                      dayConstant.find((d) => d.value === targetEventDrop?.day)
                        ?.label
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ La modification affectera l'emploi du temps pour toutes les
              ressources concernées.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpdate}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Composant pour l'affichage des événements (amélioré)
const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
  const profile = eventInfo.event.extendedProps.teacher?.user?.profile;
  const mode = eventInfo.event.extendedProps?.mode;
  const className = eventInfo.event.extendedProps.groupName;
  const isDragging = eventInfo.isDragging;

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
        {eventInfo.event.extendedProps.status === 'CANCELLED' && (
          <span className="text-[10px] line-through opacity-50">Annulé</span>
        )}
      </div>

      <div
        className={cn(
          'text-[10px] opacity-80 font-medium truncate',
          mode === 'TEACHER' && 'uppercase text-xs',
        )}
      >
        {mode === 'TEACHER'
          ? className
          : `${profile?.firstname} ${profile?.lastname}`}
      </div>

      <div className="mt-auto text-[10px] text-gray-600 dark:text-gray-400 font-mono">
        {eventInfo.timeText}
      </div>

      <div className="w-full flex justify-end">
        <Badge
          variant="outline"
          className={cn('text-[9px] font-semibold px-1 py-0', cfg.badgeClass)}
        >
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
};

/* <LessonDialog
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
          <div className="grid grid-cols-2 gap-1 text-sm opacity-90">
            <p>
              Debut:{' '}
              <span className="text-primary">{targetEventDrop?.start}</span>
            </p>
            <p>
              Fin: <span className="text-primary">{targetEventDrop?.end}</span>
            </p>
            <p>
              Jour:{' '}
              <span className="text-primary">
                {
                  dayConstant.find((d) => d.value === targetEventDrop?.day)
                    ?.label
                }
              </span>
            </p>
            <p>
              Durée : <span></span>
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleUpdate}>
              Confirmer
            </AlertDialogAction>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */

export default LessonsListPage;
