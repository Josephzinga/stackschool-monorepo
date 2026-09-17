'use client';
// app/dashboard/.../lessons/lesson-time-grid.tsx — example wrapper.
// This is where the school-settings fetch that used to live inside TimeGrid
// now belongs: it's specific to "lessons need school hours", not something
// every future TimeGrid consumer should be forced to also fetch.

import { useGetSchoolSettingsQuery, useUserStore } from '@stackschool/ui';
import { dayMapping } from '@stackschool/contracts';
import { LoaderOne } from '@/components/ui/loader';
import TimeGrid from '@/components/lists/lesson/TimeGrid'; // the generic component
import { renderLessonEventContent } from './lesson-event-content';

// Pass through whatever TimeGrid props this page actually needs.
type LessonTimeGridProps = Omit<
  React.ComponentProps<typeof TimeGrid>,
  | 'renderEventContent'
  | 'eventClass'
  | 'businessHours'
  | 'slotMinTime'
  | 'slotMaxTime'
  | 'slotDuration'
  | 'eventConstraint'
>;

export function LessonTimeGrid(props: LessonTimeGridProps) {
  const { currentSchool } = useUserStore();
  const { data, isPending, isError } = useGetSchoolSettingsQuery(
    { schoolId: currentSchool?.id! },
    { enabled: !!currentSchool?.id },
  );

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <LoaderOne />
      </div>
    );
  }

  if (isError) {
    // Previously silent: a failed schoolSettings fetch just fell back to
    // hardcoded defaults forever, with no visible indication anything was
    // wrong. Surface it instead — even a plain message beats an
    // unexplained 8am–6pm grid that doesn't match the school's real hours.
    return (
      <p className="p-4 text-sm text-rose-600">
        Impossible de charger les horaires de l'école. Réessayez.
      </p>
    );
  }

  const startHour = data?.school.settings?.startHour || '08';
  const endHour = data?.school.settings?.endHour || '18';
  const duration = data?.school.settings?.lessonDuration || '60';
  const daysOfWeek = data?.school.settings?.daysOfWeek?.map(
    (day) => dayMapping[day!],
  ) || [1, 2, 3, 4, 5];

  return (
    <TimeGrid
      {...props}
      renderEventContent={renderLessonEventContent}

      businessHours={{
        daysOfWeek,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
      }}
      slotMinTime={`${startHour}:00:00`}
      slotMaxTime={`${endHour}:00:00`}
      slotDuration={`00:${duration}:00`}
      eventConstraint={{
        start: `${startHour}:00`,
        end: `${endHour}:00`, // fixed: was hardcoded to '12:00' regardless of endHour
      }}
    />
  );
}
