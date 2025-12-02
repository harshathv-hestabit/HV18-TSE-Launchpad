import Product from "../models/Product.js";

class ProductRepository {
    async create(data) {
        return await Product.create(data);
    }

    async findById(id, includeDeleted = false) {
        const filter = { _id: id };
        if (!includeDeleted) filter.deletedAt = null;
        return await Product.findOne(filter);
    }

    query(filter = {}) {
        return Product.find(filter);
    }

    async findPaginated({ filter = {}, sort = {}, page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const q = Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);

        const [data, total] = await Promise.all([
            q.exec(),
            Product.countDocuments(filter)
        ]);

        return { data, total, page, limit };
    }

    async update(id, payload) {
        return await Product.findByIdAndUpdate(id, payload, { new: true });
    }

    async softDelete(id) {
        return await Product.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
    }
}

export default new ProductRepository();
