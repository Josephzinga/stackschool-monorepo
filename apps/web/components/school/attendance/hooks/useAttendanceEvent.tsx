import { useCallback } from 'react';
import { useAttendanceDate } from '@/components/school/attendance/hooks/useAttendanceDate';
import type { AttendanceMode } from '@/types/attendance';
import { useQueryClient } from '@tanstack/react-query';
import { Table, Row } from '@tanstack/react-table';
import {
  type AttendanceStatus,
  type GetStudentForAttendanceQuery,
  GetTeacherForAttendanceQuery,
  SchoolRole,
  useMarkAttendanceMutation,
} from '@stackschool/ui';
import {
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
  parseAsInteger,
} from 'nuqs';
import {
  hasPermission,
  type MarkAttendanceFormType,
} from '@stackschool/shared';
import { CheckedState } from '@radix-ui/react-checkbox';
import { toast } from 'sonner';
import { AttendanceRow } from '@/types/attendance';
import { useDashboard } from '@/components/providers/dashboard-provider';

export function useAttendanceEvent() {
  const { me } = useDashboard();
  const [mode, setMode] = useQueryState<AttendanceMode>(
    'mode',
    parseAsStringEnum(['STUDENT', 'TEACHER', 'STAFF']).withDefault('STUDENT'),
  );
  const [selectedSubject, setSelectedSubject] = useQueryState(
    'subjectId',
    parseAsString.withDefault(''),
  );

  const [search, setSearch] = useQueryState(
    'search_staff_teacher',
    parseAsString.withDefault(''),
  );
  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(0),
      pageSize: parseAsInteger.withDefault(10),
    },
    {
      history: 'push',
    },
  );
  const [selectedClass, setSelectedClass] = useQueryState(
    'classId',
    parseAsString.withDefault(''),
  );

  const {
    date,
    isScannerOpen,
    openScanner,
    closeScanner,
    qrDialogUser,
    setQrDialogUser,
    closeQrDialog,
    tenantId,
  } = useAttendanceDate();
  const queryClient = useQueryClient();
  let queryKey: any[] | undefined;
  const teacherId = me?.schoolContext?.teacher?.id;
  switch (mode) {
    case 'STUDENT':
      queryKey = [
        'GetStudentForAttendance',
        {
          input: {
            classId: selectedClass ?? '',
            limit: pagination.pageSize,
            page: pagination.pageIndex,
            ...(teacherId && { teacherId }),
          },
          date,
        },
      ];
  }
  const { mutateAsync: markAttendanceMutate } = useMarkAttendanceMutation({
    onSuccess: async (data, variables) => {
      if (store.isAutoSave) {
        switch (mode) {
          case 'STUDENT':
            await queryClient.setQueryData(
              queryKey as unknown[],
              (oldData: GetStudentForAttendanceQuery) => {
                if (!oldData) return null;
                const updateStudents = oldData.getSchoolStudents.data?.map(
                  (student) => {
                    const updateAttendance = Array.isArray(variables.input)
                      ? variables.input.find((att) => att.id === student.id)
                      : null;
                    if (updateAttendance) {
                      return {
                        ...student,
                        attendances: [
                          {
                            ...(student.attendances?.[0] || {}),
                            status: updateAttendance.status,
                            checkInTime: data.markAttendance.checkInTime,
                          },
                        ],
                      };
                    }
                    return student;
                  },
                );
                return {
                  ...oldData,
                  getSchoolStudents: {
                    ...oldData.getSchoolStudents,
                    data: updateStudents,
                  },
                };
              },
            );
            break;

          case 'TEACHER':
            await queryClient.setQueryData(
              queryKey as unknown[],
              (oldData: GetTeacherForAttendanceQuery) => {
                if (!oldData) return null;
                const updateTeachers = oldData.getSchoolTeachers.data?.map(
                  (teacher) => {
                    const updateAttendance = Array.isArray(variables.input)
                      ? variables.input.find((att) => att.id === teacher.id)
                      : null;
                    if (updateAttendance) {
                      return {
                        ...teacher,
                        attendances: [
                          {
                            ...(teacher.attendances?.[0] || {}),
                            status: updateAttendance.status,
                            checkInTime: data.markAttendance.checkInTime,
                          },
                        ],
                      };
                    }
                    return teacher;
                  },
                );
                return {
                  ...oldData,
                  getSchoolTeachers: {
                    ...oldData.getSchoolTeachers,
                    data: updateTeachers,
                  },
                };
              },
            );
            break;
        }
      } else {
        await queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  // Switch de mode
  const handleSwitchMode = useCallback(
    async (mode: AttendanceMode) => {
      if (me?.schoolContext?.role === 'TEACHER') {
        if (
          mode === 'TEACHER' &&
          !hasPermission(
            me.schoolContext.permissions?.map((perm) => perm?.code!)!,
            ['MARK_TEACHER_ATTENDANCE'],
          )
        ) {
          toast.warning(`Permissions non accorder. `);
          return;
        }
      }
      setMode(mode);

      if (mode !== 'STUDENT') {
        handleSelectClass(null);
        handleSelectSubject(null);
      }
    },
    [handleSelectClass, handleSelectSubject, me],
  );

  const handleSelectClass = useCallback(
    (classId: string | null) => {
      setSelectedClass(classId);
    },
    [setSelectedClass],
  );

  const handleSelectSubject = (subjectId: string | null) => {
    setSelectedSubject(subjectId);
  };

  // Dialog scanner
  // Dialog scanner
  const handleOpenScanner = openScanner;
  const handleCloseScanner = closeScanner;

  // Dialog QR
  const openQrDialog = useCallback(
    (id: string, name: string, type: AttendanceMode) => {
      setQrDialogUser({ id, name, type });
    },
    [setQrDialogUser],
  );

  const handleCloseQrDialog = closeQrDialog;

  const handleStatusChange = useCallback(
    (userId: string, userType: AttendanceMode, status: AttendanceStatus) => {
      console.log(userId, status);
    },
    [],
  );

  const handleMarkAttendance = async (data: MarkAttendanceFormType) => {
    if (me?.schoolContext?.role === 'TEACHER') {
      if (!selectedClass || !selectedSubject) {
        toast.info('Veuillez selectionner une classe et la matière enseigné');
        return;
      }
    }

    const promise = markAttendanceMutate({
      input: data.attendances.map((att) => ({
        ...att,
        userType: att.userType as SchoolRole,
        status: att.status!,
        date: att.date!,
        isSubjectMode: me?.schoolContext?.role === 'TEACHER',
        subjectId: selectedSubject,
      })),
    });

    toast.promise(promise, {
      loading: 'Sauvegardement en cours',
      success: 'Sauvegarder avec succès',
      error: (err) => err?.message || 'Erreur lors du sauvegarde',
    });
  };

  const handleCheckedTable = useCallback(
    (
      value: CheckedState,
      type: 'All' | 'Row',
      table?: Table<AttendanceRow>,
      row?: Row<AttendanceRow>,
    ) => {
      if (me?.schoolContext?.role !== 'TEACHER') {
        toggle();
      } else if (!selectedClass || !selectedSubject) {
        toast.warning(
          'Veuillez selectionner une classe et la matiére enseigner',
        );
      } else {
        toggle();
      }
      function toggle() {
        type === 'All'
          ? table?.toggleAllPageRowsSelected(!!value)
          : row?.toggleSelected(!!value);
      }
    },
    [selectedClass, selectedSubject],
  );

  // Scan badge
  /*  const scanBadgeMutation = useMutation({
    mutationFn: async (badgeId: string) => {
      return request(ENDPOINT, SCAN_BADGE, {
        tenantId: store.tenantId,
        badgeId,
        date: store.date,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'STUDENT', store.date],
      });
      closeScanner();
    },
  });*/

  const handleBadgeScan = useCallback((badgeId: string) => {
    console.log('handleBadgeScan', badgeId);
  }, []);

  return {
    mode,
    selectedClass,
    isScannerOpen,
    qrDialogUser,
    date,
    search,
    pagination,
    selectedSubject,

    // Actions
    handleSwitchMode,
    handleSelectClass,
    handleSelectSubject,
    openScanner: handleOpenScanner,
    closeScanner: handleCloseScanner,
    openQrDialog,
    closeQrDialog: handleCloseQrDialog,
    handleStatusChange,
    handleBadgeScan,
    setPagination,
    setSearch,
    handleMarkAttendance,
    handleCheckedTable,

    // Loading states
    isMarking: false,
    isScanning: false,
  };
}
