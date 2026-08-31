'use client';
import React, { useEffect } from 'react';
import '@/app/styles/schedule-grid.css';
import TimeGrid, { renderEventContent } from '@/components/lists/time-grid';
import { Loader } from '@/components/ui/loader';
import { TimeGridContainer } from '@/components/lists/lesson/render-resource-content';
import { useLessonCalendar } from '@/components/lists/lesson/hooks/useLessonCalendar';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonEvents } from '@/components/lists/lesson/hooks/useLessonEvents';
import LessonDialog from '@/components/lists/lesson/lesson-dialog';
import LessonAlertDialog from '@/components/lists/lesson/lesson-alert-dialog';

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
    setIsClassOnly,
  } = useLessonStore();

  useEffect(() => {
    setIsClassOnly(true);
    resetAll();
    setResourceMode('TEACHER');
    setResource({ id, title: 'joseph' });
    setSelectedFilter({ type: 'TEACHER', id });
    setCurrentView('timeGridWeek');
  }, []);
  const { events, resources } = useLessonCalendar();

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
