import InventarioController from "../controller/inventario.controller.js";
import express from "express";
import validacionLimit_Offset from "../config/validacionLimit-Offset.js";
import validarInventario from "../config/validacionInventario.js";
import validarErrores from "../config/validarErrores.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";

const routerInventario = express.Router();
const ROL_ADMIN = 1;

routerInventario.post(
  "/api/inventario",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validarInventario,
  validarErrores,
  InventarioController.crearInventario
);

routerInventario.get(
  "/api/inventario",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validacionLimit_Offset,
  validarErrores,
  InventarioController.obtenerInventario
);

routerInventario.put(
  "/api/inventario/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validarInventario,
  validarErrores,
  InventarioController.actualizarStock
);

export default routerInventario;
