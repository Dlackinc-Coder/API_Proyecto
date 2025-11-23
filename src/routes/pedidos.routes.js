import { Router } from "express";
import PedidoController from "../controller/pedidos.controller.js";
import validarPedidos from "../config/validacionPedidos.js";
import validarErrores from "../config/validarErrores.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";

const routerPedidos = Router();
const ROL_ADMIN = 1;
const ROL_CLIENTE = 3;

// =================================================================
// 1. POST: CREAR PEDIDO (Acceso para cualquier usuario logueado)
// =================================================================
routerPedidos.post(
  "/api/pedidos",
  verificarToken,
  validarPedidos,
  validarErrores,
  PedidoController.crearPedido
);

// =================================================================
// 2. GET: OBTENER TODOS LOS PEDIDOS (Solo Administradores)
// =================================================================
routerPedidos.get(
  "/api/pedidos",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validacionLimitOffset,
  validarErrores,
  PedidoController.obtenerTodosLosPedidos
);

// =================================================================
// 3. GET: OBTENER PEDIDO POR ID (Admin O Cliente Propio - Lógica en Controller)
// =================================================================
routerPedidos.get(
  "/api/pedidos/:id",
  verificarToken,
  PedidoController.obtenerPedidoPorId
);

// =================================================================
// 4. PUT: ACTUALIZAR PEDIDO (Solo Administradores - Cambios de estado, etc.)
// =================================================================
routerPedidos.put(
  "/api/pedidos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]), 
  validarPedidos,
  validarErrores,
  PedidoController.actualizarPedido
);

// =================================================================
// 5. DELETE: ELIMINAR PEDIDO (Solo Administradores)
// =================================================================
routerPedidos.delete(
  "/api/pedidos/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  PedidoController.eliminarPedido
);

export default routerPedidos;
