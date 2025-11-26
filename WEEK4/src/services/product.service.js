import ProductRepository from "../repositories/product.repository.js"

class ProductService {
  async createProduct(payload) {
    return await ProductRepository.create(payload);
  }

  async getProductById(id) {
    return await ProductRepository.findById(id);
  }

  async getProductsPaginated(query) {
    return await ProductRepository.findPaginated(query);
  }

  async updateProduct(id, payload) {
    return await ProductRepository.update(id, payload);
  }

  async deleteProduct(id) {
    return await ProductRepository.delete(id);
  }
}

export default new ProductService();
