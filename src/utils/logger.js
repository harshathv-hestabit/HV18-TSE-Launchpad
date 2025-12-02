import { createLogger, format, transports } from "winston";
import { getRequestContext } from "./tracing.js";

const requestIdFormat = format((info) => {
  const { requestId } = getRequestContext();
  info.requestId = requestId ?? null;
  return info;
})();

const logger = createLogger({
  levels: { error: 0, info: 1 },
  format: format.combine(
    requestIdFormat,
    format.timestamp(),
    format.printf((info) => {
      const { level, message, requestId, timestamp } = info;
      if (level === "error") {
        const { success, code, path } = info;
        return JSON.stringify({
          success,
          message,
          code,
          path,
          requestId,
          timestamp
        });
      }

      return `✓ ${requestId ? `[req:${requestId}]` : ""} ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./src/logs/app.log" })
  ]
});

export default logger;
