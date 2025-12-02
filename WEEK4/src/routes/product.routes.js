import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { validateCreateProduct, validateUpdateProduct } from "../middlewares/validate.middleware.js";

const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67a9f82b3fbdf22a44c9a125"
 *         name:
 *           type: string
 *           example: "Smartphone X1"
 *         brand:
 *           type: string
 *           example: "TechBrand"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["black", "white"]
 *         price:
 *           type: number
 *           example: 899.99
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["mobile", "flagship"]
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product completely
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Partially update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of product fields
 *     responses:
 *       200:
 *         description: Product updated partially
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */


productRouter.post("/",validateCreateProduct,ProductController.create);
productRouter.get("/",ProductController.getAll);
productRouter.get("/:id", ProductController.getById);
productRouter.put("/:id",validateUpdateProduct,ProductController.update);
productRouter.patch("/:id",validateUpdateProduct,ProductController.update);
productRouter.delete("/:id", ProductController.delete);

export default productRouter;