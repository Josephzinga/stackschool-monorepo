"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAttendanceStore = void 0;
const zustand_1 = require("zustand");
exports.useAttendanceStore = (0, zustand_1.create)((set) => ({
    mode: 'STUDENT',
    setMode: (mode) => set((state) => {
        if (mode !== 'STUDENT') {
            return { mode, selectedClass: null };
        }
        return { mode };
    }),
    selectedClass: null,
    setSelectedClass: (classId) => set({ selectedClass: classId }),
    isScannerOpen: false,
    setScannerOpen: (open) => set({ isScannerOpen: open }),
    qrDialogUser: null,
    setQrDialogUser: (user) => set({ qrDialogUser: user }),
    date: new Date(),
    setDate: (date) => set({ date }),
    tenantId: 'tenant-1',
    resetFilters: () => set({ selectedClass: null }),
}));
//# sourceMappingURL=attendance.js.map