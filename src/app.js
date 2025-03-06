import express from "express";
import mongoose from "mongoose";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import Product from "./models/products.model.js";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import dotenv from "dotenv";
import connectMongoDB from "./db/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine({
    layoutsDir: path.resolve('src/views/layouts'),
    defaultLayout: 'main'
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("public"))

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado!");

    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = await Product.create(productData);
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.error("Error añadiendo producto: ", error.message);
        }
    });
});


server.listen( 8080, () => console.log("Servidor iniciado en: http://localhost:8080") );