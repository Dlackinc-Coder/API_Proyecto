import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";

class UsuariosController {
  static async crearUsuario(req, res) {
    const { id_rol, nombre, email, contrasena, telefono } = req.body;
    try {
      // CIFRADO DE CONTRASEÑA
      const saltRounds = 10;
      const hashContrasena = await bcrypt.hash(contrasena, saltRounds);

      const nuevoUsuario = await Usuarios.CrearUsuario(
        id_rol,
        nombre,
        email,
        hashContrasena, // Guardamos el Hash, no el texto plano
        telefono
      );
      delete nuevoUsuario.contrasena;

      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  static async obtenerTodosLosUsuarios(req, res) {
    try {
      let usuarios = await Usuarios.ObtenerTodosLosUsuarios();
      // Remover contraseñas antes de devolver
      usuarios = usuarios.map((u) => {
        delete u.contrasena;
        return u;
      });
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
        // Remover contraseña antes de devolver
        delete usuario.contrasena;
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
    let { nombre, email, contrasena, telefono } = req.body;
    try {
      // Si se proporciona contraseña, hashearla; si no, pasar null
      let hashContrasena = null;
      if (contrasena) {
        const saltRounds = 10;
        hashContrasena = await bcrypt.hash(contrasena, saltRounds);
      }

      const usuarioActualizado = await Usuarios.ActualizarUsuario(
        id,
        nombre,
        email,
        hashContrasena,
        telefono
      );
      
      // Remover contraseña antes de devolver
      delete usuarioActualizado.contrasena;
      res.status(200).json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }

  static async eliminarUsuario(req, res) {
    const { id } = req.params;
    try {
      const usuarioEliminado = await Usuarios.EliminarUsuario(id);
      // Remover contraseña antes de devolver
      delete usuarioEliminado.contrasena;
      res.status(200).json(usuarioEliminado);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
}

export default UsuariosController;