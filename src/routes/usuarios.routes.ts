import { Router } from "express";
import UsuariosController from "../controller/usuarios.controller.js";
import validarUsuario from "../config/validacionUsuarios.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import validarErrores from "../config/validarErrores.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";
const routerUsuario = Router();
const ROL_ADMIN = 1;

routerUsuario.post(
  "/api/usuarios",
  validarUsuario,
  validarErrores,
  UsuariosController.crearUsuario
);

routerUsuario.get(
  "/api/usuarios",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validacionLimitOffset,
  validarErrores,
  UsuariosController.obtenerTodosLosUsuarios
);

routerUsuario.get(
  "/api/usuarios/:id",
  verificarToken,
  UsuariosController.obtenerUsuarioPorId
);

routerUsuario.put(
  "/api/usuarios/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  validarUsuario,
  validarErrores,
  UsuariosController.actualizarUsuario
);

routerUsuario.delete(
  "/api/usuarios/:id",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  UsuariosController.eliminarUsuario
);


export default routerUsuario;
