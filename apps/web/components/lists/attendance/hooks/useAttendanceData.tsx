import * as React from 'react';
import { useMemo } from 'react';
import { useAttendanceUiState } from '@/components/lists/attendance/hooks/useAttendanceUiState';
import { AttendanceMode, AttendanceRow } from '@/types/attendance';

import {
  type Day,
  type PaginationMeta,
  useGetClassesOptionsQuery,
  useGetStudentForAttendanceQuery,
  useGetSubjectsOptionsQuery,
  useGetTeacherForAttendanceQuery,
} from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useAttendanceEvent } from '@/components/lists/attendance/hooks/useAttendanceEvent';
import { useDashboard } from '@/components/providers/dashboard-provider';
import { dayMapping } from '@stackschool/contracts';

export function useAttendanceData() {
  const { date } = useAttendanceUiState();
  const { selectedClass, mode, search, pagination } = useAttendanceEvent();
  const { me } = useDashboard();
  const [meta, setMeta] = React.useState<Omit<PaginationMeta, 'page'>>();
  const searchTerm = useDebounce(search, 400);

  const day = Object.keys(dayMapping).find(
    (day) => dayMapping[day as Day] === date.getDay(),
  );

  const teacherId =
    me?.schoolContext?.role === 'TEACHER' ? me.schoolContext.teacher?.id : '';

  const classesQuery = useGetClassesOptionsQuery({
    input: {
      limit: 100,
      teacherId,
    },
  });

  const { data: subjectsData } = useGetSubjectsOptionsQuery(
    {
      input: {
        teacherId,
      },
    },
    {
      enabled: me?.schoolContext?.role === 'TEACHER',
    },
  );
  const studentQuery = useGetStudentForAttendanceQuery(
    {
      input: {
        classId: selectedClass,
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        teacherId,
      },
    },
    {
      enabled: mode === 'STUDENT',
    },
  );

  const teacherQuery = useGetTeacherForAttendanceQuery(
    {
      input: {
        day: day as Day,
        searchTerm,
      },
    },
    {
      enabled: mode === 'TEACHER',
    },
  );

  const rows: AttendanceRow[] | [] = useMemo(() => {
    switch (mode) {
      case 'STUDENT':
        const students = studentQuery.data?.getSchoolStudents.data || [];
        if (studentQuery.data?.getSchoolStudents?.meta)
          setMeta(studentQuery.data?.getSchoolStudents?.meta);

        return students.map((s) => ({
          id: s.id,
          profile: s.schoolProfile!,
          status: s.attendances?.[0]?.status ?? null,
          time: {
            checkInTime: s.attendances?.[0]?.checkInTime,
            date: s.attendances?.[0]?.date,
          },
          class: s.schoolClass,
          userType: 'STUDENT' as AttendanceMode,
        }));

      case 'TEACHER':
        const teachers = teacherQuery.data?.getSchoolTeachers.data || [];
        if (teacherQuery.data?.getSchoolTeachers?.meta)
          setMeta(teacherQuery.data?.getSchoolTeachers?.meta);
        return teachers.map((t) => ({
          id: t.id,
          profile: t.schoolProfile!,
          status: t.attendances?.[0]?.status ?? null,
          userType: 'TEACHER' as AttendanceMode,
        }));

      case 'STAFF':
        const staff: AttendanceRow[] = [];
        return staff.map((s) => ({
          id: s.id,
          profile: s.profile!,
          status: s.status,
          role: s.role,
          userType: 'STAFF' as AttendanceMode,
        }));

      default:
        return [];
    }
  }, [studentQuery.data, teacherQuery.data, mode]);

  return {
    rows,
    subjectsData: subjectsData?.getSchoolSubjects?.data,
    meta,
    classes: classesQuery.data?.getSchoolClasses.data || [],
    isLoading:
      teacherQuery.isPending ||
      classesQuery.isPending ||
      studentQuery.isPending,
    isError:
      teacherQuery.isError || classesQuery.isError || studentQuery.isError,
  };
}
