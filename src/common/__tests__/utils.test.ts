import {
  getCurrentUnixTimestamp,
  isoToUnixTimestamp,
  isValidIsoString,
  unixTimestampToIso,
} from "../utils";

describe("Timestamp Conversion Utilities", () => {
  describe("isoToUnixTimestamp", () => {
    it("should convert valid ISO string to UNIX timestamp", () => {
      const isoString = "2024-01-15T10:30:00.000Z";
      const expectedTimestamp = 1705314600;

      const result = isoToUnixTimestamp(isoString);

      expect(result).toBe(expectedTimestamp);
    });

    it("should return null for invalid ISO string", () => {
      const invalidIso = "invalid-date-string";

      const result = isoToUnixTimestamp(invalidIso);

      expect(result).toBeNull();
    });

    it("should handle empty string", () => {
      const result = isoToUnixTimestamp("");

      expect(result).toBeNull();
    });

    it("should handle various ISO formats", () => {
      const testCases = [
        { input: "2024-01-15T10:30:00Z", expected: 1705314600 },
        { input: "2024-01-15T10:30:00.123Z", expected: 1705314600 },
        { input: "2024-01-15T10:30:00+00:00", expected: 1705314600 },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = isoToUnixTimestamp(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe("unixTimestampToIso", () => {
    it("should convert valid UNIX timestamp to ISO string", () => {
      const timestamp = 1705314600;
      const expectedIso = "2024-01-15T10:30:00.000Z";

      const result = unixTimestampToIso(timestamp);

      expect(result).toBe(expectedIso);
    });

    it("should return null for negative timestamp", () => {
      const negativeTimestamp = -1;

      const result = unixTimestampToIso(negativeTimestamp);

      expect(result).toBeNull();
    });

    it("should return null for non-finite numbers", () => {
      const nonFiniteValues = [NaN, Infinity, -Infinity];

      nonFiniteValues.forEach((value) => {
        const result = unixTimestampToIso(value);
        expect(result).toBeNull();
      });
    });

    it("should handle zero timestamp", () => {
      const result = unixTimestampToIso(0);

      expect(result).toBe("1970-01-01T00:00:00.000Z");
    });
  });

  describe("isValidIsoString", () => {
    it("should return true for valid ISO strings", () => {
      const validIsoStrings = [
        "2024-01-15T10:30:00.000Z",
        "2024-01-15T10:30:00Z",
        "2024-01-15T10:30:00+00:00",
        "2024-01-15T10:30:00-05:00",
      ];

      validIsoStrings.forEach((isoString) => {
        const result = isValidIsoString(isoString);
        expect(result).toBe(true);
      });
    });

    it("should return false for invalid ISO strings", () => {
      const invalidIsoStrings = [
        "invalid-date",
        "not-a-date-at-all",
        "",
        "2024-13-45T25:70:99.000Z", // Invalid month, day, hour, minute, second
        "2024-01-15T25:70:99.000Z", // Invalid hour, minute, second
        "2024-01-15T10:30:60.000Z", // Invalid second (60)
        "2024-01-15T10:60:00.000Z", // Invalid minute (60)
        "2024-01-15T24:30:00.000Z", // Invalid hour (24)
      ];

      invalidIsoStrings.forEach((isoString) => {
        const result = isValidIsoString(isoString);
        expect(result).toBe(false);
      });
    });

    it("should document JS rollover for technically valid but non-existent dates", () => {
      // These are technically valid according to JS Date, but are rolled over to the next valid date
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#date_rollover:~:text=If%20any%20parameter%20overflows%20its%20defined%20bounds%2C%20it%20%22carries%20over%22
      // We just respect this logic and allow these dates to be valid
      const rolloverCases = [
        {
          input: "2024-02-30T10:30:00.000Z",
          expected: "2024-03-01T10:30:00.000Z",
        },
        {
          input: "2024-04-31T10:30:00.000Z",
          expected: "2024-05-01T10:30:00.000Z",
        },
      ];
      rolloverCases.forEach(({ input, expected }) => {
        const date = new Date(input);
        expect(isValidIsoString(input)).toBe(true);
        expect(date.toISOString()).toBe(expected);
      });
    });
  });

  describe("getCurrentUnixTimestamp", () => {
    it("should return a valid UNIX timestamp", () => {
      const result = getCurrentUnixTimestamp();

      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("should return timestamp in seconds (not milliseconds)", () => {
      const result = getCurrentUnixTimestamp();
      const nowInMs = Date.now();
      const nowInSeconds = Math.floor(nowInMs / 1000);

      // Should be within 1 second of current time
      expect(Math.abs(result - nowInSeconds)).toBeLessThanOrEqual(1);
    });
  });

  describe("Round-trip conversion", () => {
    it("should maintain precision through ISO -> UNIX -> ISO conversion", () => {
      const originalIso = "2024-01-15T10:30:00.000Z";

      const unixTimestamp = isoToUnixTimestamp(originalIso);
      const backToIso = unixTimestampToIso(unixTimestamp!);

      expect(backToIso).toBe(originalIso);
    });

    it("should maintain precision through UNIX -> ISO -> UNIX conversion", () => {
      const originalTimestamp = 1705314600;

      const isoString = unixTimestampToIso(originalTimestamp);
      const backToUnix = isoToUnixTimestamp(isoString!);

      expect(backToUnix).toBe(originalTimestamp);
    });
  });
});
