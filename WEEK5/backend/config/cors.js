export const corsOptions = {
    origin: (origin, callback) => {
        const allowed = process.env.ALLOWED_ORIGIN;

        if (!origin) return callback(null, true);
        if (origin === allowed) return callback(null, true);

        return callback(new Error("Not allowed by CORS. Restricted by Server."));
    },
    credentials: true
};