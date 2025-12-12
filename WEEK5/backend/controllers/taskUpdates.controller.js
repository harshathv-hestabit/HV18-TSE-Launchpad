import taskUpdates from "../models/taskUpdates.js";

export const createTaskUpdates = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) {
            return res.status(400).json({ message: "text is required" });
        }

        const taskUpdate = await taskUpdates.create({ text });
        res.status(201).json({ updates: taskUpdate});
    } catch (err) {
        console.error("Create task update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTaskUpdates = async (req, res) => {
    try {
        const updates = await taskUpdates.find().sort({ createdAt: -1 });
        res.json({ updates: updates});
    } catch (err) {
        console.log("Get task updates error:", err);
        res.json({ updates: [] });
    }
};
