'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableHeader = TableHeader;
const class_combobox_1 = require("@/components/school/attendance/class-combobox");
const QR_scan_1 = require("@/components/school/attendance/QR-scan");
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const popover_1 = require("@/components/animate-ui/components/radix/popover");
const button_1 = require("@/components/ui/button");
const calendar_1 = require("@/components/ui/calendar");
const mode_group_button_1 = require("@/components/school/attendance/mode-group-button");
const useAttendanceEvent_1 = require("@/components/school/attendance/hooks/useAttendanceEvent");
const useAttendanceData_1 = require("@/components/school/attendance/hooks/useAttendanceData");
const attendance_1 = require("@/store/attendance");
const employee_QR_generator_1 = require("@/components/school/attendance/employee-QR-generator");
const input_1 = require("@/components/ui/input");
function TableHeader() {
    const { mode, handleSwitchMode, isScannerOpen, isScanning, closeScanner, openScanner, handleSelectClass, qrDialogUser, closeQrDialog, selectedClass, search, setSearch, } = (0, useAttendanceEvent_1.useAttendanceEvent)();
    const { classes } = (0, useAttendanceData_1.useAttendanceData)();
    const { date, setDate } = (0, attendance_1.useAttendanceStore)();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const handleBadgeScan = () => { };
    return (<header className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des présences
          </h1>
          <popover_1.Popover>
            <popover_1.PopoverTrigger asChild>
              <button_1.Button variant="outline" className="cursor-pointer mt-2">
                <lucide_react_1.CalendarIcon className="h-4 w-4"/>
                {date.toLocaleDateString('fr-Fr', options)}
              </button_1.Button>
            </popover_1.PopoverTrigger>
            <popover_1.PopoverContent>
              <calendar_1.Calendar mode="single" selected={date ? new Date(date) : undefined} captionLayout="label" weekStartsOn={1} startMonth={new Date(1990, 0)} onSelect={(date) => {
            if (date)
                setDate(date);
        }}/>
            </popover_1.PopoverContent>
          </popover_1.Popover>
        </div>
        <mode_group_button_1.ModeButtonGroup activeMode={mode} onModeChange={handleSwitchMode}/>
      </div>
      <div className="flex items-center justify-between">
        {mode === 'STUDENT' ? (<class_combobox_1.ClassCombobox classes={classes} selectedClass={selectedClass} onSelect={handleSelectClass}/>) : (<div>
            <input_1.Input placeholder={mode === 'TEACHER'
                ? 'Rechercher un Enseignant...'
                : 'Rechercher un Personnel'} value={search} onChange={(e) => setSearch(e.target.value)}/>
          </div>)}
        <div>
          <button_1.Button className="px-4 cursor-pointer" variant="ghost">
            <lucide_react_1.LucideQrCode />
          </button_1.Button>
        </div>
      </div>

      {mode === 'STUDENT' && isScannerOpen && (<QR_scan_1.ScannerDialog open={isScannerOpen} onOpenChange={(open) => (open ? openScanner() : closeScanner())} onScan={handleBadgeScan} isLoading={isScanning}/>)}
      <employee_QR_generator_1.QRCodeDialog user={qrDialogUser} onClose={closeQrDialog}/>
    </header>);
}
//# sourceMappingURL=table-header.js.map