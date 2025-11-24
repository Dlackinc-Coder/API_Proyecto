import { Router } from "express";
import ProductoController from "../controller/producto.controller.js";
import { validarProducto } from "../config/validacionProducto.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import validarErrores from "../config/validarErrores.js";
import { uploadImageMiddleware } from "../config/multer.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";

const routerProducto = Router();
const ROL_ADMIN = 1;

routerProducto.get(
  "/api/productos",
  verificarToken,
  validacionLimitOffset,
  validarErrores,
  ProductoController.obtenerProductos
);

routerProducto.get(
  "/api/productos/:id",
  verificarToken,
  ProductoController.obtenerProductoPorId
);

routerProducto.post(
  "/api/productos",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  uploadImageMiddleware,
  validarProducto,
  validarErrores,
  ProductoController.crearProducto
);

routerProducto.put(
  "/api/productos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  uploadImageMiddleware,
  validarProducto,
  validarErrores,
  ProductoController.actualizarProducto
);

routerProducto.delete(
  "/api/productos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  ProductoController.eliminarProducto
);

export default routerProducto;
