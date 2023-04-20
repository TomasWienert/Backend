import ProductManager from "./ProductManager.js";
import express from "express";

const manager = new ProductManager();

const app = express();

//let productsResult = [];

/* const send = async () => {
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

send(); */

app.get("/products", async (req, res) => {

    //traigo el query de cantidad de productos a mostrar, seria un "filtro"
    const {limit} = req.query;
    console.log(limit);

    //traigo productos del json
    const productsResult = await manager.getProducts();

    //logica para enviar la cant de prods que me pide el cliente, si pide mas de los que hay muestra todo
    limit ? res.send(productsResult.slice(0, limit)) : res.send(productsResult);
    
});

app.get("/products/:pid", async (req, res) => {

    //traigo id a mostrar
    const userId = Number(req.params.pid);

    //traigo productos del json
    const productsResult = await manager.getProducts();

    //busco que producto tiene ese id que requiere el cliente
    const prod = productsResult.find(p => p.id === userId)
    res.send(prod);
});

app.listen(8080, () => console.log("Listening on port 8080"));

