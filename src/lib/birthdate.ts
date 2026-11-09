/**
 * A date picker can emit an empty value on the first open, before the
 * chosen day is committed. Keep the date we already have.
 */
export function nextBirthdateValue(current: string, incoming: string): string {
  const next = incoming.trim();
  if (!next) return current;
  return next;
}
