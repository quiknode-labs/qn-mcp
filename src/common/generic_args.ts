// Define generic args for the tools and resources to have unified descriptions

import { z } from "zod";
import { isValidIsoString } from "./utils";

export const timeRangeArgs = {
  start_time: z
    .string()
    .describe(
      'The start time of the time range (ISO 8601 format). Example: "2026-01-01T00:00:00Z"',
    )
    .refine(isValidIsoString, {
      message: "start_time must be a valid ISO 8601 date string",
    }),
  end_time: z
    .string()
    .describe(
      'The end time of the time range (ISO 8601 format). Example: "2026-01-31T23:59:59Z"',
    )
    .refine(isValidIsoString, {
      message: "end_time must be a valid ISO 8601 date string",
    }),
};

export const endpointIdArgs = {
  endpoint_id: z
    .string()
    .describe("The unique identifier of the QuickNode endpoint"),
};

export const genericArgs = {
  timeRangeArgs,
  endpointIdArgs,
};
