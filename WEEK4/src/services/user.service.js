import UserRepository from "../repositories/user.repository.js"

class UserService {
    async createUser(payload) {
        return await UserRepository.create(payload);
    }

    async getUserById(id) {
        return await UserRepository.findById(id);
    }

    async getUsersPaginated(query) {
        return await UserRepository.findPaginated(query);
    }

    async updateUser(id, payload) {
        return await UserRepository.update(id, payload);
    }

    async deleteUser(id) {
        return await UserRepository.delete(id);
    }
}

export default new UserService();