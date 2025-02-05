import express from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./serverExpress/src/data/product.json");

productsRouter.get("/", async (req, res) => {
  try {
    const data = await productManager.getProducts();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.status(200).send(product);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

productsRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productManager.getProducts();
    const filterCategory = products.filter((p) => p.category === category);
    if (filterCategory.length === 0) throw new Error(`No hay productos en la categoría ${category}`);
    res.status(200).send(filterCategory);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Faltan datos para completar la operación");
    }

    const newProduct = await productManager.addProduct(req.body);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.setProductById(pid, req.body);
    res.status(200).send({ message: "Producto actualizado con éxito", product: updatedProduct });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProducts = await productManager.deleteProductById(pid);
    res.status(200).send(updatedProducts);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

export default productsRouter;
