'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarHeader = void 0;
const button_1 = require("@/components/ui/button");
const button_group_1 = require("@/components/ui/button-group");
const lucide_react_1 = require("lucide-react");
const lesson_store_1 = require("@/store/lesson-store");
const react_1 = __importDefault(require("react"));
const useLessonEvents_1 = require("@/components/school/lesson/hooks/useLessonEvents");
const CalendarHeader = () => {
    const { currentView } = (0, lesson_store_1.useLessonStore)();
    const { handlePrev, handleNext, handleToday, handleViewChange } = (0, useLessonEvents_1.useLessonEvents)();
    const isResourceView = currentView.startsWith('resource');
    return (<div>
      <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2">
        <div className="flex gap-8">
          <button_1.Button onClick={() => handleViewChange('resourceTimelineWeek')}>
            Resources
          </button_1.Button>
          <button_1.Button onClick={() => handleViewChange('timeGridWeek')}>
            vue grid
          </button_1.Button>
          <button_1.Button variant="outline" onClick={handleToday} className="font-medium">
            Aujourd'hui
          </button_1.Button>
          <button_group_1.ButtonGroup className="">
            <button_1.Button variant="outline" size="icon" onClick={handlePrev} className="h-8 w-10 rounded-r-none border-r">
              <lucide_react_1.ChevronLeft className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="outline" size="icon" onClick={handleNext} className="h-8 w-10 rounded-l-none">
              <lucide_react_1.ChevronRight className="h-4 w-4"/>
            </button_1.Button>
          </button_group_1.ButtonGroup>
        </div>

        <button_group_1.ButtonGroup className="flex justify-self-end">
          <button_1.Button onClick={() => handleViewChange(isResourceView ? 'resourceTimelineDay' : 'timeGridDay')} variant={(isResourceView && currentView === 'resourceTimelineDay') ||
            (!isResourceView && currentView === 'timeGridDay')
            ? 'default'
            : 'outline'}>
            Jour
          </button_1.Button>
          <button_group_1.ButtonGroupSeparator orientation="vertical"/>
          <button_1.Button onClick={() => handleViewChange(isResourceView ? 'resourceTimelineWeek' : 'timeGridWeek')} variant={(isResourceView && currentView === 'resourceTimelineWeek') ||
            (!isResourceView && currentView === 'timeGridWeek')
            ? 'default'
            : 'outline'}>
            Semaine
          </button_1.Button>
        </button_group_1.ButtonGroup>
      </div>
    </div>);
};
exports.CalendarHeader = CalendarHeader;
//# sourceMappingURL=calendar-header.js.map