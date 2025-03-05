import express from "express";
import Product from "../models/products.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("home", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default viewsRouter;
