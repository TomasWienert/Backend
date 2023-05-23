import { Router } from "express";
import fs from "fs";
import ProductManager from "../managers/ProductManager.js";
import { Console } from "console";

const manager = new ProductManager();

const path2 = "./files/BaseProductos.json";

const router = Router();

//GET CON TODOS LOS PRODUCTOS O CON LA CANTIDAD QUE QUIERA EL USUARIO TIENE QUE PONER VALOR A LIMIT

router.get("/", async (req, res) => {

    //traigo el query de cantidad de productos a mostrar, seria un "filtro"
    const {limit} = req.query;
    
    if (limit !== undefined) {
     
        console.log(limit);
    }

    //traigo productos del json
    const productsResult = await manager.getProducts();

    console.log(productsResult);

    //logica para enviar la cant de prods que me pide el cliente, si pide mas de los que hay muestra todo
    limit ? res.send(productsResult.slice(0, limit)) : res.send(productsResult);
    
});

//GET CON PRODUCTO POR ID

router.get("/:pid", async (req, res) => {

    //traigo id a mostrar
    const userId = Number(req.params.pid);

    //traigo productos del json
    const productsResult = await manager.getProducts();

    //busco que producto tiene ese id que requiere el cliente
    const prod = productsResult.find(p => p.id === userId)
    res.send(prod);
});

//CREADOR DE PRODUCTOS

router.post("/", async (req, res) => {

    //traigo objeto con producto nuevo

    const product = req.body;

    await manager.addProduct(product);

    res.send({status: "success", product});
})

//EDITOR DE PRODUCTOS

router.put("/:pid", async (req, res) =>{

    //traigo el requerimiento de actualizacion

    const newProd = req.body;
    
    //traigo id a editar
    const userId = Number(req.params.pid);
    
    //traigo productos del json
    const productsResult = await manager.getProducts();
    
    //busco que producto tiene ese id que requiere el cliente
    const prod = productsResult.find(p => p.id === userId);
    
    //si encuentro producto con ese id actualizo

    if (prod !== undefined) {

        if (newProd.title && newProd.description && newProd.price 
            && newProd.code && newProd.stock && newProd.category
            && newProd.status) {

                productsResult[userId-1] = newProd;

                newProd.id = userId;

                console.log(productsResult)

                //hay que colocar el producto editado en el array

                //primero elimino archivo

                await fs.promises.unlink(path2)

                //vuelvo a crear archivo con el nuevo array

                await fs.promises.writeFile(path2, JSON.stringify(productsResult, null, "\t"));

                res.send({status: "success", message: "product updated"});
            
        } else {

            res.status(404).send({status: "error", error: "Incomplete product"})
        };
        
    } else {

        res.status(404).send({status: "error", error: "product not found"})
    }

})

//ELIMINA PRODUCTOS

router.delete("/:pid", async (req, res) =>{

    //traigo id a eliminar
    const userId = Number(req.params.pid);

    //traigo productos del json
    const productsResult = await manager.getProducts();

    //busco que producto tiene ese id que requiere el cliente
    const prod = productsResult.find(p => p.id === userId);

    if (prod !== undefined) {

        //elimino el producto del array usando la posición del id

        productsResult.splice((userId-1),1);

        //hay que colocar el producto editado en el array

        //primero elimino archivo

        await fs.promises.unlink(path2)

        //vuelvo a crear archivo con el nuevo array

        await fs.promises.writeFile(path2, JSON.stringify(productsResult, null, "\t"));

        res.send({status: "success", message: "product eliminated"});

    } else {
        res.status(404).send({status: "error", error: "product not found"})
    }
})

export default router;