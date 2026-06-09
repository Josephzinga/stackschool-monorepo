'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceSchema = void 0;
exports.AttendanceDashboard = AttendanceDashboard;
const react_1 = __importStar(require("react"));
const manual_attendace_table_1 = require("@/components/school/attendance/manual-attendace-table");
const button_1 = require("@/components/ui/button");
const useAttendanceData_1 = require("@/components/school/attendance/hooks/useAttendanceData");
const lucide_react_1 = require("lucide-react");
const useAttendanceEvent_1 = require("@/components/school/attendance/hooks/useAttendanceEvent");
const ui_1 = require("@stackschool/ui");
const zod_1 = require("zod");
exports.attendanceSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    status: zod_1.z.enum(ui_1.AttendanceStatus),
    userType: zod_1.z.enum(['TEACHER', 'STUDENT', 'STAFF']),
}));
function AttendanceDashboard() {
    const { handleStatusChange, openQrDialog } = (0, useAttendanceEvent_1.useAttendanceEvent)();
    const { rows: data, columns: baseColumns, classes, isLoading, } = (0, useAttendanceData_1.useAttendanceData)();
    const dynamicColumns = (0, react_1.useMemo)(() => {
        return baseColumns.map((col) => {
            if (col.id === 'qr') {
                return {
                    ...col,
                    cell: ({ row }) => (<button_1.Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openQrDialog(row.original.id, `${row.original.profile.firstName} ${row.original.profile.lastName}`, row.original.userType)}>
              <lucide_react_1.QrCode className="h-4 w-4 text-muted-foreground hover:text-primary"/>
            </button_1.Button>),
                };
            }
            return col;
        });
    }, [baseColumns, handleStatusChange, openQrDialog]);
    return <manual_attendace_table_1.AttendanceTable columns={dynamicColumns} data={data}/>;
}
//# sourceMappingURL=page1.js.map