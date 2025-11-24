import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// ================ RUTAS =================
import routerProducto from "./routes/productos.routes.js";
import routerUsuario from "./routes/usuarios.routes.js";
import routerInventario from "./routes/inventario.routes.js";
import routerPedidos from "./routes/pedidos.routes.js";
import routerDocumento from "./routes/documentos.routes.js";
import routerAuth from "./routes/login.js";

// ================= CONFIGURACIONES =================
const app = express();
const PORT = process.env.PORT || 8080;

// ================= MIDDLEWARES =================

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ================= RUTAS =================
app.use(
  routerProducto,
  routerUsuario,
  routerInventario,
  routerPedidos,
  routerDocumento,
  routerAuth
);

// ================= SERVIDOR =================

app.listen(PORT, () => {
  console.log(`API LEVANTADA EN EL PUERTO: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
