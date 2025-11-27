// import {createLogger, format, transports} from "winston";

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.printf(({message }) => `✓ ${message}`)
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: './src/logs/app.log' })
//   ]
// });

// export default logger;

import { createLogger, format, transports } from "winston";

const logger = createLogger({
  levels: { error: 0, info: 1 },
  format: format.combine(
    format.printf((info) => {
      if (info.level === "error") {
        const { success, message, code, timestamp, path } = info;
        return JSON.stringify({ success, message, code, timestamp, path });
      }

      return `✓ ${info.message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./src/logs/app.log" })
  ]
});

export default logger;
