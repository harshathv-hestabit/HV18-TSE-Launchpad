import ProductRepository from "../repositories/product.repository.js";
import ApiError from "../utils/api-error.js";

class ProductService {
    buildFilters(query) {
        const filter = { deletedAt: null };

        if (query.includeDeleted === "true") delete filter.deletedAt;

        if (query.search) {
            const term = new RegExp(query.search, "i");
            filter.$or = [
                { name: term },
                { brand: term },
                { category: term }
            ];
        }

        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            if (query.minPrice) filter.price.$gte = Number(query.minPrice);
            if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
        }

        if (query.tags) {
            const tagsArr = query.tags.split(",");
            filter.tags = { $in: tagsArr };
        }

        return filter;
    }

    buildSort(sortString) {
        if (!sortString) return { createdAt: -1 };
        const [field, order] = sortString.split(":");
        return { [field]: order === "asc" ? 1 : -1 };
    }

    async createProduct(payload) {
        return await ProductRepository.create(payload);
    }

    async getProductById(id, includeDeleted) {
        const product = await ProductRepository.findById(id, includeDeleted);
        if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
        return product;
    }

    async getProducts(query) {
        const filter = this.buildFilters(query);
        const sort = this.buildSort(query.sort);

        return await ProductRepository.findPaginated({
            filter,
            sort,
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 10
        });
    }

    async updateProduct(id, payload) {
        const updated = await ProductRepository.update(id, payload);
        if (!updated) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
        console.log(updated)
;        return updated;
    }

    async deleteProduct(id) {
        const deleted = await ProductRepository.softDelete(id);
        console.log(deleted);
        if (!deleted) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
        return deleted;
    }
}

export default new ProductService();
