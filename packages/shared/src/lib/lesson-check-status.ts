import { LessonStatus } from '@stackschool/db';

export const allowedTransitions = {
  PLANNED: ['ONGOING', 'CANCELLED', 'POSTPONED'],
  ONGOING: ['COMPLETED', 'CANCELLED'],
  POSTPONED: ['PLANNED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition(current: LessonStatus | null, target: string) {
  if (!current) return;
  return allowedTransitions[current]?.includes(target as never);
}
