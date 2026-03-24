import { Router } from "express";
import { getReporteVentas, getReporteInventario } from "../controller/reportes.controller.js";

const routerReportes = Router();

routerReportes.get("/reportes/ventas", getReporteVentas);
routerReportes.get("/reportes/inventario", getReporteInventario);

export default routerReportes;
