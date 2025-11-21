// src/cap/scheduler/backoff.util.ts
export function expJitter(
  attempt: number,
  baseMs = 1_000, // 1 s first retry
  maxMs = 5 * 60_000, // 5 min cap
): number {
  const expo = baseMs * 2 ** attempt;
  const rand = Math.floor(Math.random() * baseMs);
  return Math.min(expo + rand, maxMs);
}
