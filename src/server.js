import loadApp from "./loaders/app.js";
import config from "./loaders/config.js";
import logger from "./utils/logger.js";
import "./jobs/worker.js";
const app = await loadApp();
app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`);
  });
