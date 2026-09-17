import React from 'react';
import { EventDisplayInfo } from '@fullcalendar/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { lessonStatusConfig } from '@/constant';
import { LessonStatus } from '@stackschool/ui';

// Domain-specific: knows about teachers, subjects, groups, lesson status.
// Lives here instead of inside TimeGrid so the generic calendar shell has
// no idea "lessons" exist — a different page (exam rooms, staff schedule...)
// would supply its own renderEventContent/eventClass pair instead of this one.

export const renderLessonEventContent = (eventInfo: EventDisplayInfo) => {
  const status = eventInfo.event.extendedProps.status as LessonStatus;
  const cfg = lessonStatusConfig[status] ?? lessonStatusConfig.PLANNED;
  const profile = eventInfo.event.extendedProps.teacher;
  const mode = eventInfo.event.extendedProps?.mode;
  const className = eventInfo.event.extendedProps?.groupName;
  const isDragging = eventInfo?.isDragging;

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-hidden gap-1 leading-tight p-1 transition-all',
        isDragging && 'opacity-80 scale-95 shadow-lg',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs truncate">
          {eventInfo.event.extendedProps.subject?.name}
        </span>
      </div>

      <div
        className={cn(
          'text-[10px] opacity-80 font-medium truncate',
          mode === 'TEACHER' && 'uppercase text-xs tracking-tight',
        )}
      >
        {mode === 'TEACHER'
          ? className
          : `${profile?.firstName} ${profile?.lastName}`}
      </div>

      <div className="mt-auto text-[10px] text-gray-700 font-mono">
        {eventInfo.timeText}
      </div>

      <div className="w-full flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            'flex items-center gap-0.5 text-[9px] font-semibold px-1 py-px',
            cfg.badgeClass,
          )}
        >
          {' '}
          <cfg.icon />
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
};

// Replaces the old hardcoded `eventClass="bg-red-500"` on TimeGrid, which
// painted every lesson red regardless of status and fought with the Badge
// above. This mirrors the status color on the event's outer element too,
// instead of only on the small badge inside it.
export const lessonEventClass = (arg: {
  event: { extendedProps: { status?: LessonStatus } };
}) => {
  const status = arg.event.extendedProps.status;
  const cfg = status ? lessonStatusConfig[status] : undefined;
  return cfg?.eventClass ? [cfg.eventClass] : [];
};
