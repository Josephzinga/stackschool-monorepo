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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("@/app/styles/schedule-grid.css");
const time_grid_1 = __importStar(require("@/components/school/time-grid"));
const useLessonEvents_1 = require("@/components/school/lesson/hooks/useLessonEvents");
const lesson_alert_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-alert-dialog"));
const lesson_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-dialog"));
const lesson_store_1 = require("@/store/lesson-store");
const useLessonCalendar_1 = require("@/components/school/lesson/hooks/useLessonCalendar");
const ClassScheduleGrid = ({ classId }) => {
    const { handleEventClick, handleEventDrop, handleEventSelect, handleEventResize, calendarRef, } = (0, useLessonEvents_1.useLessonEvents)();
    const { setSelectedFilter, lessonDialogOpen, setIsClassOnly, resetAll, alertOpen, setResource, } = (0, lesson_store_1.useLessonStore)();
    const { events, resources } = (0, useLessonCalendar_1.useLessonCalendar)();
    (0, react_1.useEffect)(() => {
        resetAll();
        setIsClassOnly(true);
        setSelectedFilter({ type: 'CLASS', id: classId });
    }, []);
    (0, react_1.useEffect)(() => {
        if (resources && resources.length > 0)
            setResource({ id: resources[0]?.id, title: resources[0].title });
    }, [resources]);
    return (<div className="p-1 flex flex-col gap-4">
      <time_grid_1.default editable={true} selectable={true} ref={calendarRef} events={events} renderEventContent={time_grid_1.renderEventContent} onEventClick={handleEventClick} onEventResize={handleEventResize} onEventDrop={handleEventDrop} onEventSelect={handleEventSelect} hideResourceViewButtons={true}/>
      {lessonDialogOpen && (<lesson_dialog_1.default onSuccess={() => console.log('success')}/>)}
      {alertOpen && (<lesson_alert_dialog_1.default onCancelUpdate={() => console.log('cancel')}/>)}{' '}
    </div>);
};
exports.default = ClassScheduleGrid;
//# sourceMappingURL=schedule-grid.js.map