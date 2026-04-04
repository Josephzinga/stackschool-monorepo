'use client';
import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLessonStore } from '@/store/lesson-store';

import React from 'react';
import { useLessonEvents } from './hooks/useLessonEvents';

export const CalendarHeader = () => {
  const { currentView } = useLessonStore();

  const { handlePrev, handleNext, handleToday, handleViewChange } =
    useLessonEvents();

  const isResourceView = currentView.startsWith('resource');

  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-between gap-4 bg-card p-2">
        <div className="flex gap-8">
          <Button onClick={() => handleViewChange('resourceTimelineWeek')}>
            Resources
          </Button>
          <Button onClick={() => handleViewChange('timeGridWeek')}>
            vue grid
          </Button>
          <Button
            variant="outline"
            onClick={handleToday}
            className="font-medium"
          >
            Aujourd'hui
          </Button>
          <ButtonGroup className="">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-10 rounded-r-none border-r"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-10 rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>

        <ButtonGroup className="flex justify-self-end">
          <Button
            onClick={() =>
              handleViewChange(
                isResourceView ? 'resourceTimelineDay' : 'timeGridDay',
              )
            }
            variant={
              (isResourceView && currentView === 'resourceTimelineDay') ||
              (!isResourceView && currentView === 'timeGridDay')
                ? 'default'
                : 'outline'
            }
          >
            Jour
          </Button>
          <ButtonGroupSeparator orientation="vertical" />
          <Button
            onClick={() =>
              handleViewChange(
                isResourceView ? 'resourceTimelineWeek' : 'timeGridWeek',
              )
            }
            variant={
              (isResourceView && currentView === 'resourceTimelineWeek') ||
              (!isResourceView && currentView === 'timeGridWeek')
                ? 'default'
                : 'outline'
            }
          >
            Semaine
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
