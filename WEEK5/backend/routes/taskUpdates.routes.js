import express from "express";
import { createTaskUpdates,getTaskUpdates } from "../controllers/taskUpdates.controller.js";

const router = express.Router();

router.post("/", createTaskUpdates);  
router.get("/", getTaskUpdates);     

export default router;
