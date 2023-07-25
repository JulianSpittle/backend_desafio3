const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productsPromise = this.getProducts();
  }

  async addProduct(product) {
    const products = await this.productsPromise;
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    const newProduct = {
      id: lastId + 1,
      ...product
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct.id;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.productsPromise;
    const product = products.find(product => product.id === id);
    if (!product) {
      throw new Error(`El producto con el ID ${id} no existe.`);
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.productsPromise;
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        ...updatedFields
      };
      this.saveProducts(products);
      return true;
    }
    return false;
  }

  async deleteProduct(id) {
    const products = await this.productsPromise;
    const updatedProducts = products.filter(product => product.id !== id);
    if (updatedProducts.length === products.length) {
      throw new Error(`El producto con el ID ${id} no existe`);
    }
    this.saveProducts(updatedProducts);
  }

  saveProducts(products) {
    fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}

module.exports = ProductManager;