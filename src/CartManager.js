import fs from "fs";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  getCarts = async () => {
    try {
      if (!fs.existsSync(this.pathFile)) return [];
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error(`Error al leer el archivo de carritos: ${error.message}`);
    }
  };

  createCart = async () => {
    try {
      const carts = await this.getCarts();
      const newId = carts.length > 0 ? (parseInt(carts[carts.length - 1].cid) + 1).toString() : "1";
      const newCart = {
        cid: newId,
        products: []
      };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  };

  getCartById = async (cid) => {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.cid === cid);
      if (!cart) throw new Error(`El carrito con ID ${cid} no existe.`);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  };

  addProductToCart = async (cid, pid, quantity = 1) => {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.cid === cid);
      
      if (cartIndex === -1) throw new Error(`El carrito con ID ${cid} no existe.`);
      
      const productIndex = carts[cartIndex].products.findIndex((p) => p.pid === pid);
      
      if (productIndex === -1) {
        carts[cartIndex].products.push({ pid, quantity });
      } else {
        carts[cartIndex].products[productIndex].quantity += quantity;
      }
      
      await this.saveCarts(carts);
      return carts[cartIndex];
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  };

  removeProductFromCart = async (cid, pid) => {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.cid === cid);
      
      if (cartIndex === -1) throw new Error(`El carrito con ID ${cid} no existe.`);
      
      const productIndex = carts[cartIndex].products.findIndex((p) => p.pid === pid);
      
      if (productIndex === -1) throw new Error(`El producto con ID ${pid} no existe en el carrito.`);
      
      carts[cartIndex].products.splice(productIndex, 1);
      await this.saveCarts(carts);
      return carts[cartIndex];
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  };

  clearCart = async (cid) => {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.cid === cid);
      
      if (cartIndex === -1) throw new Error(`El carrito con ID ${cid} no existe.`);
      
      carts[cartIndex].products = [];
      await this.saveCarts(carts);
      return carts[cartIndex];
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  };

  saveCarts = async (carts) => {
    try {
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw new Error(`Error al guardar carritos: ${error.message}`);
    }
  };
}

export default CartManager;