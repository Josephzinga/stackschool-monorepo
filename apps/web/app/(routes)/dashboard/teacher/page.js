'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timetable = Timetable;
exports.default = TeacherDashboard;
const react_1 = __importDefault(require("@fullcalendar/react"));
const timegrid_1 = __importDefault(require("@fullcalendar/timegrid"));
const daygrid_1 = __importDefault(require("@fullcalendar/daygrid"));
const interaction_1 = __importDefault(require("@fullcalendar/interaction"));
const events = [
    {
        title: 'Mathématiques',
        start: '2025-01-22T08:00:00',
        end: '2025-01-22T10:00:00',
    },
    {
        title: 'Physique',
        start: '2025-01-23T10:00:00',
        end: '2025-01-23T12:00:00',
    },
];
function Timetable() {
    return (<react_1.default plugins={[timegrid_1.default, daygrid_1.default, interaction_1.default]} initialView="timeGridWeek" events={events} editable={false} selectable={false} allDaySlot={false} slotMinTime="07:00:00" slotMaxTime="18:00:00" height="auto"/>);
}
function TeacherDashboard() {
    return (<div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Timetable />
            
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map