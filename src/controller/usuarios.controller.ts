import { Request, Response } from "express";
import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";

class UsuariosController {
  static async crearUsuario(req: Request, res: Response) {
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

      const { password_hash, ...usuarioSinPass } = nuevoUsuario;

      res.status(201).json(usuarioSinPass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  static async obtenerTodosLosUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await Usuarios.ObtenerTodosLosUsuarios();
      // Remover contraseñas antes de devolver
      const usuariosSeguros = usuarios.map(({ password_hash, ...u }) => u);
      res.status(200).json(usuariosSeguros);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  static async obtenerUsuarioPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const usuario = await Usuarios.ObtenerUsuarioPorId(parseInt(id as string, 10));
      if (usuario) {
        // Remover contraseña antes de devolver
        const { password_hash, ...usuarioSinPass } = usuario;
        res.status(200).json(usuarioSinPass);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }

  static async actualizarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, email, contrasena, telefono } = req.body;
    try {
      // Si se proporciona contraseña, hashearla; si no, pasar null
      let hashContrasena = null;
      if (contrasena) {
        const saltRounds = 10;
        hashContrasena = await bcrypt.hash(contrasena, saltRounds);
      }

      // IMPORTANTE: si hashContrasena es null, el modelo lo intentará guardar.
      // Sería ideal ajustar este comportamiento para que mantenga la contraseña si no se pasa.
      // Por simplicidad en la migración asumo que SIEMPRE se envía contrasena o ajustamos
      if (!hashContrasena) {
        return res.status(400).json({ error: "La contraseña es requerida para actualizar" });
      }

      const usuarioActualizado = await Usuarios.ActualizarUsuario(
        parseInt(id as string, 10),
        nombre,
        email,
        hashContrasena, // password_hash
        telefono
      );

      // Remover contraseña antes de devolver
      const { password_hash, ...usuarioSinPass } = usuarioActualizado;
      res.status(200).json(usuarioSinPass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }

  static async eliminarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const usuarioEliminado = await Usuarios.EliminarUsuario(parseInt(id as string, 10));
      // Remover contraseña antes de devolver
      const { password_hash, ...usuarioSinPass } = usuarioEliminado;
      res.status(200).json(usuarioSinPass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
}

export default UsuariosController;