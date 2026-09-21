export function formatMinutes(totalSeconds: number): string {
  if (totalSeconds < 60) return "1 min";
  return `${Math.ceil(totalSeconds / 60)} mins`;
}
