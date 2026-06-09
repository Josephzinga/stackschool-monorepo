import { useCallback } from 'react';
import { useAttendanceStore } from '@/store/attendance';
import { AttendanceMode } from '@/types/attendance';
import { useQueryClient } from '@tanstack/react-query';
import { AttendanceStatus } from '@stackschool/ui';
import { parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';

/*const MARK_ATTENDANCE = gql`
  mutation MarkAttendance(
    $tenantId: ID!
    $userId: ID!
    $userType: UserType!
    $status: AttendanceStatus!
    $date: Date!
  ) {
    markAttendance(
      tenantId: $tenantId
      userId: $userId
      userType: $userType
      status: $status
      date: $date
    ) {
      success
      attendance {
        id
        status
        markedAt
      }
    }
  }
`;

const SCAN_BADGE = gql`
  mutation ScanBadge($tenantId: ID!, $badgeId: String!, $date: Date!) {
    scanBadge(tenantId: $tenantId, badgeId: $badgeId, date: $date) {
      success
      attendance {
        id
        status
        userId
        userType
      }
      error
    }
  }
`; */

export function useAttendanceEvent() {
  const store = useAttendanceStore();
  const queryClient = useQueryClient();
  const [mode, setMode] = useQueryState<AttendanceMode>(
    'mode',
    parseAsStringEnum(['STUDENT', 'TEACHER', 'STAFF']).withDefault('STUDENT'),
  );
  const [search, setSearch] = useQueryState(
    'search_staff_teacher',
    parseAsString.withDefault(''),
  );
  const [selectedClass, setSelectedClass] = useQueryState(
    'classId',
    parseAsString.withDefault(''),
  );

  // Switch de mode
  const handleSwitchMode = useCallback(
    async (mode: AttendanceMode) => {
      if (mode !== 'STUDENT') {
        handleSelectClass(null);
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

  // Mutation marquer présence
  /*  const markAttendanceMutation = useMutation({
    mutationFn: async (variables: {
      userId: string;
      userType: AttendanceMode;
      status: AttendanceStatus;
    }) => {
      return request(ENDPOINT, MARK_ATTENDANCE, {
        tenantId: store.tenantId,
        userId: variables.userId,
        userType: variables.userType,
        status: variables.status,
        date: store.date,
      });
    },
    onSuccess: () => {
      // Invalider les queries selon le mode
      queryClient.invalidateQueries({
        queryKey: ['attendance', store.mode, store.date],
      });
    },
  });*/

  const handleStatusChange = useCallback(
    (userId: string, userType: AttendanceMode, status: AttendanceStatus) => {
      console.log(userId, status);
    },
    [],
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
    mode: mode,
    selectedClass: selectedClass,
    isScannerOpen: store.isScannerOpen,
    qrDialogUser: store.qrDialogUser,
    date: store.date,

    // Actions
    handleSwitchMode,
    handleSelectClass,
    openScanner,
    closeScanner,
    openQrDialog,
    closeQrDialog,
    handleStatusChange,
    handleBadgeScan,
    search,
    setSearch,

    // Loading states
    isMarking: false,
    isScanning: false,
  };
}
