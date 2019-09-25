import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  transports: []
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()) // TODO Format for stackdrive
    })
  );
} else {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.prettyPrint(),
        format.simple()
      )
    })
  );
}

export default logger;
