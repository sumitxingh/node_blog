import winston from "winston";

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      maxsize: 5000,
      maxFiles: 5,
    }),
  ],
});

export default logger;
