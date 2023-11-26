import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
//Conexión a la base de datos
mongoose
  .connect("mongodb+srv://clusterbackend.zpps5bs.mongodb.net", {
    dbName: "Project_0",
    user: "goldenwarriors",
    pass: "WcQoG8wezUPUwHy3",
  })
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(bodyParser.json());

import usersRouter from "./src/Usuario/usuario.router.js";
app.use("/Users", usersRouter);
import productsRouter from "./src/Producto/producto.router.js";
app.use("/Products", productsRouter);
import ordersRouter from "./src/Orden/orden.route.js";
app.use("/Orders", ordersRouter);

export default app;