import express from "express";
import config from "./config.js";
import loadDB from "./db.js";
import MainRouter from "../routes/main.router.js"
import applySecurity from "../middlewares/security.middleware.js"
import errorMiddleware from "../middlewares/error.middleware.js"
import getRoutes from "../utils/getEndpointsCount.js"
import logger from "../utils/logger.js";
import { traceMiddleware } from "../utils/tracing.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

export default async function loadApp() {
  const app = express();
  applySecurity(app);

  await loadDB(config.dbUri);

  const middlewares = app.router.stack.filter(
    (layer) => layer.name === "bound dispatch" ? false : !!layer.handle && !layer.route
  );

  if (middlewares.length > 0) {
    logger.info("Middlewares mounted");
  } else {
    logger.info("No middlewares mounted");
  }
  app.use(traceMiddleware);
  app.use("/", MainRouter);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(errorMiddleware);

  const countEndpoints = getRoutes(MainRouter);
  logger.info(`Routes Mounted: ${countEndpoints.length} endpoints`);

  return app;
}