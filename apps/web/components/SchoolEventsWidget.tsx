'use client';
import React, { useMemo, useState } from 'react';
import { endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin } from 'lucide-react';
import { useGetSchoolEventsQuery, useUserStore } from '@stackschool/ui';

const TYPE_BADGE_CLASS: Record<string, string> = {
  HOLIDAY: 'bg-amber-100 text-amber-700',
  MEETING: 'bg-slate-100 text-slate-700',
  EXAM: 'bg-rose-100 text-rose-700',
  ANNOUNCEMENT: 'bg-emerald-100 text-emerald-700',
  OTHER: 'bg-stone-100 text-stone-600',
};

const TYPE_LABEL_FR: Record<string, string> = {
  HOLIDAY: 'Congé',
  MEETING: 'Réunion',
  EXAM: 'Examen',
  ANNOUNCEMENT: 'Annonce',
  OTHER: 'Autre',
};

const TYPE_DOT_CLASS: Record<string, string> = {
  HOLIDAY: 'bg-amber-500',
  MEETING: 'bg-slate-500',
  EXAM: 'bg-rose-500',
  ANNOUNCEMENT: 'bg-emerald-500',
  OTHER: 'bg-stone-400',
};

export function SchoolEventsWidget() {
  const { currentSchool } = useUserStore();
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  const from = startOfMonth(month);
  const to = endOfMonth(month);

  const { data, isLoading } = useGetSchoolEventsQuery(
    { input: { schoolId: currentSchool?.id!, from, to } },
    { enabled: !!currentSchool?.id },
  );

  const events = data?.getSchoolEvent ?? [];

  // One entry per calendar day that has at least one event, for the dot
  // indicators — react-day-picker's `modifiers` needs a Date[] per bucket.
  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const e of events) {
      const key = format(new Date(e.startAt), 'yyyy-MM-dd');
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return map;
  }, [events]);

  const daysWithEvents = useMemo(
    () => [...eventsByDay.keys()].map((k) => new Date(k)),
    [eventsByDay],
  );

  // Upcoming list: either everything in the visible month (default) or just
  // the selected day's events once the user clicks a day.
  const listEvents = useMemo(() => {
    if (selectedDay) {
      return events.filter((e) => isSameDay(new Date(e.startAt), selectedDay));
    }
    const now = new Date();
    return events.filter((e) => new Date(e.startAt) >= now).slice(0, 5);
  }, [events, selectedDay]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Événements de l'école
        </h3>
      </div>

      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selectedDay}
        onSelect={setSelectedDay}
        locale={fr}
        modifiers={{ hasEvent: daysWithEvents }}
        modifiersClassNames={{ hasEvent: 'relative' }}
        components={{
          DayContent: ({ date }) => {
            const key = format(date, 'yyyy-MM-dd');
            const dayEvents = eventsByDay.get(key);
            return (
              <div className="relative flex h-full w-full items-center justify-center">
                {date.getDate()}
                {dayEvents && dayEvents.length > 0 && (
                  <span
                    className={
                      'absolute bottom-0.5 h-1 w-1 rounded-full ' +
                      TYPE_DOT_CLASS[dayEvents[0].type]
                    }
                  />
                )}
              </div>
            );
          },
        }}
        className="rounded-md border-0 p-0"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {selectedDay
              ? format(selectedDay, 'd MMMM', { locale: fr })
              : 'À venir'}
          </span>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(undefined)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {!isLoading && listEvents.length === 0 && (
          <p className="py-2 text-xs text-slate-400">Aucun événement.</p>
        )}

        {!isLoading &&
          listEvents.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-1 rounded-lg border border-stone-100 p-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-slate-800">
                  {e.title}
                </span>
                <Badge
                  className={
                    'shrink-0 text-[10px] font-normal ' +
                    TYPE_BADGE_CLASS[e.type]
                  }
                >
                  {TYPE_LABEL_FR[e.type]}
                </Badge>
              </div>
              <span className="text-xs text-slate-500">
                {format(
                  new Date(e.startAt),
                  e.allDay ? 'd MMM' : 'd MMM · HH:mm',
                  { locale: fr },
                )}
              </span>
              {e.location && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" /> {e.location}
                </span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
