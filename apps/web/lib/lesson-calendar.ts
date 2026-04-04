import { getDay } from 'date-fns';
import { REFERENCE_DATE } from '@stackschool/shared';
import { EventInput } from '@fullcalendar/core';

// Convertir un événement en plage horaire absolue pour une semaine de référence
export const getEventDateTimeRange = (
  event: EventInput,
  referenceDate: Date = new Date(),
) => {
  // Trouver le prochain jour correspondant au daysOfWeek
  const eventDayOfWeek = event.daysOfWeek?.[0] ?? getDay(referenceDate);
  const currentDayOfWeek = getDay(referenceDate);

  // Calculer la différence de jours
  let daysToAdd = eventDayOfWeek - currentDayOfWeek;
  if (daysToAdd < 0) daysToAdd += 6; // Aller à la semaine prochaine si besoin

  // Créer la date de début
  const startDate = new Date(referenceDate);
  startDate.setDate(referenceDate.getDate() + daysToAdd);

  // Parser l'heure de début
  const [startHours, startMinutes] = event.startTime?.split(':') || [
    '00',
    '00',
  ];
  startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

  // Créer la date de fin
  const endDate = new Date(startDate);
  const [endHours, endMinutes] = event.endTime?.split(':') || ['00', '00'];
  endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

  return { startDate, endDate };
};

// Vérifier si deux plages horaires se chevauchent
export const doRangesOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean => {
  return start1 < end2 && end1 > start2;
};

// Vérifier les conflits pour un nouvel événement
export const checkEventConflicts = (
  newEvent: EventInput,
  existingEvents: EventInput[],
  excludeEventId?: string,
  specificDate?: Date,
): boolean => {
  // la date de reférence
  const referenceDate = specificDate || REFERENCE_DATE;

  // Obtenir la plage du nouvel événement
  const newRange = getEventDateTimeRange(newEvent, referenceDate);

  // Vérifier chaque événement existant
  for (const existingEvent of existingEvents) {
    // Ignorer l'événement lui-même si on modifie
    if (excludeEventId && existingEvent.id === excludeEventId) continue;

    // Vérifier si les jours correspondent
    const existingDayOfWeek = existingEvent.daysOfWeek?.[0];
    const newDayOfWeek = newEvent.daysOfWeek?.[0];

    if (existingDayOfWeek !== newDayOfWeek) continue;

    // Obtenir la plage de l'événement existant
    const existingRange = getEventDateTimeRange(existingEvent, referenceDate);

    // Vérifier le chevauchement
    if (
      doRangesOverlap(
        newRange.startDate,
        newRange.endDate,
        existingRange.startDate,
        existingRange.endDate,
      )
    ) {
      return true; // Conflit trouvé
    }
  }

  return false; // Pas de conflit
};
