'use client';
import { useEffect, useMemo } from 'react';

import { Day, ResourceMode, useGetSchoolLessonsQuery } from '@stackschool/ui';
import { dayMapping } from '@stackschool/contracts';
import { EventInput } from '@fullcalendar/react';
import { lessonStatusConfig } from '@/constant';
import { useLessonStore } from '@/store/lesson-store';

export const useLessonCalendar = () => {
  const {
    resourceMode,
    selectedFilter,
    advancedFilters,
    setLoading,
    setError,
    pagination,
    setPagination,
    isClassOnly,
  } = useLessonStore();

  const { data, isPending, isError, error } = useGetSchoolLessonsQuery(
    {
      input: {
        classId:
          isClassOnly && selectedFilter?.type === 'CLASS'
            ? selectedFilter?.id
            : undefined,
        teacherId:
          selectedFilter?.type === 'TEACHER' ? selectedFilter?.id : undefined,
        groupId:
          !isClassOnly && selectedFilter?.type === 'CLASS'
            ? selectedFilter?.id
            : undefined,
        level: advancedFilters.level || undefined,
        section: advancedFilters.section || undefined,
        department: advancedFilters.department || undefined,
        hasLessonOnly: true,
        limit: pagination?.limit,
        page: pagination?.page,
        mode: resourceMode as ResourceMode,
      },
    },
    {
      enabled: isClassOnly ? !!selectedFilter?.id : true,
    },
  );

  useEffect(() => {
    if (!data?.getLessons?.meta) return;
    setPagination(data?.getLessons?.meta);
  }, [data?.getLessons]);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  useEffect(() => {
    if (isError) {
      setError(error || 'Erreur lors du chargements des leçons.');
    }
  }, [isError, error, setError]);

  const events: EventInput[] = useMemo(() => {
    return (
      data?.getLessons?.data?.events?.map((e) => ({
        id: e.id,
        resourceId: e.resourceId!,
        title: e?.title ?? '',
        startTime: e.startTime,
        endTime: e.endTime,
        daysOfWeek: [dayMapping[e.day as Day]],
        backgroundColor: lessonStatusConfig[e.status ?? 'PLANNED'].color,
        extendedProps: {
          subject: e.subject,
          status: e.status,
          teacher: e.teacher,
          group: e?.group,
          mode: resourceMode,
          lessonId: e.id,
          groupName:
            e.group?.type === 'SOLO'
              ? e.group.classes?.[0]?.name
              : e.group?.name,
        },
      })) || []
    );
  }, [data]);

  const resources = useMemo(() => {
    if (!data?.getLessons?.data.resources) return null;
    return data?.getLessons?.data.resources.map((r) => ({
      id: r.id,
      title: r.title,
      extendedProps: {
        weeklyHours: r.weeklyHours,
      },
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
