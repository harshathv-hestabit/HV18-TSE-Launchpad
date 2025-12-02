import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import express from "express";
import { xss } from "express-xss-sanitizer";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import hpp from "hpp";

// Helper Function for Rate Limit Security Test Case
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
});

// Applying security measures using Express Middleware Packages
const applySecurity = (app) => {
    // HELMET Middleware to inject security related headers
    app.use(helmet());

    // CORS Policy
    app.use(
        cors({
            origin: ["http://localhost:3001"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true
        })
    );

    // RATE LIMITING. Set to 10 requests every 1 minute
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false
    });
    app.use(limiter);
    
    // PAYLOAD SIZE LIMIT
    app.use(express.json({ limit: "10kb" }));
    app.use(express.urlencoded({ extended: true, limit: "10kb" }));
    
    // INPUT SANITIZATION
    app.use(expressMongoSanitize());
    
    // Cross Site Scripting
    app.use(xss());

    // Parameter Pollution
    app.use(hpp());
};

export default applySecurity;