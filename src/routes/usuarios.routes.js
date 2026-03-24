import { Router } from "express";
import UsuariosController from "../controller/usuarios.controller.js";
import DireccionesController from "../controller/direcciones.controller.js";
import validarUsuario from "../config/validacionUsuarios.js";
import validacionLimitOffset from "../config/validacionLimit-Offset.js";
import validarErrores from "../config/validarErrores.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";

const routerUsuario = Router();
const ROL_ADMIN = 1;

// USUARIOS
routerUsuario.post("/api/usuarios", validarUsuario, validarErrores, UsuariosController.crearUsuario);
routerUsuario.get("/api/usuarios", verificarToken, verificarRol([ROL_ADMIN]), validacionLimitOffset, validarErrores, UsuariosController.obtenerTodosLosUsuarios);
routerUsuario.get("/api/usuarios/:id", verificarToken, UsuariosController.obtenerUsuarioPorId);

// Permitir que un usuario se actualice a sí mismo o que un Admin lo haga
routerUsuario.put("/api/usuarios/:id", verificarToken, (req, res, next) => {
    if (req.usuario.id_rol === ROL_ADMIN || req.usuario.id_usuario === parseInt(req.params.id, 10)) {
        next();
    } else {
        res.status(403).json({ error: "No tienes permiso para actualizar este usuario" });
    }
}, validarUsuario, validarErrores, UsuariosController.actualizarUsuario);

routerUsuario.delete("/api/usuarios/:id", verificarToken, verificarRol([ROL_ADMIN]), UsuariosController.eliminarUsuario);

// DIRECCIONES DE ENVIO
routerUsuario.get("/api/direcciones", verificarToken, DireccionesController.obtenerMisDirecciones);
routerUsuario.post("/api/direcciones", verificarToken, DireccionesController.guardarDireccion);

export default routerUsuario;
