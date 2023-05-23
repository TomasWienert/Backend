import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();

//PARAMETROS DE CONFIGURACION
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONFIG HANDLEBARS

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(8080, () => console.log("Listening on port 8080"));

const io = new Server(server);

app.set("socketio", io);

//io.on("connection", socket => {
    //console.log("nuevo cliente conectado")

    //PARA RECIBIR EVENTOS DESDE EL LADO DEL CLIENTE HAGO LO SIGUIENTE (EVENTO MANDADO "MESSAGE")
    /* socket.on("message", data => {
        console.log(data);
    }) */

    //PARA MANDAR MENSAJE DESDE EL SERVIDOR A UN SOLO CLIENTE

    //socket.emit("evento_socket_individual", "mensajito que recibe el socket")

    //PARA MANDAR MENSAJE A TODOS LOS USUARIOS CONECTADOS AL SERVER MENOS AL QUE SE CONECTA

    //socket.broadcast.emit("evento_todos_menos_actual", "mensaje para todos menos el actual")

    //MENSAJE PARA TODOS LOS CLIENTES CONECTADOS

    //io.emit("evento_todos", "mensaje para todos los conectados")

//});


