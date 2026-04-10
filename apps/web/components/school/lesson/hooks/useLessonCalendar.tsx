'use client';
import { useEffect, useMemo } from 'react';
import { useLessonStore } from '@/store/lesson-store';
import { Day, useGetSchoolLessonsQuery } from '@stackschool/ui';
import { format } from 'date-fns';
import { dayMapping } from '@stackschool/shared';
import { EventInput } from '@fullcalendar/core';

export const useLessonCalendar = () => {
  const {
    resourceMode,
    selectedFilter,
    advancedFilters,
    setLoading,
    setError,
    pagination,
    setPagination,
  } = useLessonStore();

  const { data, isPending, isError, error } = useGetSchoolLessonsQuery({
    filter: {
      groupId:
        selectedFilter?.type === 'CLASS' ? selectedFilter?.id : undefined,
      teacherId:
        selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
      level: advancedFilters.level || undefined,
      section: advancedFilters.section || undefined,
      department: advancedFilters.department || undefined,
      hasLessonOnly: true,
      limit: pagination?.limit,
      page: pagination?.page,
      mode: resourceMode,
    },
  });

  useEffect(() => {
    if (!data?.getLessons?.meta) return;
    setPagination(data?.getLessons?.meta);
  }, [data?.getLessons]);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  // Mettre à jour l'erreur
  useEffect(() => {
    if (isError) {
      setError(error?.message || 'Erreur lors du chargements des leçons.');
    }
  }, [isError, error, setError]);

  const events: EventInput[] = useMemo(() => {
    return (
      data?.getLessons?.data?.events?.map((e) => ({
        id: e.id,
        resourceId: e.resourceId!,
        title: e?.title,
        startTime: format(new Date(e.startTime), 'HH:mm'),
        endTime: format(new Date(e.endTime), 'HH:mm'),
        daysOfWeek: [dayMapping[e.day as Day]],
        extendedProps: {
          subject: e.subject,
          status: e.status,
          teacher: e.teacher,
          group: e?.group,
          mode: resourceMode,
          lessonId: e.id,
          groupName:
            e.group?.type === 'SOLO' ? e.group.classes[0]?.name : e.group?.name,
        },
      })) || []
    );
  }, [data, resourceMode]);

  const resources = useMemo(() => {
    if (!data?.getLessons?.data.resources) return null;
    return data?.getLessons?.data.resources.map((r) => ({
      id: r.id,
      title: r.title,
    }));
  }, [data?.getLessons?.data]);

  return {
    events,
    isLoading: isPending,
    isError,
    resources,
    error,
  };
};
