import path from "path";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;
import DailyRotateFile from "winston-daily-rotate-file";

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

// Create a logger for general information logs
const logger = createLogger({
  level: "info",
  format: combine(label({ label: "PH" }), timestamp(), myFormat),
  transports: [
    new transports.Console(), // to show status in console
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "successes",
        "phu-%DATE%-success.log"
      ), // Specify the file path for success logs
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Create a logger specifically for error logs
const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "PH" }), timestamp(), myFormat),
  transports: [
    new transports.Console(), // to show status in console
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "errors",
        "phu-%DATE%-error.log"
      ), // Specify the file path for success logs
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { logger, errorLogger };
