import mongoose from "mongoose";
import config from "../loaders/config.js";
import logger from "../utils/logger.js";

export default async function loadDB() {
  try {
    await mongoose.connect(config.dbUri);
    logger.info("Database Connected");
  } catch (err) {
    logger.error("Database Connection Failed", err);
  }
}
