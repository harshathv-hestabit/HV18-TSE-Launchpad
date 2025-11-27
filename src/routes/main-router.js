import { Router } from "express";
import productRouter from "./product.routes.js";

const mainRouter = Router();

mainRouter.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

mainRouter.use("/product", productRouter);

export default mainRouter;