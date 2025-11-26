import express from "express";
import config from "./config.js";
import loadDB from "./db.js";
import MainRouter from "../routes/main-router.js"
import logger from "../utils/logger.js";

export default async function loadApp() {
  const app = express();
  app.use(express.json());

  app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`);
  });

  await loadDB();

  const middlewares = app.router.stack.filter(
    (layer) => layer.name === "bound dispatch" ? false : !!layer.handle && !layer.route
  );

  if (middlewares.length > 0) {
    logger.info("Middlewares mounted");
  } else {
    logger.info("No middlewares mounted");
  }

  app.use(MainRouter());

  return app;
}
