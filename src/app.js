import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import ProductManager from "./ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine({
    layoutsDir: path.resolve('src/views/layouts'),
    defaultLayout: 'main'
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("public"))

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const productManager = new ProductManager("./src/data/product.json");
io.on("connection", (socket)=> {
    console.log("Nuevo usuario conectado!");

    socket.on("newProduct", async(productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.error("Error añadiendo producto: ", error.message)
        }
    })
});


server.listen( 8080, () => console.log("Servidor iniciado en: http://localhost:8080") );