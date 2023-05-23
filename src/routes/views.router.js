import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const manager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {

    const productsResult = await manager.getProducts();
    
    res.render("home", productsResult);

})

export default router;