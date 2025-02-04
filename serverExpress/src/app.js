import express from "express";

let products = [
    { 
        pid: "1",
        title: "Havana Club",
        description: "Un ron joven y ligero con un sabor equilibrado y ligeramente dulce. Ideal para cócteles como el clásico Cuba Libre.",
        code: "ronhvnc01", 
        price: 14000,
        status: true,
        stock: 10,
        category: "ron",
        thumbnail: "" 
    },
    {
        pid: "2",
        title: "Havana 7 años",
        description: "Un ron envejecido que destaca por sus notas de cacao, vainilla y frutas tropicales. Perfecto para tomar solo o con hielo.",
        code: "ronhvnc02", 
        price: 17000,
        status: true,
        stock: 5,
        category: "ron",
        thumbnail: ""
    },
    {
        pid: "3",
        title: "Coca Cola 2,25 lts",
        description: "Un refresco icónico con un sabor dulce y burbujeante. Perfecto para disfrutar solo o como mezclador en bebidas. Presentacion de 2,25 lts",
        code: "gasccc0225", 
        price: 3000,
        status: true,
        stock: 20,
        category: "gaseosa",
        thumbnail: ""
    }
]

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get( "/", (req, res)=> {
    res.send("Tienda Elixir")
} )

app.get("/products", (req, res)=> {
    res.status(200).send(products)
})

app.get("/products/:pid", (req, res) => {
    const { pid } = req.params;
    const product = products.find((p) => p.pid === pid);
    if (!product) return res.status(404).send({ message: `${pid} no es un producto registrado` });
    res.send(product);
})

app.get("/category/:category", (req, res)=>{
    const {category} = req.params;
    const filtercategory = products.filter((products)=> products.category === category);
    if (filtercategory.length === 0) return res.status(404).send({ message: `${category} no es una categoria` });
    res.send(filtercategory)
    
})

app.post("/products", (req, res)=> {
   const {title, description, code, price, stock, category} = req.body;
    if(!title || !description || !code || !price || !stock || !category) return res.status(400).send({message: "Error al registrar el producto, faltan datos para completar la operacion"})

    const newId = products.length > 0 ? (parseInt(products[products.length - 1].pid) + 1).toString() : "1";


    const newProduct = {
        pid: newId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnail: ""
    };

    products.push(newProduct);
    res.status(201).send(products)
})

app.put("/products/:pid", (req, res)=> {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnail, status} = req.body;

    const index = products.findIndex((products) => products.pid === pid)
    if(index === -1) return res.status(404).send({message: "Error! Producto no encontrado"});

    if (!title && !description && !code && !price && !stock && !category && !thumbnail && status === undefined) {
        return res.status(400).json({ message: "Error! No se enviaron datos para actualizar" });
    }

    products[index] = {
        ...products[index],
        title: title ?? products[index].title,
        description: description ?? products[index].description,
        code: code ?? products[index].code,
        price: price ?? products[index].price,
        stock: stock ?? products[index].stock,
        category: category ?? products[index].category,
        thumbnail: thumbnail ?? products[index].thumbnail,
        status: status ?? products[index].status,
    };
    res.status(200).json({ message: "Producto actualizado con éxito", product: products[index] });

})

app.delete("/products/:pid", (req, res)=> {
    const { pid } = req.params;
    const index = products.findIndex((products) => products.pid === pid );
    if(index === -1) return res.status(404).send({ message: "Producto no encontrado"});
    const productsFilter = products.filter((products) => products.pid !== pid);
    products = [...productsFilter];
    res.status(200).send(products);
})

app.get("/carts", (req, res)=> {
    res.send({username: "Migue01", password: "micontraseña"});
})

app.listen( 8080, () => console.log("Servidor iniciado en: http://localhost:8080") );