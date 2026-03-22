import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";
class UsuariosController {
    static async crearUsuario(req, res) {
        const { id_rol, nombre, email, password, telefono } = req.body;
        try {
            // Verificar si el email ya existe
            const usuarioExistente = await Usuarios.ObtenerUsuarioPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    error: "El email ya está registrado"
                });
            }
            // CIFRADO DE CONTRASEÑA
            const saltRounds = 10;
            const hashContrasena = await bcrypt.hash(password, saltRounds);
            const nuevoUsuario = await Usuarios.CrearUsuario(id_rol, nombre, email, hashContrasena, telefono);
            const { password_hash, ...usuarioSinPass } = nuevoUsuario;
            res.status(201).json(usuarioSinPass);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al crear el usuario" });
        }
    }
    static async obtenerTodosLosUsuarios(req, res) {
        try {
            const usuarios = await Usuarios.ObtenerTodosLosUsuarios();
            const usuariosSeguros = usuarios.map(({ password_hash, ...u }) => u);
            res.status(200).json(usuariosSeguros);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    }
    static async obtenerUsuarioPorId(req, res) {
        const { id } = req.params;
        try {
            const usuario = await Usuarios.ObtenerUsuarioPorId(parseInt(id, 10));
            if (usuario) {
                const { password_hash, ...usuarioSinPass } = usuario;
                res.status(200).json(usuarioSinPass);
            }
            else {
                res.status(404).json({ error: "Usuario no encontrado" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }
    static async actualizarUsuario(req, res) {
        const { id } = req.params;
        const { nombre, email, password, telefono } = req.body;
        try {
            let hashContrasena = null;
            if (password) {
                const saltRounds = 10;
                hashContrasena = await bcrypt.hash(password, saltRounds);
            }
            const usuarioActualizado = await Usuarios.ActualizarUsuario(parseInt(id, 10), nombre, email, hashContrasena, telefono);
            const { password_hash, ...usuarioSinPass } = usuarioActualizado;
            res.status(200).json(usuarioSinPass);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar el usuario" });
        }
    }
    static async eliminarUsuario(req, res) {
        const { id } = req.params;
        try {
            const usuarioEliminado = await Usuarios.EliminarUsuario(parseInt(id, 10));
            const { password_hash, ...usuarioSinPass } = usuarioEliminado;
            res.status(200).json(usuarioSinPass);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar el usuario" });
        }
    }
}
export default UsuariosController;
