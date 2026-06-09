'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttendancePage;
const attendance_1 = require("@/store/attendance");
const useAttendanceEvent_1 = require("@/components/school/attendance/hooks/useAttendanceEvent");
const useAttendanceData_1 = require("@/components/school/attendance/hooks/useAttendanceData");
const manual_attendace_table_1 = require("@/components/school/attendance/manual-attendace-table");
const employee_QR_generator_1 = require("@/components/school/attendance/employee-QR-generator");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const avatar_1 = require("@/components/ui/avatar");
const radio_group_1 = require("@/components/ui/radio-group");
const label_1 = require("@/components/ui/label");
const button_1 = require("@/components/ui/button");
function ProfileCell({ profile, }) {
    return (<div className="flex items-center gap-3">
      <avatar_1.Avatar className="h-9 w-9">
        <avatar_1.AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`}/>
        <avatar_1.AvatarFallback className="bg-primary/10 text-primary">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </avatar_1.AvatarFallback>
      </avatar_1.Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {profile.firstName} {profile.lastName}
        </span>
        <span className="text-muted-foreground text-xs">{profile.email}</span>
      </div>
    </div>);
}
function StatusRadioGroup({ value, onChange, }) {
    return (<radio_group_1.RadioGroup value={value} onValueChange={(v) => onChange(v)} className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <radio_group_1.RadioGroupItem value="PRESENT" id={`present-${value}`}/>
        <label_1.Label htmlFor={`present-${value}`} className="text-green-600 font-medium cursor-pointer text-sm">
          Présent
        </label_1.Label>
      </div>
      <div className="flex items-center space-x-2">
        <radio_group_1.RadioGroupItem value="ABSENT" id={`absent-${value}`}/>
        <label_1.Label htmlFor={`absent-${value}`} className="text-red-600 font-medium cursor-pointer text-sm">
          Absent
        </label_1.Label>
      </div>
      <div className="flex items-center space-x-2">
        <radio_group_1.RadioGroupItem value="LATE" id={`late-${value}`}/>
        <label_1.Label htmlFor={`late-${value}`} className="text-amber-600 font-medium cursor-pointer text-sm">
          Retard
        </label_1.Label>
      </div>
    </radio_group_1.RadioGroup>);
}
function AttendancePage() {
    const { mode, date } = (0, attendance_1.useAttendanceStore)();
    const { switchMode, selectClass, openScanner, closeScanner, openQrDialog, closeQrDialog, handleStatusChange, handleBadgeScan, isScannerOpen, qrDialogUser, isMarking, isScanning, selectedClass, } = (0, useAttendanceEvent_1.useAttendanceEvent)();
    const { rows, columns: baseColumns, classes, isLoading, } = (0, useAttendanceData_1.useAttendanceData)();
    const columns = (0, react_1.useMemo)(() => {
        return baseColumns.map((col) => {
            if (col?.accesorKey === 'status') {
                return {
                    ...col,
                    cell: ({ row }) => (<StatusRadioGroup value={row.original.status} onChange={(status) => handleStatusChange(row.original.id, row.original.userType, status)}/>),
                };
            }
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
    const today = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (<div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des présences
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <lucide_react_1.Calendar className="h-4 w-4"/>
          <p>{today}</p>
        </div>
      </div>

      <div className="space-y-6">
        

        

        
        <manual_attendace_table_1.AttendanceTable columns={columns} data={rows} isLoading={isLoading || isMarking}/>
      </div>

      <employee_QR_generator_1.QRCodeDialog user={qrDialogUser} onClose={closeQrDialog}/>
    </div>);
}
//# sourceMappingURL=kimi.js.map