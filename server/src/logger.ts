import winston from "winston";

import { DotenvVariable, dotenvValue } from "./dotenv";

const logger = winston.createLogger({
  level: dotenvValue(DotenvVariable.LogLevel, "debug"),
  format: winston.format.json(),
  defaultMeta: { service: "BAO" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

export default logger;
