// Test helper utilities

/**
 * Creates a mock console that captures output
 */
export function createMockConsole() {
  const logs: string[] = [];
  const errors: string[] = [];
  const warns: string[] = [];

  const mockConsole = {
    log: (...args: any[]) => logs.push(args.join(" ")),
    error: (...args: any[]) => errors.push(args.join(" ")),
    warn: (...args: any[]) => warns.push(args.join(" ")),
    getLogs: () => [...logs],
    getErrors: () => [...errors],
    getWarns: () => [...warns],
    clear: () => {
      logs.length = 0;
      errors.length = 0;
      warns.length = 0;
    },
  };

  return mockConsole;
}

/**
 * Waits for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a test ISO string for a specific date
 */
export function createTestIsoString(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): string {
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toISOString();
}

/**
 * Creates a test UNIX timestamp for a specific date
 */
export function createTestUnixTimestamp(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): number {
  const date = new Date(year, month - 1, day, hour, minute, second);
  return Math.floor(date.getTime() / 1000);
}
