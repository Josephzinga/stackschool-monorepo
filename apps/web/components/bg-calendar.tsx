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
      firstDay={1}
      height="400px"
      dayHeaderClassNames="bg-gray-200"
      viewClassNames="font-poppins"
      allDayClassNames={'bg-green-500'}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
    />
  );
}
