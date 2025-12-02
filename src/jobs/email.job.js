import { emailQueue } from "./queue.js";

async function addEmailJob(data) {
    await emailQueue.add("send-email", data, {
        attempts: 3,
        backoff: {
            type: "fixed",
            delay: 1000,
        },
    });
}

export default addEmailJob;