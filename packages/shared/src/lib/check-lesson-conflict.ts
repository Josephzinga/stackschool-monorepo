import { getDay } from 'date-fns';
import { REFERENCE_DATE } from '../constants';

export interface Event {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  id?: string;
}

/**
 * Convertit "08:30" en 510 (8 * 60 + 30)
 */
export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convertir un événement en plage horaire absolue pour une semaine de référence
export const getEventDateTimeRange = (
  event: Event,
  referenceDate: Date = REFERENCE_DATE,
) => {
  // Trouver le prochain jour correspondant au daysOfWeek
  const eventDayOfWeek = event.daysOfWeek?.[0];
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

/**
 * Vérifie si deux plages horaires se chevauchent
 * Formule : Début1 < Fin2 ET Fin1 > Début2
 */
export const doRangesOverlap = (
  s1: string,
  e1: string,
  s2: string,
  e2: string,
): boolean => {
  return toMinutes(s1) < toMinutes(e2) && toMinutes(e1) > toMinutes(s2);
};

// Vérifier les conflits pour un nouvel événement
export const checkEventConflicts = (
  newEvent: Event,
  existingEvents: Event[],
  excludeEventId?: string,
): boolean => {
  // la date de reférence
  const newDay = newEvent.daysOfWeek?.[0];

  // Vérifier chaque événement existant
  for (const existingEvent of existingEvents) {
    // Ignorer l'événement lui-même si on modifie
    if (excludeEventId && existingEvent.id === excludeEventId) continue;

    // Vérifier si les jours correspondent
    const existingDay = existingEvent.daysOfWeek?.[0];

    if (newDay !== existingDay) continue;

    if (
      doRangesOverlap(
        newEvent.startTime,
        newEvent.endTime,
        existingEvent.startTime,
        existingEvent.endTime,
      )
    ) {
      return true; // Conflit trouvé
    }
  }

  return false; // Pas de conflit
};
