import Product from "../models/Product.js"

class ProductRepository {
    async create(data) {
        const product = new Product(data);
        return await product.save();
    }

    async findById(id) {
        return await _findById(id);
    }

    async findPaginated({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const data = await find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await countDocuments();
        return { data, total, page, limit };
    }

    async update(id, payload) {
        return await findByIdAndUpdate(id, payload, { new: true });
    }

    async delete(id) {
        return await findByIdAndDelete(id);
    }
}

export default new ProductRepository();
