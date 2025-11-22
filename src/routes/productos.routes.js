import { Router } from "express";
import ProductoController from "../controller/producto.controller.js";
import { validarProducto } from "../config/validacionProducto.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import { validationResult } from "express-validator";

const routerProducto = Router();
function validadorErrores(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      mesange: "Error en la validacio",
      error: error.array(),
    });
  }
  next();
}

routerProducto.post("/api/productos", validarProducto, validadorErrores,(req, res)=>{
    ProductoController.crearProducto(req, res);
});

routerProducto.get("/api/productos", validacionLimitOffset, validadorErrores,(req, res)=>{
    ProductoController.obtenerProductos(req, res);
});

routerProducto.get("/api/productos/:id", (req, res)=>{
    ProductoController.obtenerProductoPorId(req, res);
});

routerProducto.put("/api/productos/:id", validarProducto, validadorErrores,(req, res)=>{
    ProductoController.actualizarProducto(req, res);
});

routerProducto.delete("/api/productos/:id", (req, res)=>{
    ProductoController.eliminarProducto(req, res);
});

export default routerProducto;  
