'use client';
import React, { useEffect } from 'react';
import '@/app/styles/schedule-grid.css';
import TimeGrid, { renderEventContent } from '@/components/school/time-grid';
import { Loader } from '@/components/ui/loader';
import { TimeGridContainer } from '@/components/school/lesson/render-resource-content';
import { useLessonCalendar } from '@/components/school/lesson/hooks/useLessonCalendar';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonEvents } from '@/components/school/lesson/hooks/useLessonEvents';
import LessonDialog from '@/components/school/lesson/lesson-dialog';
import LessonAlertDialog from '@/components/school/lesson/lesson-alert-dialog';

const TeacherScheduleGrid = ({ id }: { id: string }) => {
  const {
    handleEventSelect,
    handleEventResize,
    handleEventDrop,
    handleEventClick,
    calendarRef,
  } = useLessonEvents();
  const {
    setSelectedFilter,
    resetAll,
    setCurrentView,
    setResource,
    isLoading,
    lessonDialogOpen,
    alertOpen,
    setResourceMode,
  } = useLessonStore();

  useEffect(() => {
    resetAll();
    setResourceMode('TEACHER');
    setCurrentView('timeGridWeek');
    setSelectedFilter({ type: 'TEACHER', id });
  }, []);
  const { events, resources } = useLessonCalendar();
  useEffect(() => {
    if (resources && resources.length > 0)
      setResource({ id: resources?.[0]?.id, title: resources?.[0]?.title });
  }, [resources, lessonDialogOpen]);
  console.log('Rendre');
  return (
    <div className="p-4 flex flex-col gap-4">
      {isLoading ? (
        <Loader />
      ) : (
        <TimeGridContainer>
          <TimeGrid
            ref={calendarRef}
            selectable={true}
            editable={true}
            hideResourceViewButtons={true}
            events={events}
            initialView="timeGridWeek"
            renderEventContent={renderEventContent}
            onEventSelect={handleEventSelect}
            onEventResize={handleEventResize}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        </TimeGridContainer>
      )}
      {lessonDialogOpen && (
        <LessonDialog onSuccess={() => console.log('success')} />
      )}
      {alertOpen && (
        <LessonAlertDialog onCancelUpdate={() => console.log('cancel')} />
      )}{' '}
    </div>
  );
};

export default TeacherScheduleGrid;
