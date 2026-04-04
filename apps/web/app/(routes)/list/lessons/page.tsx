'use client';

import React, {useState} from 'react';
import '@/app/styles/schedule-grid.css';
import TimeGrid, {renderEventContent} from '@/components/school/time-grid';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {motion} from 'motion/react';
import LessonDialog from '@/components/school/lesson/lesson-dialog';
import {ResourceLabelContentArg} from '@fullcalendar/resource';
import {CalendarFilter} from '@/components/school/lesson/calendar-filter';
import {useLessonEvents} from '@/components/school/lesson/hooks/useLessonEvents';
import {useLessonFilters} from '@/components/school/lesson/hooks/useLessonFilters';
import {useLessonCalendar} from '@/components/school/lesson/hooks/useLessonCalendar';
import {useLessonStore} from '@/store/lesson-store';
import {useQueryClient} from '@tanstack/react-query';
import LessonAlertDialog from '@/components/school/lesson/lesson-alert-dialog';
import {LoaderOne} from '@/components/ui/loader';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {RenderResourceContent} from '@/components/school/lesson/render-resource-content';

function LessonsListPage() {
  const [isDragging, setIsDragging] = useState(false);

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
  const { isError, resources, events } = useLessonCalendar();
  const {
    selectedLessonData,
    setSelectedFilter,
    setCurrentView,
    isLoading,
    currentView,
    setTargetEventDrop,
    setAlertOpen,
    setPagination,
    pagination,
    selectedFilter,
  } = useLessonStore();
  const isResourceView = currentView?.includes('resource');
  const handleResourceClick = (resourceId?: string) => {
    if (isResourceView && resourceId) {
      const newView = currentView.includes('Week')
        ? 'timeGridWeek'
        : 'timeGridDay';
      setSelectedFilter({ type: resourceMode, id: resourceId });
      setCurrentView(newView);
    }
  };

  const handleCancelUpdate = () => {
    // Revert les changements dans le calendrier

    const calendarApi = calendarRef.current?.getApi();
    console.log('cancel update', calendarApi);
    if (calendarApi) {
      console.log('cancel update condition');
      calendarApi.refetchEvents();
      setTargetEventDrop(null);
      setAlertOpen(false);
    } // Rafraîchir pour revenir à l'état original
  };

  // Handler pour le début du drag
  const handleEventDragStart = () => {
    setIsDragging(true);
  };

  // Handler pour la fin du drag
  const handleEventDragStop = () => {
    console.log('handle events drop');
    setIsDragging(false);
  };
  const renderResourceContent = (info: ResourceLabelContentArg) => {
    return (
      <RenderResourceContent
        resource={info.resource}
        onClick={(r) => {
          console.log(
            'resource clicked',
            info.resource,
            '\t',
            r.id,
            'isREsource',
            isResourceView,
          );
          handleResourceClick(r.id);
        }}
      />
    );
  };

  return (
    <div className="flex-1 flex justify-centerpx-2 py-4 sm:px-4 md:px-6">
      <Card className="flex flex-col gap-2 md:gap-4 w-full">
        <CalendarFilter />

        <CardContent className="px-1 h-full">
          {isLoading ? (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
              <LoaderOne />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: 'linear' as const,
              }}
            >
              <TimeGrid
                editable={true}
                initialView="resourceTimelineWeek"
                onEventSelect={handleEventSelect}
                ref={calendarRef}
                onEventClick={handleEventClick}
                resourceHeaderContent={
                  resourceMode === 'CLASS' ? 'Classes' : 'Enseignent'
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
                onViewChange={(view) => {
                  setCurrentView(view);
                }}
                onCalendarMount={handleCalendarMount}
                disabledTimeGrid={!selectedFilter}
                renderResourceContent={renderResourceContent}
              />
            </motion.div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col sm:flex-row items-center justify-between px-2 gap-4">
            <div>{pagination?.total} résultat (s)</div>

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
                {pagination?.totalPages} / {pagination?.page! + 1}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const page =
                      typeof pagination?.page === 'number'
                        ? pagination?.page! - 1
                        : 0;
                    setPagination({
                      ...pagination,
                      page,
                    });
                  }}
                  disabled={false}
                >
                  <span className="sr-only">Précédent</span>
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const page = pagination?.page! + 1;
                    setPagination({
                      ...pagination,
                      page,
                    });
                  }}
                  disabled={pagination?.totalPages! <= pagination?.page! + 1}
                >
                  <span className="sr-only">Suivant</span>
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog pour la création/édition */}
      <LessonDialog
        key={
          (selectedLessonData?.mode === 'UPDATE'
            ? selectedLessonData?.args.event.start?.toString()
            : selectedLessonData?.args.start?.toString()) || 'new'
        }
        onSuccess={async () => {
          // Rafraîchir le calendrier après création/édition
          const calendarApi = calendarRef.current?.getApi();
          calendarApi?.refetchEvents();
          await queryClient.invalidateQueries({
            queryKey: ['getSchoolLessons'],
          });
        }}
      />
      <LessonAlertDialog onCancelUpdate={handleCancelUpdate} />
    </div>
  );
}


export default LessonsListPage;
