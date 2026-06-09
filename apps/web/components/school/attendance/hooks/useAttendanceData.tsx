// hooks/useAttendanceData.ts
import * as React from 'react';
import { useMemo } from 'react';
import { useAttendanceStore } from '@/store/attendance';
import { AttendanceMode, AttendanceRow, Staff } from '@/types/attendance';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import {
  Day,
  useGetClassesOptionsQuery,
  useGetStudentForAttendanceQuery,
  useGetTeacherForAttendanceQuery,
} from '@stackschool/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { dayMapping } from '@stackschool/shared';
import { useDebounce } from '@/hooks/useDebounce';
import { StatusBadgeGroup } from '@/components/school/attendance/status-radio-group';
import { useAttendanceEvent } from '@/components/school/attendance/hooks/useAttendanceEvent';

const mockStaff: Staff[] = [
  {
    id: 'st1',
    profile: {
      id: 'p6',
      firstName: 'Pierre',
      lastName: 'Roux',
      email: 'pierre@school.com',
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
      email: 'claire@school.com',
    },
    role: 'Secrétaire',
    status: 'PRESENT',
  },
];

export function useAttendanceData() {
  const { date, tenantId } = useAttendanceStore();
  const { selectedClass, mode, search } = useAttendanceEvent();

  const searchTerm = useDebounce(search, 400);

  const day = Object.keys(dayMapping).find(
    (day) => dayMapping[day as Day] === date.getDay(),
  );

  const classesQuery = useGetClassesOptionsQuery({
    input: {
      limit: 100,
    },
  });
  const studentQuery = useGetStudentForAttendanceQuery(
    {
      input: {
        classId: selectedClass,
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

  const {} = useTeacherForAttendancesQuery({
    filter: {
      day: day as Day,
      search: searchTerm,
    },
  });
  const rows: AttendanceRow[] = useMemo(() => {
    switch (mode) {
      case 'STUDENT':
        const students = studentQuery.data?.getSchoolStudents.data || [];
        return students.map((s) => ({
          id: s.id,
          profile: s.user?.profile!,
          status: s.attendances?.[0]?.status,
          class: s.schoolClass,
          userType: 'STUDENT' as AttendanceMode,
        }));

      case 'TEACHER':
        const teachers = teacherQuery.data?.getSchoolTeachers.data || [];
        return teachers.map((t) => ({
          id: t.id,
          profile: t.user?.profile,
          status: 'PRESENT',
          userType: 'TEACHER' as AttendanceMode,
        }));

      case 'STAFF':
        const staff = mockStaff || [];
        return staff.map((s) => ({
          id: s.id,
          profile: s.profile,
          status: 'ABSENT',
          role: s.role,
          userType: 'STAFF' as AttendanceMode,
        }));

      default:
        return [];
    }
  }, [studentQuery.data, teacherQuery.data, mode]);

  const columns: ColumnDef<AttendanceRow>[] = useMemo(() => {
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
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        cell: ({ row }) => <ProfileCell profile={row.original.profile} />,
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
      header: 'Statut',
      cell: ({ row, table }) => (
        <StatusBadgeGroup
          value={row.original?.status}
          onChange={(status) =>
            table.options.meta?.onChange?.(row.original, status)
          }
        />
      ),
      size: 400,
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
  }, [mode]);

  return {
    rows,
    columns,
    classes: classesQuery.data?.getSchoolClasses.data || [],
    isLoading:
      teacherQuery.isPending ||
      classesQuery.isPending ||
      studentQuery.isPending,
    isError:
      teacherQuery.isError || classesQuery.isError || studentQuery.isError,
  };
}

function ProfileCell({
  profile,
}: {
  profile: {
    firstname: string;
    lastname: string;
    email?: string;
    photo?: string;
  };
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={profile?.photo ?? undefined}
          alt={`${profile?.firstname} ${profile?.lastname}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {profile?.firstname[0]}
          {profile?.lastname[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {profile?.firstname} {profile?.lastname}
        </span>
        <span className="text-muted-foreground text-xs">{profile?.email}</span>
      </div>
    </div>
  );
}
