import fs from "fs";

const path = "../files/Cart.json"

export default class CartManager {

    constructor () {
        this.data = [];
    }

    getCart = async () => {
        try {
            
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                const cart = JSON.parse(data);
                return cart;
            } else {
                return [];
            }           

        } catch (error) {
            console.log(error);
        }
        
    }

    addCart = async (cart) => {

        try {

            const carts = await this.getCart();            
                        
            // Agrego producto con id autoincrementable

            if (carts.length === 0) {

                cart.id = 1;

            } else {

                // busco posicion (que es la longitud del array de carritos-1) y luego le asigno el id anterior + 1
                cart.id = carts[carts.length - 1].id + 1; 

            }         
            
            carts.push(cart);

            //hay que colocar el nuevo producto en el array pasandolo a formato json sin reemplazar nada
                
            await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));

            return cart;
            
        } catch (error) {
            console.log(error);
        }

    }

    // traer un carrito por su id, si no esta ese id devolver "Not Found"

    getCartById = async (id) => {

        try {

            const carts = await this.getCart(); 

            //console.log(carts);
        
            let cart = carts.find((c) => c.id === id)

            //console.log(cart);

            return cart;

        } catch (error) {
            console.log(error)
        }
        

    }

}