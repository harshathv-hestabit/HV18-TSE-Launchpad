import mongoose from "mongoose";

const TaskUpdateSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("TaskUpdates", TaskUpdateSchema);