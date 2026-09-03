'use client';
import { useMemo } from 'react';

import {
  useGetClassesOptionsQuery,
  useGetTeacherOptionsQuery,
} from '@stackschool/ui';
import { useLessonStore } from '@/store/lesson-store';

export const useLessonFilters = () => {
  const {
    resourceMode,
    selectedFilter,
    advancedFilters,
    setSelectedFilter,
    setAdvancedFilter,
    clearAdvancedFilters,
  } = useLessonStore();
  const { data: teachers } = useGetTeacherOptionsQuery(
    {
      input: {
        limit: 100,
      },
    },
    {
      enabled: resourceMode === 'TEACHER',
    },
  );

  const { data: classes } = useGetClassesOptionsQuery({
    input: {
      limit: 100,
    },
  });

  const teacherData = teachers?.getSchoolTeachers.data;
  const classData = classes?.getSchoolClasses.data?.map((c) => ({
    id: c?.group?.id,
    name: c?.group?.type === 'SOLO' ? c?.name : c.group?.name,
    level: c.level,
    section: c.section,
  }));

  const uniqueLevels = useMemo(() => {
    if (!classData) return [];
    const levels = new Set<string>();
    classData.forEach((c) => {
      if (c?.level) levels.add(c?.level);
    });
    return Array.from(levels);
  }, [classData]);

  const uniqueSections = useMemo(() => {
    if (!classData) return [];
    const sections = new Set<string>();
    classData.forEach((c) => {
      if (c?.section) sections.add(c.section);
    });
    return Array.from(sections);
  }, [classData]);

  const uniqueDepartments = useMemo(() => {
    if (!teacherData) return [];
    const depts = new Set<string>();
    teacherData.forEach((t) => {
      if (t?.department) depts.add(t.department);
    });
    return Array.from(depts);
  }, [teacherData]);

  const hasActiveAdvancedFilters = useMemo(() => {
    if (resourceMode === 'CLASS') {
      return !!(advancedFilters.level || advancedFilters.section);
    }
    return !!advancedFilters.department;
  }, [resourceMode, advancedFilters]);

  return {
    resourceMode,
    selectedFilter,
    advancedFilters,
    teacherData,
    classData,
    uniqueLevels,
    uniqueSections,
    uniqueDepartments,
    hasActiveAdvancedFilters,
    setSelectedFilter,
    setAdvancedFilter,
    clearAdvancedFilters,
  };
};
