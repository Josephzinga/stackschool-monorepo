import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../app/styles/calendar.css';
export default function CalendarDisplay() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="fr"
      height="auto"
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
    />
  );
}
