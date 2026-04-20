import { Lesson } from '../graphql/types.generated';

export const getWeeklyHours = (lessons: Lesson[]) => {
  let totalMinutes = 0;
  lessons.forEach((l) => {
    const diffMs =
      l.endTime.getHours() * 60 +
      l.endTime.getMinutes() -
      (l.startTime.getHours() * 60 + l.endTime.getMinutes());
    totalMinutes += diffMs;
  });
  return parseFloat((totalMinutes / 60).toFixed(1));
};
