'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@/app/styles/schedule-grid.css';
import TimeGrid, { renderEventContent } from '@/components/lists/time-grid';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import LessonDialog from '@/components/lists/lesson/lesson-dialog';
import { ResourceLabelContentArg } from '@fullcalendar/resource';
import { CalendarFilter } from '@/components/lists/lesson/calendar-filter';
import { useLessonEvents } from '@/components/lists/lesson/hooks/useLessonEvents';
import { useLessonFilters } from '@/components/lists/lesson/hooks/useLessonFilters';
import { useLessonCalendar } from '@/components/lists/lesson/hooks/useLessonCalendar';
import { useLessonStore } from '@/store/lesson-store';
import { useQueryClient } from '@tanstack/react-query';
import LessonAlertDialog from '@/components/lists/lesson/lesson-alert-dialog';
import { LoaderOne } from '@/components/ui/loader';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import {
  RenderResourceContent,
  TimeGridContainer,
} from '@/components/lists/lesson/render-resource-content';
import { ResourceMode } from '@stackschool/ui';

function LessonsListPage() {
  const [isDragging, setIsDragging] = useState(false);

  // SÉLECTEURS PRÉCIS (Empêche les re-renders inutiles)
  const isLoading = useLessonStore((s) => s.isLoading);
  const currentView = useLessonStore((s) => s.currentView);
  const pagination = useLessonStore((s) => s.pagination);
  const selectedFilter = useLessonStore((s) => s.selectedFilter);
  const lessonDialogOpen = useLessonStore((s) => s.lessonDialogOpen);

  const setSelectedFilter = useLessonStore((s) => s.setSelectedFilter);
  const setCurrentView = useLessonStore((s) => s.setCurrentView);
  const setTargetEventDrop = useLessonStore((s) => s.setTargetEventDrop);
  const setAlertOpen = useLessonStore((s) => s.setAlertOpen);
  const setPagination = useLessonStore((s) => s.setPagination);
  const setResourceMode = useLessonStore((s) => s.setResourceMode);
  const resetAll = useLessonStore((s) => s.resetAll);

  const {
    handleEventSelect,
    handleEventDrop,
    handleEventResize,
    handleEventClick,
    handleCalendarMount,
    calendarRef,
  } = useLessonEvents();

  const { resourceMode } = useLessonFilters();
  const queryClient = useQueryClient();
  const { resources, events } = useLessonCalendar();
  const renders = useRef(0);

  useEffect(() => {
    renders.current++;
    console.log('Rendu :', renders.current);
  });
  const isResourceView = currentView?.includes('resource');

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  const handleResourceClick = useCallback(
    (resourceId?: string) => {
      if (isResourceView && resourceId) {
        const newView = currentView.includes('Week')
          ? 'timeGridWeek'
          : 'timeGridDay';
        setSelectedFilter({ type: resourceMode, id: resourceId });
        setCurrentView(newView);
      }
    },
    [
      isResourceView,
      currentView,
      resourceMode,
      setSelectedFilter,
      setCurrentView,
    ],
  );

  const handleCancelUpdate = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
      setTargetEventDrop(null);
      setAlertOpen(false);
    }
  }, [calendarRef, setTargetEventDrop, setAlertOpen]);

  const handleEventDragStart = useCallback(() => setIsDragging(true), []);
  const handleEventDragStop = useCallback(() => setIsDragging(false), []);

  const handleSwitchMode = useCallback(
    (mode: ResourceMode) => {
      setSelectedFilter(null);
      const api = calendarRef.current?.getApi();
      if (api && api.view.type.toLowerCase().includes('timegrid')) {
        api.changeView('resourceTimelineWeek');
        setCurrentView('resourceTimelineWeek');
      }
      setResourceMode(mode);
    },
    [calendarRef, setSelectedFilter, setCurrentView, setResourceMode],
  );

  const renderResourceContent = useCallback(
    (info: ResourceLabelContentArg) => {
      return (
        <RenderResourceContent
          resource={info.resource}
          onClick={(r) => handleResourceClick(r.id)}
        />
      );
    },
    [handleResourceClick],
  );

  return (
    <div className="flex justify-center px-2 pt-2 w-full">
      <Card className="flex flex-col gap-2 md:gap-4 h-full! w-full">
        <CalendarFilter onModeChange={handleSwitchMode} />

        <CardContent className="px-1 h-full">
          {isLoading ? (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
              <LoaderOne />
            </div>
          ) : (
            <TimeGridContainer>
              <TimeGrid
                editable={true}
                initialView="resourceTimelineWeek"
                onEventSelect={handleEventSelect}
                ref={calendarRef}
                onEventClick={handleEventClick}
                resourceHeaderContent={
                  resourceMode === 'CLASS' ? 'Classes' : 'Enseignants'
                }
                events={events}
                resources={resources ?? undefined}
                showNavigation
                showViewButtons
                selectable
                onEventDrop={handleEventDrop}
                renderEventContent={renderEventContent}
                onEventResize={handleEventResize}
                onEventDragStart={handleEventDragStart}
                onEventDragStop={handleEventDragStop}
                onResourceClick={handleResourceClick}
                onViewChange={setCurrentView}
                onCalendarMount={handleCalendarMount}
                disabledTimeGrid={!selectedFilter}
                renderResourceContent={renderResourceContent}
                hasFilter={!!selectedFilter}
              />
            </TimeGridContainer>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col sm:flex-row items-center justify-between px-2 gap-4">
            <div className="text-sm text-muted-foreground">
              {pagination?.total} résultat(s)
            </div>

            <div className="flex items-center gap-4 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium hidden sm:block">Lignes</p>
                <Select
                  value={`${pagination?.limit}`}
                  onValueChange={(value) =>
                    setPagination({ ...pagination, limit: Number(value) })
                  }
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pagination?.limit} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 15, 20, 30].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pagination?.page! + 1} / {pagination?.totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: (pagination?.page || 0) - 1,
                    })
                  }
                  disabled={pagination?.page === 0}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: (pagination?.page || 0) + 1,
                    })
                  }
                  disabled={
                    pagination?.totalPages! <= (pagination?.page || 0) + 1
                  }
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog pour la création/édition - Monté conditionnellement */}
      {lessonDialogOpen && (
        <LessonDialog
          onSuccess={async () => {
            const calendarApi = calendarRef.current?.getApi();
            calendarApi?.refetchEvents();
            await queryClient.invalidateQueries({
              queryKey: ['getSchoolLessons'],
            });
          }}
        />
      )}
      <LessonAlertDialog onCancelUpdate={handleCancelUpdate} />
    </div>
  );
}

export default LessonsListPage;
