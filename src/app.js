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

// CORS configurado de forma segura
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

// ================= MANEJO DE ERRORES GLOBAL =================

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error global:", err);

  // Si ya se envió una respuesta, pasar al siguiente manejador
  if (res.headersSent) {
    return next(err);
  }

  // Errores específicos de Multer
  if (err.name === "MulterError") {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(413).json({
        error: "El archivo es demasiado grande. Máximo 5MB.",
      });
    }
    return res.status(400).json({
      error: "Error al procesar el archivo.",
    });
  }

  // Errores de validación u otros
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Error interno del servidor";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ================= SERVIDOR =================

app.listen(PORT, () => {
  console.log(`API LEVANTADA EN EL PUERTO: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
});