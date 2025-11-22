import { Router } from "express";
import UsuariosController from "../controller/usuarios.controller.js";
import validarUsuario from "../config/validacionUsuarios.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import { validationResult } from "express-validator";

const routerUsuario = Router();
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

routerUsuario.post(
  "/api/usuarios",
  validarUsuario,
  validadorErrores,
  (req, res) => {
    UsuariosController.crearUsuario(req, res);
  }
);

routerUsuario.get(
  "/api/usuarios",
  validacionLimitOffset,
  validadorErrores,
  (req, res) => {
    UsuariosController.obtenerTodosLosUsuarios(req, res);
  }
);

routerUsuario.get("/api/usuarios/:id", (req, res) => {
  UsuariosController.obtenerUsuarioPorId(req, res);
});

routerUsuario.put(
  "/api/usuarios/:id",
  validarUsuario,
  validadorErrores,
  (req, res) => {
    UsuariosController.actualizarUsuario(req, res);
  }
);

routerUsuario.delete("/api/usuarios/:id", (req, res) => {
  UsuariosController.eliminarUsuario(req, res);
});

export default routerUsuario;
