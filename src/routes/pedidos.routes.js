import { Router } from "express";
import PedidoController from "../controller/pedidos.controller.js";
import { validarActualizarEstadoPedido, validarCrearPedido } from "../config/validacionPedidos.js";
import validarErrores from "../config/validarErrores.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";
const routerPedidos = Router();
const ROL_ADMIN = 1;
const ROL_CLIENTE = 3;

routerPedidos.post("/api/pedidos", verificarToken, validarCrearPedido, validarErrores, PedidoController.crearPedido);
routerPedidos.get("/api/pedidos", verificarToken, verificarRol([ROL_ADMIN]), validacionLimitOffset, validarErrores, PedidoController.obtenerTodosLosPedidos);
routerPedidos.get("/api/pedidos/:id", verificarToken, PedidoController.obtenerPedidoPorId);
routerPedidos.put("/api/pedidos/:id", verificarToken, verificarRol([ROL_ADMIN]), validarActualizarEstadoPedido, validarErrores, PedidoController.ActualizarEstado);
routerPedidos.delete("/api/pedidos/:id", verificarToken, verificarRol([ROL_ADMIN]), PedidoController.eliminarPedido);
export default routerPedidos;
