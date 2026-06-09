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
const card_1 = require("@/components/ui/card");
const lesson_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-dialog"));
const calendar_filter_1 = require("@/components/school/lesson/calendar-filter");
const useLessonEvents_1 = require("@/components/school/lesson/hooks/useLessonEvents");
const useLessonFilters_1 = require("@/components/school/lesson/hooks/useLessonFilters");
const useLessonCalendar_1 = require("@/components/school/lesson/hooks/useLessonCalendar");
const lesson_store_1 = require("@/store/lesson-store");
const react_query_1 = require("@tanstack/react-query");
const lesson_alert_dialog_1 = __importDefault(require("@/components/school/lesson/lesson-alert-dialog"));
const loader_1 = require("@/components/ui/loader");
const select_1 = require("@/components/ui/select");
const button_1 = require("@/components/ui/button");
const icons_react_1 = require("@tabler/icons-react");
const render_resource_content_1 = require("@/components/school/lesson/render-resource-content");
function LessonsListPage() {
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const isLoading = (0, lesson_store_1.useLessonStore)((s) => s.isLoading);
    const currentView = (0, lesson_store_1.useLessonStore)((s) => s.currentView);
    const pagination = (0, lesson_store_1.useLessonStore)((s) => s.pagination);
    const selectedFilter = (0, lesson_store_1.useLessonStore)((s) => s.selectedFilter);
    const lessonDialogOpen = (0, lesson_store_1.useLessonStore)((s) => s.lessonDialogOpen);
    const setSelectedFilter = (0, lesson_store_1.useLessonStore)((s) => s.setSelectedFilter);
    const setCurrentView = (0, lesson_store_1.useLessonStore)((s) => s.setCurrentView);
    const setTargetEventDrop = (0, lesson_store_1.useLessonStore)((s) => s.setTargetEventDrop);
    const setAlertOpen = (0, lesson_store_1.useLessonStore)((s) => s.setAlertOpen);
    const setPagination = (0, lesson_store_1.useLessonStore)((s) => s.setPagination);
    const setResourceMode = (0, lesson_store_1.useLessonStore)((s) => s.setResourceMode);
    const resetAll = (0, lesson_store_1.useLessonStore)((s) => s.resetAll);
    const { handleEventSelect, handleEventDrop, handleEventResize, handleEventClick, handleCalendarMount, calendarRef, } = (0, useLessonEvents_1.useLessonEvents)();
    const { resourceMode } = (0, useLessonFilters_1.useLessonFilters)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { resources, events } = (0, useLessonCalendar_1.useLessonCalendar)();
    const renders = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        renders.current++;
        console.log('Rendu :', renders.current);
    });
    const isResourceView = currentView?.includes('resource');
    (0, react_1.useEffect)(() => {
        resetAll();
    }, [resetAll]);
    const handleResourceClick = (0, react_1.useCallback)((resourceId) => {
        if (isResourceView && resourceId) {
            const newView = currentView.includes('Week')
                ? 'timeGridWeek'
                : 'timeGridDay';
            setSelectedFilter({ type: resourceMode, id: resourceId });
            setCurrentView(newView);
        }
    }, [
        isResourceView,
        currentView,
        resourceMode,
        setSelectedFilter,
        setCurrentView,
    ]);
    const handleCancelUpdate = (0, react_1.useCallback)(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.refetchEvents();
            setTargetEventDrop(null);
            setAlertOpen(false);
        }
    }, [calendarRef, setTargetEventDrop, setAlertOpen]);
    const handleEventDragStart = (0, react_1.useCallback)(() => setIsDragging(true), []);
    const handleEventDragStop = (0, react_1.useCallback)(() => setIsDragging(false), []);
    const handleSwitchMode = (0, react_1.useCallback)((mode) => {
        setSelectedFilter(null);
        const api = calendarRef.current?.getApi();
        if (api && api.view.type.toLowerCase().includes('timegrid')) {
            api.changeView('resourceTimelineWeek');
            setCurrentView('resourceTimelineWeek');
        }
        setResourceMode(mode);
    }, [calendarRef, setSelectedFilter, setCurrentView, setResourceMode]);
    const renderResourceContent = (0, react_1.useCallback)((info) => {
        return (<render_resource_content_1.RenderResourceContent resource={info.resource} onClick={(r) => handleResourceClick(r.id)}/>);
    }, [handleResourceClick]);
    return (<div className="flex justify-center px-2 pt-2 w-full">
      <card_1.Card className="flex flex-col gap-2 md:gap-4 h-full! w-full">
        <calendar_filter_1.CalendarFilter onModeChange={handleSwitchMode}/>

        <card_1.CardContent className="px-1 h-full">
          {isLoading ? (<div className="w-full min-h-[70vh] flex justify-center items-center">
              <loader_1.LoaderOne />
            </div>) : (<render_resource_content_1.TimeGridContainer>
              <time_grid_1.default editable={true} initialView="resourceTimelineWeek" onEventSelect={handleEventSelect} ref={calendarRef} onEventClick={handleEventClick} resourceHeaderContent={resourceMode === 'CLASS' ? 'Classes' : 'Enseignants'} events={events} resources={resources ?? undefined} showNavigation showViewButtons selectable onEventDrop={handleEventDrop} renderEventContent={time_grid_1.renderEventContent} onEventResize={handleEventResize} onEventDragStart={handleEventDragStart} onEventDragStop={handleEventDragStop} onResourceClick={handleResourceClick} onViewChange={setCurrentView} onCalendarMount={handleCalendarMount} disabledTimeGrid={!selectedFilter} renderResourceContent={renderResourceContent} hasFilter={!!selectedFilter}/>
            </render_resource_content_1.TimeGridContainer>)}
        </card_1.CardContent>
        <card_1.CardFooter>
          <div className="flex w-full flex-col sm:flex-row items-center justify-between px-2 gap-4">
            <div className="text-sm text-muted-foreground">
              {pagination?.total} résultat(s)
            </div>

            <div className="flex items-center gap-4 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium hidden sm:block">Lignes</p>
                <select_1.Select value={`${pagination?.limit}`} onValueChange={(value) => setPagination({ ...pagination, limit: Number(value) })}>
                  <select_1.SelectTrigger className="h-8 w-[70px]">
                    <select_1.SelectValue placeholder={pagination?.limit}/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent side="top">
                    {[5, 10, 15, 20, 30].map((pageSize) => (<select_1.SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pagination?.page + 1} / {pagination?.totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button_1.Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPagination({
            ...pagination,
            page: (pagination?.page || 0) - 1,
        })} disabled={pagination?.page === 0}>
                  <icons_react_1.IconChevronLeft className="h-4 w-4"/>
                </button_1.Button>
                <button_1.Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPagination({
            ...pagination,
            page: (pagination?.page || 0) + 1,
        })} disabled={pagination?.totalPages <= (pagination?.page || 0) + 1}>
                  <icons_react_1.IconChevronRight className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </div>
          </div>
        </card_1.CardFooter>
      </card_1.Card>

      
      {lessonDialogOpen && (<lesson_dialog_1.default onSuccess={async () => {
                const calendarApi = calendarRef.current?.getApi();
                calendarApi?.refetchEvents();
                await queryClient.invalidateQueries({
                    queryKey: ['getSchoolLessons'],
                });
            }}/>)}
      <lesson_alert_dialog_1.default onCancelUpdate={handleCancelUpdate}/>
    </div>);
}
exports.default = LessonsListPage;
//# sourceMappingURL=page.js.map