import { Router } from "express";
import productRouter from "./product.routes.js";
import addEmailJob from "../jobs/email.job.js"
const mainRouter = Router();

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General test and system endpoints
 */

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test if the main router is working
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Router is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   example: {}
 */

mainRouter.get("/test", (req, res) => {
  res.json({ message: "OK" });
});


/**
 * @swagger
 * /test-email:
 *   get:
 *     summary: Queue a test email job
 *     tags: [General]
 *     description: Queues a test email job using BullMQ. No input required.
 *     responses:
 *       200:
 *         description: Email job queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email job queued
 *                 data:
 *                   type: object
 *                   example: {}
 */

mainRouter.get("/test-email", async (req, res) => {
  await addEmailJob({
    to: "john@example.com",
    subject: "Test Email",
    text: "This is a test email job.",
  });

  res.json({ message: "Email job queued" });
});

mainRouter.use("/product", productRouter);

export default mainRouter;