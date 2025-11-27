import ProductService from "../services/product.service.js";

class ProductController {
    async create(req, res, next) {
        try {
            const data = await ProductService.createProduct(req.body);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const data = await ProductService.getProductById(
                req.params.id,
                req.query.includeDeleted === "true"
            );
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await ProductService.getProducts(req.query);
            res.json({ success: true, ...result });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const data = await ProductService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data });
            console.log("sdaskjdadj");
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const data = await ProductService.deleteProduct(req.params.id);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }
}

export default new ProductController();