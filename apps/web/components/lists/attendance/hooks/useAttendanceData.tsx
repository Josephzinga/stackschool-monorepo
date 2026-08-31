import * as React from 'react';
import { useMemo } from 'react';
import { useAttendanceUiState } from '@/components/lists/attendance/hooks/useAttendanceUiState';
import { AttendanceMode, AttendanceRow, Staff } from '@/types/attendance';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

import { format } from 'date-fns';
import {
  type Day,
  type PaginationMeta,
  useGetClassesOptionsQuery,
  useGetStudentForAttendanceQuery,
  useGetTeacherForAttendanceQuery,
  useGetSubjectsOptionsQuery,
} from '@stackschool/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { dayMapping } from '@stackschool/shared';
import { useDebounce } from '@/hooks/useDebounce';
import { useAttendanceEvent } from '@/components/lists/attendance/hooks/useAttendanceEvent';
import { ProfileCell } from '@/components/table/profile-cell';
import { AttendanceCell } from '../table/attendance-cell';
import { useDashboard } from '@/components/providers/dashboard-provider';
import { useIsMobile } from '@/hooks/use-mobile';

const mockStaff: Staff[] = [
  {
    id: 'st1',
    profile: {
      id: 'p6',
      firstName: 'Pierre',
      lastName: 'Roux',
      email: 'pierre@lists.com',
    },
    role: 'Administrateur',
    status: 'ABSENT',
  },
  {
    id: 'st2',
    profile: {
      id: 'p7',
      firstName: 'Claire',
      lastName: 'Vincent',
      email: 'claire@lists.com',
    },
    role: 'Secrétaire',
    status: 'PRESENT',
  },
];

export function useAttendanceData() {
  const { date } = useAttendanceUiState();
  const {
    selectedClass,
    mode,
    search,
    handleSwitchMode,
    pagination,
    selectedSubject,
    handleCheckedTable,
  } = useAttendanceEvent();
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
      date,
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
          profile: s.user?.profile!,
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
          profile: t.user?.profile!,
          status: t.attendances?.[0].status ?? null,
          userType: 'TEACHER' as AttendanceMode,
        }));

      case 'STAFF':
        const staff = mockStaff || [];
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

  const getColumns = React.useCallback((): ColumnDef<AttendanceRow>[] => {
    const baseColumns: ColumnDef<AttendanceRow>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            className="cursor-pointer"
            onCheckedChange={(value) => handleCheckedTable(value, 'All', table)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value) =>
              handleCheckedTable(value, 'Row', undefined, row)
            }
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 20,
      },
      {
        accessorKey: 'profile',
        header:
          mode === 'STUDENT'
            ? 'Élève'
            : mode === 'TEACHER'
              ? 'Enseignant'
              : 'Personnel',
        cell: ({ row }) => <ProfileCell profile={row.original.profile!} />,
      },
    ];

    if (mode === 'STUDENT') {
      baseColumns.push({
        accessorKey: 'class',
        header: 'Classe',
        cell: ({ row }) =>
          row.original.class ? (
            <Badge variant="secondary">{row.original.class.name}</Badge>
          ) : null,
        size: 150,
      });
    }

    if (mode === 'TEACHER') {
      baseColumns.push({
        accessorKey: 'class',
      });
    }

    if (mode === 'STAFF') {
      baseColumns.push({
        accessorKey: 'role',
        header: 'Rôle',
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
        size: 150,
      });
    }

    baseColumns.push({
      accessorKey: 'status',
      header: 'Statut de présence',
      cell: ({ row, table }) => <AttendanceCell row={row} table={table} />,
      size: 800,
    });

    baseColumns.push({
      accessorKey: 'time',
      header: 'Date/heure',
      cell: ({ row }) => {
        const checkInTime = row.original?.time?.checkInTime;
        return (
          <div>
            {checkInTime ? (
              <span>heure: {format(checkInTime, 'HH:mm')}</span>
            ) : (
              ''
            )}
          </div>
        );
      },
    });

    // Colonne QR pour Teacher et Staff
    if (mode !== 'STUDENT') {
      baseColumns.push({
        id: 'qr',
        header: 'QR',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              // Sera géré par useAttendanceEvent
            }}
          >
            <QrCode className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        ),
        size: 80,
      });
    }

    return baseColumns;
  }, [mode, handleSwitchMode, meta, selectedClass, selectedSubject]);

  return {
    rows,
    getColumns,
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
