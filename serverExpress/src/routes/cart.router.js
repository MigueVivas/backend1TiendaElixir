import express from "express";

const cartRouter = express.Router();

cartRouter.get("/carts", (req, res)=> {
    res.send({username: "Migue01", password: "micontraseña"});
})

export default cartRouter
