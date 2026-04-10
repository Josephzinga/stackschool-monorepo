'use client';
import { useMemo } from 'react';

import { useLessonStore } from '@/store/lesson-store';
import { useGetNavigationDataQuery } from '@stackschool/ui';

export const useLessonFilters = () => {
  const {
    resourceMode,
    selectedFilter,
    advancedFilters,
    setSelectedFilter,
    setAdvancedFilter,
    clearAdvancedFilters,
  } = useLessonStore();
  const { data } = useGetNavigationDataQuery();

  const teacherData = data?.getClassTeacher?.teacher;
  const classData = data?.getClassTeacher?.groups?.map((g) => ({
    id: g.id,
    name: g.type === 'SOLO' ? g?.classes[0].name : g.name,
    level: g.classes?.[0].level,
    section: g.classes?.[0].section,
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
