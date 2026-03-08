import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

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

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

// Limitar peticiones (prevenir DDoS y fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde." }
});
app.use(limiter);

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
  console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
});