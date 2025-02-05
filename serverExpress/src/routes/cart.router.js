import express from "express";
import CartManager from "../CartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./serverExpress/src/data/carts.json");


cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).send(newCart);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});


cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.status(200).send(cart);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});


export default cartsRouter;