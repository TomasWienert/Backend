import ProductManager from "./ProductManager.js";
import express from "express";

const manager = new ProductManager();

const app = express();

let productsResult = [];

const send = async () => {
    const products = await manager.getProducts();
    console.log(products)

    await manager.addProduct("plato", "hondo", 82, "ruta1", 124, 55);
    await manager.addProduct("plato", "playo", 27, "ruta2", 122, 18);
    await manager.addProduct("taza", "grande", 19, "ruta3", 222, 22);
    await manager.addProduct("taza", "chica", 33, "ruta4", 333, 30);
    await manager.addProduct("plato", "postre", 74, "ruta5", 282, 49);

    productsResult = await manager.getProducts();

    console.log(productsResult);

}

send();

app.get("/products", (req, res) => {
    const {limit} = req.query;
    console.log(limit);
    res.send(productsResult);
});

app.get("/products/:pid", (req, res) => {
    const userId = Number(req.params.pid);
    const prod = productsResult.find(p => p.id === userId)
    res.send(prod);
});

app.listen(8080, )

