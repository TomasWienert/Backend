import { Router } from "express";
import fs from "fs";
import CartManager from "../managers/CartManager.js";

const manager = new CartManager();

const path3 = "../files/Cart.json";

const router = Router();

//CREADOR DE CARRITO

router.post("/", async (req, res) => {

    try {
        const cart = {
            products: []
        };
    
        const cartResult = await manager.addCart(cart);

        res.send({ status: "success", cartResult});

    } catch (error) {
        console.log(error);
    };
})

//GET DE CARRITO POR ID

router.get("/:cid", async (req, res) => {

    //traigo id a mostrar
    const cartId = Number(req.params.cid);

    //traigo carrito de ese id
    const cartResult = await manager.getCartById(cartId);

    if(!cartResult) {
        return res.status(404).send({error: "cart id not found"})
    } else {
        res.send({status: "success", cartResult})
    };

});

// POST DE PRODUCTOS A UN CARRITO

router.post("/:cid/product/:pid", async (req, res) => {

    //traigo id de carrito
    const cartId = Number(req.params.cid);

    //traigo id de producto
    const productId = Number(req.params.pid);

    //traigo carritos
    const cartResult = await manager.getCart();

    //busco que carrito tiene ese id que requiere el cliente
    const cart = await manager.getCartById(cartId);
    
    //si el carrito no existe devuelve error, si existe busco dentro el producto

    if (cart === undefined) {
        
        res.status(404).send({status: "error", error: "that cart doesn´t exist"})

    } else {
        //una vez dentro del carrito busco si existe el producto
        
        let prod = cart.products.find((p) => p.product === productId)
        
        if (prod === undefined) {
            
            //si el producto no existe lo creo con cantidad 1

             let newProd = {
                product:productId,
                quantity:1
            }

            //mando el objeto creado al arreglo del carrito en cuestion

            cart.products.push(newProd);
            //console.log(cart.products);
            res.send({status: "success", newProd})
            
        } else {
            //si existe el producto sumo 1 a la cantidad que ya tenia
            let q = prod.quantity + 1;

            let newProd = {
                product:productId,
                quantity:q
            }
            
            //mando el objeto creado al arreglo del carrito en cuestion
            console.log(newProd);
            console.log(cart.products);            

            //cart.products.push(newProd);
            //console.log(cart.products);
            res.send({status: "success", message:"product already in cart, quantity +1", newProd})

        };

        //luego envío a la posición del carrito que se encontró el nuevo producto o el anterior con q+1

        cartResult[cartId-1].products = cart.products;
        console.log(cartResult)

        //primero elimino archivo

        await fs.promises.unlink(path3)

        //vuelvo a crear archivo con el nuevo array

        await fs.promises.writeFile(path3, JSON.stringify(cartResult, null, "\t"));

    };
    
})

export default router;