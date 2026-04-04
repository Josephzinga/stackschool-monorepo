'use client';
import { useEffect, useMemo } from 'react';
import { useLessonStore } from '@/store/lesson-store';
import {
  Day,
  GetSchoolLessonsQuery,
  useGetSchoolLessonsQuery,
} from '@stackschool/ui';
import { format } from 'date-fns';
import { dayMapping } from '@/constant';
import { ResourceMode } from '@/types/lessons-types';
import { ResourceSourceInput } from '@fullcalendar/resource';
import { EventInput } from '@fullcalendar/core';

export const useLessonCalendar = () => {
  const {
    resourceMode,
    selectedFilter,
    advancedFilters,
    setLoading,
    setError,
    isLoading: storeLoading,
    pagination,
    setPagination,
  } = useLessonStore();

  // Requête API
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
  }, [data?.getLessons?.meta]);
  // Mettre à jour l'état de chargement
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
    // On crée un garde-fou ici
    let uniqueResource: Map<any, any>;
    if (resourceMode === 'CLASS') {
      uniqueResource = processResources(
        data?.getLessons?.data?.groups || [],
        true,
      );
    } else {
      uniqueResource = processResources(
        data?.getLessons?.data?.teachers || [],
        false,
      );
    }

    return Array.from(uniqueResource.values());
  }, [data, resourceMode]);
  const resources = useMemo(() => {
    if (!data) return null;
    return transformToResources(data, resourceMode);
  }, [data]);

  return {
    events,
    isLoading: isPending,
    isError,
    resources,
    error,
  };
};

// Fonction utilitaire pour transformer les données en ressources
const transformToResources = (
  data?: GetSchoolLessonsQuery,
  resourceMode?: ResourceMode,
): ResourceSourceInput | undefined => {
  if (!data?.getLessons?.data) return [];

  if (resourceMode === 'CLASS') {
    const uniqueResources = new Map();
    data.getLessons.data.groups?.map((group) => {
      const id = group.id;
      if (id && !uniqueResources.has(id)) {
        uniqueResources.set(id, {
          id: id,
          title: group.type === 'SOLO' ? group.classes[0]?.name : group?.name,
        });
      }
    });
    return Array.from(uniqueResources.values());
  } else {
    const uniqueResources = new Map();
    data.getLessons.data.teachers?.map((teacher) => {
      const id = teacher.id;
      if (id && !uniqueResources.has(id)) {
        uniqueResources.set(id, {
          id: id,
          title: `${teacher?.user?.profile?.firstname} ${teacher?.user?.profile?.lastname}`,
        });
      }
    });
    return Array.from(uniqueResources.values());
  }
};
export const processResources = (
  resourceArray: any[],
  isGroup: boolean,
  resourceMode?: ResourceMode,
) => {
  const uniqueEvents = new Map();
  resourceArray?.forEach((res) => {
    res.classSubjects?.forEach((cls: any) => {
      cls?.lessons?.forEach((lesson: any) => {
        // Si on n'a pas encore vu cette leçon, on l'ajoute
        if (!uniqueEvents.has(lesson.id)) {
          uniqueEvents.set(lesson.id, {
            id: lesson.id,
            resourceId: res.id, // teacher.id ou group.id
            title: cls.subject?.name,
            startTime: format(new Date(lesson.startTime), 'HH:mm'),
            endTime: format(new Date(lesson.endTime), 'HH:mm'),
            daysOfWeek: [dayMapping[lesson.day as Day]],
            extendedProps: {
              subject: cls.subject,
              status: lesson.status,
              teacher: cls?.teacher,
              mode: resourceMode,
              lessonId: lesson.id,
              groupName: isGroup
                ? res.type === 'SOLO'
                  ? res.classes[0]?.name
                  : res.name
                : cls?.group?.type === 'SOLO'
                  ? cls?.group?.classes[0]?.name
                  : cls.group.name,
            },
          });
        }
      });
    });
  });
  return uniqueEvents;
};
