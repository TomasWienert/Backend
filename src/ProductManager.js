import fs from "fs";

const path = "../files/Usuarios.json"

export default class ProductManager {

    constructor (path) {
        this.products = [];
        //this.path = path;
    }

    getProducts = async () => {
        try {
            
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                console.log(data);
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }           

        } catch (error) {
            console.log(error);
        }
        
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        try {

            const products = await this.getProducts(); 

            let product = {};

            // validación de que code no se repita

            let checkCode = products.find((p) => p.code === code);
            
            if (!checkCode) {
                console.log("Se agrega el producto")

                // validación de que todos los campos estan completos

                if (title && description && price && thumbnail && code && stock) {
                    
                    product = {
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock
                    }

                    // Agrego producto con id autoincrementable

                    if (products.length === 0) {
                        product.id = 1;
                    } else {
                        // busco posicion (que es la longitud del array de productos-1) y luego le asigno el id anterior + 1
                        product.id = products[products.length - 1].id + 1; 
                    }
            
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

    getProductById = (id) => {

        const products = this.getProducts(); 
        
        let buscadorId = products.find((p) => p.id === id)

        console.log(buscadorId);

    }


}

// PRUEBA

/* const ManejadorProductos = new ProductManager();

ManejadorProductos.addProduct("plato", "hondo", 82, "ruta1", 124, 55);
ManejadorProductos.addProduct("plato", "playo", 27, "ruta2", 122, 18);
ManejadorProductos.getProductById(2);
console.log(ManejadorProductos.getProducts()); */
