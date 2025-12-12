import mongoose from "mongoose";

const SampleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Sample", SampleSchema);
