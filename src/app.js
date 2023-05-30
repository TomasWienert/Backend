import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// TRAIGO EL PRODUCT MANAGER PARA MOSTRAR EN EL FRONTEND LOS PRODUCTOS DE MI BASE
import ProductManager from "../src/managers/ProductManager.js";

const app = express();

//PARAMETROS DE CONFIGURACION
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONFIG HANDLEBARS

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(8080, () => console.log("Listening on port 8080"));

const io = new Server(server);

app.use("/", viewsRouter);

//USO MANAGER PARA MOSTRAR EN FRONTEND LOS PRODUCTOS DE LA BASE

const manager = new ProductManager();

io.on("connection", async socket => {
    console.log("nuevo cliente conectado")

    //TRAIGO EL ARREGLO DE OBJETOS CON TODOS MIS PRODUCTOS

    const productsResult = await manager.getProducts();

    //MANDO EL ARREGLO AL FRONT

    socket.emit("home", {productsResult});

});


