/**
 * Wait for a condition to become true, with timeout.
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeoutMs = 5000,
  intervalMs = 100,
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await condition()) {
      return;
    }
    await sleep(intervalMs);
  }

  throw new Error(`Condition not met within ${timeoutMs}ms`);
}

/**
 * Sleep for a specified duration.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for the next scheduler tick.
 * Useful for integration tests with cron jobs.
 */
export async function waitForScheduler(delayMs = 100): Promise<void> {
  await sleep(delayMs);
}
