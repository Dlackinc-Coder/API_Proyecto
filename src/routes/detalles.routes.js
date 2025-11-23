import { Router } from "express";
import DetallesController from "../controller/detalles.controller.js";
import { validationResult } from "express-validator";
import ValidarDetalles from "../config/validacionDetalles.js";

const routerDetalles = Router();

function validadorErrores(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      mesange: "Error en la validación",
      error: error.array(),
    });
  }
  next();
}
routerDetalles.post(
  "/api/detalles",
  ValidarDetalles,
  validadorErrores,
  DetallesController.crearDetalle
);
routerDetalles.get(
  "/api/detalles/:id_pedido",
  DetallesController.obtenerDetallesPorPedido
);

export default routerDetalles;
