import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { corsOptions } from "./config/cors.js";

import sampleRoutes from "./routes/sample.routes.js";
import taskUpdateRoutes from "./routes/taskUpdates.routes.js";
import healthRoute from "./routes/health.routes.js"

import { notFound } from "./middleware/errorNotFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

connectDB();

app.use("/api/sample", sampleRoutes);
app.use("/api/taskUpdates", taskUpdateRoutes);
app.use("/health",healthRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
