/**
 * Converts an ISO date string to a UNIX timestamp (seconds since epoch)
 * @param isoString - The ISO date string to convert
 * @returns The UNIX timestamp in seconds, or null if the input is invalid
 */
export function isoToUnixTimestamp(isoString: string): number | null {
  try {
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    // Convert to UNIX timestamp (seconds since epoch)
    return Math.floor(date.getTime() / 1000);
  } catch (error) {
    return null;
  }
}

/**
 * Converts a UNIX timestamp (seconds since epoch) to an ISO date string
 * @param unixTimestamp - The UNIX timestamp in seconds
 * @returns The ISO date string, or null if the input is invalid
 */
export function unixTimestampToIso(unixTimestamp: number): string | null {
  try {
    // Check if the timestamp is valid (positive number)
    if (unixTimestamp < 0 || !Number.isFinite(unixTimestamp)) {
      return null;
    }

    // Convert to milliseconds and create Date object
    const date = new Date(unixTimestamp * 1000);

    // Return ISO string
    return date.toISOString();
  } catch (error) {
    return null;
  }
}

/**
 * Validates if a string is a valid ISO date string
 * @param isoString - The string to validate
 * @returns True if the string is a valid ISO date string, false otherwise
 */
export function isValidIsoString(isoString: string): boolean {
  try {
    const date = new Date(isoString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
}

/**
 * Gets the current UNIX timestamp in seconds
 * @returns The current UNIX timestamp
 */
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
