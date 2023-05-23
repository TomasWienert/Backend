import fs from "fs";

const path = "./files/BaseProductos.json"

export default class ProductManager {

    constructor (path) {
        this.products = [];
        //this.path = path;
    }

    getProducts = async () => {
        try {
            
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }           

        } catch (error) {
            console.log(error);
        }
        
    }

    addProduct = async (product) => {

        try {

            const products = await this.getProducts(); 

            // validación de que code no se repita

            let checkCode = products.find((p) => p.code === product.code);

            if (!checkCode) {
                

                // validación de que todos los campos estan completos menos thumbnail

                if (product.title && product.description && product.price 
                    && product.code && product.stock && product.category
                    && product.status) {

                    console.log("Se agrega el producto")
                        
                    // Agrego producto con id autoincrementable

                    if (products.length === 0) {
                        product.id = 1;
                    } else {
                        // busco posicion (que es la longitud del array de productos-1) y luego le asigno el id anterior + 1
                        product.id = products[products.length - 1].id + 1; 
                    }

                    //console.log(product);
            
                    products.push(product);

                    //hay que colocar el nuevo producto en el array pasandolo a formato json sin reemplazar nada

                    await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));

                    return product;

                } else {

                    console.log("falta algun dato")
                    
                };

            }else{
                console.log("el producto está repetido")
            };
            
        } catch (error) {
            console.log(error);
        }

    }

    // traer un producto por su id, si no esta ese id devolver "Not Found"

    getProductById = async (id) => {

        const products = await this.getProducts(); 
        
        let buscadorId = products.find((p) => p.id === id)

        console.log(buscadorId);

    }

}