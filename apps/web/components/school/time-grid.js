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
exports.renderEventContent = void 0;
const react_1 = __importDefault(require("@fullcalendar/react"));
const daygrid_1 = __importDefault(require("@fullcalendar/daygrid"));
const timegrid_1 = __importDefault(require("@fullcalendar/timegrid"));
const interaction_1 = __importDefault(require("@fullcalendar/interaction"));
const resource_timeline_1 = __importDefault(require("@fullcalendar/resource-timeline"));
const fr_1 = __importDefault(require("@fullcalendar/core/locales/fr"));
const react_2 = __importStar(require("react"));
require("@/app/styles/schedule-grid.css");
const constant_1 = require("@/constant");
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const loader_1 = require("@/components/ui/loader");
const time_grid_header_1 = require("@/components/school/lesson/time-grid-header");
const utils_1 = require("@/lib/utils");
const badge_1 = require("@/components/ui/badge");
const TimeGrid = (0, react_2.forwardRef)(({ events, renderEventContent, onDatesSet, onEventClick, editable = false, selectable = false, onEventDrop, onEventSelect, initialView = 'timeGridWeek', resources, resourceHeaderContent, slotLabelFormat, onEventResize, onEventDragStart, onEventDragStop, onResourceClick, onCalendarMount, showViewButtons, showNavigation, hideResourceViewButtons, onViewChange, disabledTimeGrid, renderResourceContent, hasFilter, }, ref) => {
    const [currentDateTitle, setCurrentDateTitle] = (0, react_2.useState)('');
    const [currentView, setCurrentView] = (0, react_2.useState)(initialView || 'resourceTimelineWeek');
    const calendarRef = (0, react_2.useRef)(null);
    const { currentSchool } = (0, ui_1.useUserStore)();
    const { data, isPending } = (0, ui_1.useGetSchoolSettingsQuery)({
        schoolId: currentSchool?.id,
    }, { enabled: !!currentSchool?.id });
    const startHour = data?.school.settings?.startHour || '08';
    const endHour = data?.school.settings?.endHour || '18';
    const duration = data?.school.settings?.lessonDuration || '60';
    const daysOfWeek = data?.school.settings?.daysOfWeek?.map((day) => shared_1.dayMapping[day]) || [1, 2, 3, 4, 5];
    (0, react_2.useImperativeHandle)(ref, () => calendarRef.current);
    const handlePrev = (0, react_2.useCallback)(() => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.prev();
            setCurrentView(api?.view.type);
            onViewChange?.(api.view.type);
        }
    }, []);
    const handleViewChange = (0, react_2.useCallback)((view) => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.changeView(view);
            setCurrentView(api?.view.type);
            onViewChange?.(api.view.type);
        }
    }, []);
    const handleNext = (0, react_2.useCallback)(() => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.next();
        }
    }, []);
    const handleToday = (0, react_2.useCallback)(() => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.today();
            setCurrentView(api?.view.type);
        }
    }, []);
    if (isPending) {
        return (<div className="w-full min-h-[70vh] flex justify-center items-center">
          <loader_1.LoaderOne />
        </div>);
    }
    const isResourceView = currentView?.startsWith('resource');
    return (<div className="w-full">
        {showNavigation !== false && (<time_grid_header_1.TimeGridHeader onPrev={handlePrev} onNext={handleNext} onToday={handleToday} currentView={currentView} isResourceView={isResourceView} showViewButtons={showViewButtons} showNavigation={showNavigation} onChangeView={handleViewChange} disableNonResourceViews={disabledTimeGrid} hideResourceViewButtons={hideResourceViewButtons} currentDateTitle={new Date().toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
            })}/>)}
        <div className="h-full w-full rounded-lg border bg-card overflow-hidden">
          <react_1.default ref={calendarRef} plugins={[
            daygrid_1.default,
            timegrid_1.default,
            interaction_1.default,
            resource_timeline_1.default,
        ]} initialView={initialView} locale={fr_1.default} resources={resources} eventContent={renderEventContent} eventBorderColor="black" eventClassNames="rounded-[6px]!" events={events} height="auto" eventDragStart={onEventDragStart} slotMinTime={`${startHour}:00:00`} slotMaxTime={`${endHour}:00:00`} eventDragMinDistance={5} eventResizableFromStart={true} eventDurationEditable={true} eventStartEditable={true} selectLongPressDelay={300} slotLabelFormat={slotLabelFormat} resourceLabelContent={renderResourceContent} headerToolbar={false} businessHours={{
            daysOfWeek,
            startTime: `${startHour}:00`,
            endTime: `${endHour}:00`,
        }} selectOverlap={false} eventConstraint={{
            start: `${startHour}:00`,
            end: '12:00',
        }} slotLabelClassNames="text-muted-foreground text-sm font-medium" dayHeaderClassNames="text-foreground font-semibold py-2 border-none h-10!" resourceLabelClassNames="bg-gray-200 dark:bg-gray-900/80!" resourceAreaWidth={'15%'} weekends={false} allDaySlot={false} nowIndicator={true} slotDuration={`00:${duration}:00`} firstDay={1} slotMinWidth={100} lazyFetching resourceAreaHeaderContent={resourceHeaderContent} editable={editable} selectable={selectable} selectMirror={true} datesSet={(info) => setCurrentDateTitle(info.view.title)} eventClick={onEventClick} eventDrop={onEventDrop} eventDragStop={onEventDragStop} select={onEventSelect} eventResize={onEventResize} slotLaneClassNames={(arg) => {
            const hour = arg.date?.getHours();
            if (hour === 12) {
                return 'bg-gray-700/70 line-through text-muted-foreground/50';
            }
            return '';
        }}/>
        </div>
      </div>);
});
exports.default = TimeGrid;
const renderEventContent = (eventInfo) => {
    const status = eventInfo.event.extendedProps.status;
    const cfg = constant_1.lessonStatusConfig[status] ?? constant_1.lessonStatusConfig.PLANNED;
    const profile = eventInfo.event.extendedProps.teacher;
    const mode = eventInfo.event.extendedProps?.mode;
    const className = eventInfo.event.extendedProps?.groupName;
    const isDragging = eventInfo?.isDragging;
    return (<div className={(0, utils_1.cn)('flex flex-col h-full overflow-hidden gap-1 leading-tight p-1 transition-all', isDragging && 'opacity-80 scale-95 shadow-lg')}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs truncate">
          {eventInfo.event.extendedProps.subject?.name}
        </span>
      </div>

      <div className={(0, utils_1.cn)('text-[10px] opacity-80 font-medium truncate', mode === 'TEACHER' && 'uppercase text-xs tracking-tight')}>
        {mode === 'TEACHER'
            ? className
            : `${profile?.firstname} ${profile?.lastname}`}
      </div>

      <div className="mt-auto text-[10px] text-gray-700 font-mono">
        {eventInfo.timeText}
      </div>

      <div className="w-full flex justify-end">
        <badge_1.Badge variant="outline" className={(0, utils_1.cn)('flex items-center gap-0.5 text-[9px] font-semibold px-1 py-px', cfg.badgeClass)}>
          {' '}
          <cfg.icon />
          {cfg.label}
        </badge_1.Badge>
      </div>
    </div>);
};
exports.renderEventContent = renderEventContent;
//# sourceMappingURL=time-grid.js.map