import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

let transportsList = [];

if (process.env.NODE_ENV == "dev") {
  transportsList.push(
    new transports.Console({
      level: "debug",
      handleExceptions: false,
      format:
        process.env.NODE_ENV !== "dev"
          ? format.combine(format.json())
          : format.combine(format.colorize(), format.simple()),
    })
  );
} else {
  transportsList.push(
    new transports.DailyRotateFile({
      filename: `${process.env.LOG_FILE}-%DATE%.log`,
      dirname: process.env.LOG_DIR,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: Boolean(process.env.LOG_ZIP),
      format: format.json(),
      handleExceptions: false,
      maxSize: process.env.LOG_MAX_SIZE,
      maxFiles: process.env.LOG_MAX_FILES,
      level: "info",
    })
  );
  transportsList.push(
    new transports.DailyRotateFile({
      filename: `${process.env.LOG_FILE}-error-%DATE%.log`,
      dirname: process.env.LOG_DIR,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: Boolean(process.env.LOG_ZIP),
      format: format.json(),
      handleExceptions: false,
      maxSize: process.env.LOG_MAX_SIZE,
      maxFiles: process.env.LOG_MAX_FILES,
      level: "error",
    })
  );
}

export const logger = createLogger({
  transports: [...transportsList],
  exceptionHandlers: [
    new transports.File({
      filename: `${process.env.LOG_DIR}/${process.env.LOG_FILE}.exceptions.log`,
    }),
  ],
  exitOnError: false,
  format: format.combine(format.timestamp(), format.json()),
});
