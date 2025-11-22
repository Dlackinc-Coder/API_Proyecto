import Usuarios from "../models/usuarios.js";

class UsuariosController {
  static async crearUsuario(req, res) {
    const { id_rol, nombre, email, contrasena, telefono } = req.body;
    try {
      const nuevoUsuario = await Usuarios.CrearUsuario(
        id_rol,
        nombre,
        email,
        contrasena,
        telefono
      );
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  static async obtenerTodosLosUsuarios(req, res) {
    try {
      const usuarios = await Usuarios.ObtenerTodosLosUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  static async obtenerUsuarioPorId(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuarios.ObtenerUsuarioPorId(id);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }

  static async actualizarUsuario(req, res) {
    const { id } = req.params;
    const { nombre, email, contrasena, telefono } = req.body;
    try {
      const usuarioActualizado = await Usuarios.ActualizarUsuario(
        id,
        nombre,
        email,
        contrasena,
        telefono
      );
      res.status(200).json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }

  static async eliminarUsuario(req, res) {
    const { id } = req.params;
    try {
      const usuarioEliminado = await Usuarios.EliminarUsuario(id);
      res.status(200).json(usuarioEliminado);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
}
export default UsuariosController;
