'use client';

import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/react/daygrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import themesPlugin from '@fullcalendar/react/themes/monarch';
import '@/app/styles/calendar.css';
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css';
import frLocale from '@fullcalendar/react/locales/fr';

export default function CalendarDisplay() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, themesPlugin]}
      initialView="dayGridMonth"
      locale={frLocale}
      firstDay={1}
      nowIndicator={true}
      editable={true}
      className="w-full text-xs"
      height="400px"
      events={[
        {
          id: 'joseph',
          start: new Date(),
          end: new Date().setDate(new Date().getDate() + 1),
          title: 'Joseph',
        },
      ]}
      titleFormat={{
        day: '2-digit',
      }}
      dateClick={(info) => {
        console.log('Date click: ', info);
      }}
      eventTimeClass="bg-red-500"
      eventContent={(info) => {
        return (
          <div className="bg-cyan-600 h-full w-full">{info.event.title}</div>
        );
      }}
      headerToolbarClass="bg-red-500"
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
      dayHeaderFormat={{
        day: 'numeric',
      }}
      toolbarTitleClass="text-xs text-red-500"
      allDayHeaderContent={() => <div>Bon</div>}
      dayHeaderContent={(info) => <div>{info.text}</div>}
      dayCellTopContent={(info) => <div>{info.text}</div>}
      eventClass="rounded-md shadow-sm text-xs px-1 cursor-pointer"
    />
  );
}
