import {createLogger, format, transports} from "winston";

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.printf(({message }) => `✓ ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './src/logs/app.log' })
  ]
});

export default logger;