// Define generic args for the tools and resources to have unified descriptions

import { z } from "zod";
import { isValidIsoString } from "./utils";

export const timeRangeArgs = {
  start_time: z.string()
    .describe("The start time of the time range (ISO 8601 format)")
    .refine(isValidIsoString, {
      message: "start_time must be a valid ISO 8601 date string"
    }),
  end_time: z.string()
    .describe("The end time of the time range (ISO 8601 format)")
    .refine(isValidIsoString, {
      message: "end_time must be a valid ISO 8601 date string"
    }),
};


export const genericArgs = {
  timeRangeArgs,
};
