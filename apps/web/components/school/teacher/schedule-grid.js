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
const loader_1 = require("@/components/ui/loader");
const render_resource_content_1 = require("@/components/school/lesson/render-resource-content");
const useLessonCalendar_1 = require("@/components/school/lesson/hooks/useLessonCalendar");
const lesson_store_1 = require("@/store/lesson-store");
const useLessonEvents_1 = require("@/components/school/lesson/hooks/useLessonEvents");
const lesson_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-dialog"));
const lesson_alert_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-alert-dialog"));
const TeacherScheduleGrid = ({ id }) => {
    const { handleEventSelect, handleEventResize, handleEventDrop, handleEventClick, calendarRef, } = (0, useLessonEvents_1.useLessonEvents)();
    const { setSelectedFilter, resetAll, setCurrentView, setResource, isLoading, lessonDialogOpen, alertOpen, setResourceMode, } = (0, lesson_store_1.useLessonStore)();
    (0, react_1.useEffect)(() => {
        resetAll();
        setResourceMode('TEACHER');
        setCurrentView('timeGridWeek');
        setSelectedFilter({ type: 'TEACHER', id });
    }, []);
    const { events, resources } = (0, useLessonCalendar_1.useLessonCalendar)();
    (0, react_1.useEffect)(() => {
        if (resources && resources.length > 0)
            setResource({ id: resources?.[0]?.id, title: resources?.[0]?.title });
    }, [resources, lessonDialogOpen]);
    console.log('Rendre');
    return (<div className="p-4 flex flex-col gap-4">
      {isLoading ? (<loader_1.Loader />) : (<render_resource_content_1.TimeGridContainer>
          <time_grid_1.default ref={calendarRef} selectable={true} editable={true} hideResourceViewButtons={true} events={events} initialView="timeGridWeek" renderEventContent={time_grid_1.renderEventContent} onEventSelect={handleEventSelect} onEventResize={handleEventResize} onEventClick={handleEventClick} onEventDrop={handleEventDrop}/>
        </render_resource_content_1.TimeGridContainer>)}
      {lessonDialogOpen && (<lesson_dialog_1.default onSuccess={() => console.log('success')}/>)}
      {alertOpen && (<lesson_alert_dialog_1.default onCancelUpdate={() => console.log('cancel')}/>)}{' '}
    </div>);
};
exports.default = TeacherScheduleGrid;
//# sourceMappingURL=schedule-grid.js.map