import mongoose from "mongoose";
import config from "../loaders/config.js";
import logger from "../utils/logger.js";

export default async function loadDB(dbUri) {
  try {
    await mongoose.connect(dbUri);
    logger.info("Database Connected");
  } catch (err) {
    logger.error("Database Connection Failed", err);
  }
}
