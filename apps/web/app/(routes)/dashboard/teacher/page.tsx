'use client';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const events = [
  {
    title: 'Mathématiques',
    start: '2025-01-22T08:00:00',
    end: '2025-01-22T10:00:00',
  },
  {
    title: 'Physique',
    start: '2025-01-23T10:00:00',
    end: '2025-01-23T12:00:00',
  },
];

export function Timetable() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
      editable={false}
      selectable={false}
      allDaySlot={false}
      slotMinTime="07:00:00"
      slotMaxTime="18:00:00"
      height="auto"
    />
  );
}

export default function TeacherDashboard() {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Timetable />
            {/*  <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />

          */}
          </div>
        </div>
      </div>
    </div>
  );
}
