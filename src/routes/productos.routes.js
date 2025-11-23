import { Router } from "express";
import ProductoController from "../controller/producto.controller.js";
import { validarProducto } from "../config/validacionProducto.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import validarErrores from "../config/validarErrores.js";
import { uploadImageMiddleware } from "../config/multer.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js"; 

const routerProducto = Router();
const ROL_ADMIN = 1;

// ==== RUTAS DEL CATÁLOGO (Requieren Solo Autenticación/Login) ====

// 1. GET: Obtener todos los productos (Catálogo - Requiere token)
routerProducto.get(
  "/api/productos",
  verificarToken,
  validacionLimitOffset,
  validarErrores,
  ProductoController.obtenerProductos
);

// 2. GET: Obtener producto por ID (Detalle - Requiere token)
routerProducto.get(
  "/api/productos/:id",
  verificarToken,
  ProductoController.obtenerProductoPorId
);


// ==== RUTAS DE ADMINISTRACIÓN (Requieren Autenticación y Autorización) ====

// 3. POST: Crear producto (Solo Admin)
routerProducto.post(
  "/api/productos",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  uploadImageMiddleware,
  validarProducto,
  validarErrores,
  ProductoController.crearProducto
);

// 4. PUT: Actualizar producto (Solo Admin)
routerProducto.put(
  "/api/productos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validarProducto,
  validarErrores,
  ProductoController.actualizarProducto
);

// 5. DELETE: Eliminar producto (Solo Admin)
routerProducto.delete(
  "/api/productos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  ProductoController.eliminarProducto
);

export default routerProducto;