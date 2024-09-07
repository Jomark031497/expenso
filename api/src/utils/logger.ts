import { format } from "date-fns";
import { pino } from "pino";

export const logger = pino({
  base: {
    pid: false,
  },
  level: process.env.NODE_ENV === "test" ? "silent" : "info",
  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),

  timestamp: () => `,"time":"${format(new Date(), "hh:mm:ss aa | MMM-dd-yyyy")}"`,
});
