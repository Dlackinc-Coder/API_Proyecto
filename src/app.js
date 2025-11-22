import express from "express";
import bodyParser from "body-parser";
import routerProducto from "./routes/productos.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routerProducto);

app.listen(PORT, () => {
  console.log(`API LEVANTADA EN EL PUERTO: ${PORT}`);
});
