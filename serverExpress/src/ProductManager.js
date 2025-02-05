import fs from "fs";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  getProducts = async () => {
    try {
      if (!fs.existsSync(this.pathFile)) return [];
      
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error(`Error al leer el archivo de productos: ${error.message}`);
    }
  };

  getProductById = async (pid) => {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.pid === pid);
      if (!product) throw new Error(`El producto con ID ${pid} no existe.`);
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  };

  addProduct = async (newProduct) => {
    try {
      const products = await this.getProducts();
      const newId = products.length > 0 ? (parseInt(products[products.length - 1].pid) + 1).toString() : "1";

      const productToAdd = {
        pid: newId,
        status: true,
        thumbnail: "",
        ...newProduct,
      };

      products.push(productToAdd);
      await this.saveProducts(products);
      return productToAdd;
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  };

  setProductById = async (pid, updatedData) => {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.pid === pid);
      if (index === -1) throw new Error(`El producto con ID ${pid} no existe.`);

      products[index] = { ...products[index], ...updatedData };
      await this.saveProducts(products);
      return products[index];
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  };

  deleteProductById = async (pid) => {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((p) => p.pid !== pid);
      if (products.length === filteredProducts.length) throw new Error(`El producto con ID ${pid} no existe.`);

      await this.saveProducts(filteredProducts);
      return filteredProducts;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  };

  saveProducts = async (products) => {
    try {
      await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error(`Error al guardar productos: ${error.message}`);
    }
  };
}

export default ProductManager;
