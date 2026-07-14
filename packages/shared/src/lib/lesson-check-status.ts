export const allowedTransitions = {
  PLANNED: ['ONGOING', 'CANCELLED', 'POSTPONED'],
  ONGOING: ['COMPLETED', 'CANCELLED'],
  POSTPONED: ['PLANNED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

type LessonStatus =
  | 'PLANNED'
  | 'ONGOING'
  | 'POSTPONED'
  | 'COMPLETED'
  | 'CANCELLED';

export function canTransition(current: LessonStatus | null, target: string) {
  if (!current) return;
  return allowedTransitions[current]?.includes(target as never);
}
