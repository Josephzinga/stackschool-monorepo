export function toTimeOnly(hours: number, minutes: number): Date {
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
}

export function parseTimeString(time: string): Date {
  // "14:30" → Date avec date de référence fixe
  const [h, m] = time.split(':').map(Number);
  return toTimeOnly(h, m);
}
