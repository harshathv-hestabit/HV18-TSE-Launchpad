import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/", ProductController.create);
productRouter.get("/", ProductController.getAll);
productRouter.get("/:id", ProductController.getById);
productRouter.put("/:id", ProductController.update);
productRouter.patch("/:id", ProductController.update);
productRouter.delete("/:id", ProductController.delete);

export default productRouter;