import { Worker } from "bullmq";
import logger from "../utils/logger.js";

const worker = new Worker(
    "emailQueue",
    async (job) => {
        logger.info(`Processing job ${job.id}`);
        logger.info("Email sent.");
    },
    {
        connection: {
            host:"127.0.0.1",
            port:6379
        }
    }
);

worker.on("completed", (job) => {
    logger.info(`Job completed: ${job.id} - ${job.name}`);
});

worker.on("failed", (job, err) => {
    logger.error(`Job failed: ${job?.id} - ${err.message}`);
});

export default worker;