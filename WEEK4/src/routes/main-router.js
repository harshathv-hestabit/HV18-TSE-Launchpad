import { Router } from "express";
import logger from "../utils/logger.js";

export default function MainRouter() {
  const main_router = Router();

  main_router.get("/test", (req, res) => {
    res.json({ message: "OK" });
  });

  const endpoints = main_router.stack;
  logger.info(`Routes Mounted: ${endpoints.length} endpoints`);
  return main_router;
}