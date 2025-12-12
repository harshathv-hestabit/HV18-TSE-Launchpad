import express from "express";

const router = express.Router();

router.get("/", (req,res)=>{
    res.send("Boss, Server is Active!")
})

export default router;