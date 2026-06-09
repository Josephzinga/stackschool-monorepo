"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAttendanceEvent = useAttendanceEvent;
const react_1 = require("react");
const attendance_1 = require("@/store/attendance");
const react_query_1 = require("@tanstack/react-query");
const nuqs_1 = require("nuqs");
function useAttendanceEvent() {
    const store = (0, attendance_1.useAttendanceStore)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const [mode, setMode] = (0, nuqs_1.useQueryState)('mode', (0, nuqs_1.parseAsStringEnum)(['STUDENT', 'TEACHER', 'STAFF']).withDefault('STUDENT'));
    const [search, setSearch] = (0, nuqs_1.useQueryState)('search_staff_teacher', nuqs_1.parseAsString.withDefault(''));
    const [selectedClass, setSelectedClass] = (0, nuqs_1.useQueryState)('classId', nuqs_1.parseAsString.withDefault(''));
    const handleSwitchMode = (0, react_1.useCallback)(async (mode) => {
        if (mode !== 'STUDENT') {
            handleSelectClass(null);
        }
        setMode(mode);
    }, [store]);
    const handleSelectClass = (0, react_1.useCallback)((classId) => {
        setSelectedClass(classId);
    }, [selectedClass]);
    const openScanner = (0, react_1.useCallback)(() => {
        store.setScannerOpen(true);
    }, [store]);
    const closeScanner = (0, react_1.useCallback)(() => {
        store.setScannerOpen(false);
    }, [store]);
    const openQrDialog = (0, react_1.useCallback)((id, name, type) => {
        store.setQrDialogUser({ id, name, type });
    }, [store]);
    const closeQrDialog = (0, react_1.useCallback)(() => {
        store.setQrDialogUser(null);
    }, [store]);
    const handleStatusChange = (0, react_1.useCallback)((userId, userType, status) => {
        console.log(userId, status);
    }, []);
    const handleBadgeScan = (0, react_1.useCallback)((badgeId) => {
        console.log('handleBadgeScan', badgeId);
    }, []);
    return {
        mode: mode,
        selectedClass: selectedClass,
        isScannerOpen: store.isScannerOpen,
        qrDialogUser: store.qrDialogUser,
        date: store.date,
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
        isMarking: false,
        isScanning: false,
    };
}
//# sourceMappingURL=useAttendanceEvent.js.map