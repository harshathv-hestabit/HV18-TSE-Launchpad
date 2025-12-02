import logger from "../utils/logger.js";

// export default function errorMiddleware(err, req, res, next) {
//     const status = err.status || 500;
//     const errorData = {
//         success: false,
//         message: err.message || "Internal Server Error",
//         code: err.code || "UNKNOWN_ERROR",
//         timestamp: new Date().toISOString(),
//         path: req.originalUrl
//     };

//     logger.error(errorData);
//     res.status(status).json(errorData);
// }

export default function errorMiddleware(err, req, res, next) {
    console.log(err);
    const errorPayload = {
        success: false,
        message: err.message || "Internal Server Error",
        code: err.status,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    };

    logger.error(errorPayload);

    res.status(err.status || 500).json(errorPayload);
}
