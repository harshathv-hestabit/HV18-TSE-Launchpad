import { AsyncLocalStorage } from "node:async_hooks";
import { v4 as uuid } from "uuid";

const asyncStore = new AsyncLocalStorage();

export function traceMiddleware(req, res, next) {
    const requestId =
        req.headers["x-request-id"]?.toString() || uuid();

    asyncStore.run({ requestId }, () => {
        req.requestId = requestId;
        res.setHeader("X-Request-ID", requestId);
        next();
    });
}

export function getRequestContext() {
    return asyncStore.getStore() || { requestId: null };
}