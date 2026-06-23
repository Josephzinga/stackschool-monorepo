import { useCallback } from 'react';
import { useAttendanceStore } from '@/store/attendance';
import type { AttendanceMode } from '@/types/attendance';
import { useQueryClient } from '@tanstack/react-query';
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
import { toast } from 'sonner';
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

  const store = useAttendanceStore();
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
          date: store.date,
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
      if (mode !== 'STUDENT') {
        handleSelectClass(null);
        handleSelectSubject(null);
      }
      if (
        me?.schoolContext?.role === 'TEACHER' &&
        hasPermission[me.schoolContext.teacher]
      ) {
      }
      setMode(mode);
    },
    [store],
  );

  const handleSelectClass = useCallback(
    (classId: string | null) => {
      setSelectedClass(classId);
    },
    [selectedClass],
  );

  const handleSelectSubject = (subjectId: string | null) => {
    setSelectedSubject(subjectId);
  };

  // Dialog scanner
  const openScanner = useCallback(() => {
    store.setScannerOpen(true);
  }, [store]);

  const closeScanner = useCallback(() => {
    store.setScannerOpen(false);
  }, [store]);

  // Dialog QR
  const openQrDialog = useCallback(
    (id: string, name: string, type: AttendanceMode) => {
      store.setQrDialogUser({ id, name, type });
    },
    [store],
  );

  const closeQrDialog = useCallback(() => {
    store.setQrDialogUser(null);
  }, [store]);

  const handleStatusChange = useCallback(
    (userId: string, userType: AttendanceMode, status: AttendanceStatus) => {
      console.log(userId, status);
    },
    [],
  );

  const handleMarkAttendance = async (data: MarkAttendanceFormType) => {
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
    isScannerOpen: store.isScannerOpen,
    qrDialogUser: store.qrDialogUser,
    date: store.date,
    search,
    pagination,
    selectedSubject,

    // Actions
    handleSwitchMode,
    handleSelectClass,
    handleSelectSubject,
    openScanner,
    closeScanner,
    openQrDialog,
    closeQrDialog,
    handleStatusChange,
    handleBadgeScan,
    setPagination,
    setSearch,
    handleMarkAttendance,

    // Loading states
    isMarking: false,
    isScanning: false,
  };
}
