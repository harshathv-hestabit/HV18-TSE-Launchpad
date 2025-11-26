import User from "../models/User.js"

class UserRepository {
    async create(data) {
        const user = new User(data);
        return await user.save();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findPaginated({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const data = await User.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await User.countDocuments();
        return { data, total, page, limit };
    }

    async update(id, payload) {
        return await User.findByIdAndUpdate(id, payload, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserRepository();