'use client';
import React, { useEffect } from 'react';
import '@/app/styles/schedule-grid.css';
import TimeGrid, { renderEventContent } from '@/components/school/time-grid';
import { useLessonEvents } from '@/components/school/lesson/hooks/useLessonEvents';
import LessonAlertDialog from '@/components/school/lesson/lesson-alert-dialog';
import LessonDialog from '@/components/school/lesson/lesson-dialog';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonCalendar } from '@/components/school/lesson/hooks/useLessonCalendar';

const ClassScheduleGrid = ({ classId }: { classId?: string }) => {
  const {
    handleEventClick,
    handleEventDrop,
    handleEventSelect,
    handleEventResize,
    calendarRef,
  } = useLessonEvents();
  const {
    setSelectedFilter,
    lessonDialogOpen,
    setIsClassOnly,
    resetAll,
    alertOpen,
    setResource,
  } = useLessonStore();
  const { events, resources } = useLessonCalendar();

  useEffect(() => {
    resetAll();
    setIsClassOnly(true);
    setSelectedFilter({ type: 'CLASS', id: classId! });
  }, []);
  useEffect(() => {
    if (resources && resources.length > 0)
      setResource({ id: resources[0]?.id, title: resources[0].title });
  }, [resources]);
  return (
    <div className="p-1 flex flex-col gap-4">
      <TimeGrid
        editable={true}
        selectable={true}
        ref={calendarRef}
        events={events}
        renderEventContent={renderEventContent}
        onEventClick={handleEventClick}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}
        onEventSelect={handleEventSelect}
        hideResourceViewButtons={true}
      />
      {lessonDialogOpen && (
        <LessonDialog onSuccess={() => console.log('success')} />
      )}
      {alertOpen && (
        <LessonAlertDialog onCancelUpdate={() => console.log('cancel')} />
      )}{' '}
    </div>
  );
};

export default ClassScheduleGrid;
