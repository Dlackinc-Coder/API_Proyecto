import { Request, Response } from "express";
import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const usuario = await Usuarios.ObtenerUsuarioPorEmail(email);

      // 2. Verificar si el usuario existe y si su cuenta no está eliminada o desactivada
      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas o cuenta desactivada" });
      }

      if (!usuario.activo) {
        return res.status(403).json({ error: "Cuenta desactivada. Contacte al administrador." });
      }

      // Verificar si está bloqueado temporalmente
      if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
        const minutosRestantes = Math.ceil(
          (new Date(usuario.bloqueado_hasta).getTime() - Date.now()) / 60000
        );
        return res.status(429).json({
          error: `Cuenta temporalmente bloqueada. Intente nuevamente en ${minutosRestantes} minutos.`
        });
      }

      // 3. Comparar la contraseña ingresada con la contraseña hasheada de la DB
      const contrasenaEsValida = await bcrypt.compare(
        password,
        usuario.password_hash
      );

      if (!contrasenaEsValida) {
        // INCREMENTAR INTENTOS FALLIDOS
        await pool.query(
          `UPDATE usuarios 
           SET intentos_login_fallidos = intentos_login_fallidos + 1,
               bloqueado_hasta = CASE 
                 WHEN intentos_login_fallidos + 1 >= 5 
                 THEN NOW() + interval '15 minutes'
                 ELSE bloqueado_hasta
               END
           WHERE id_usuario = $1`,
          [usuario.id_usuario]
        );

        return res.status(401).json({
          error: "Credenciales inválidas",
          intentos_restantes: Math.max(0, 5 - (usuario.intentos_login_fallidos + 1))
        });
      }

      // RESETEAR INTENTOS LUEGO DE LOGIN EXITOSO
      await pool.query(
        `UPDATE usuarios 
         SET intentos_login_fallidos = 0, 
             bloqueado_hasta = NULL,
             ultimo_login = NOW()
         WHERE id_usuario = $1`,
        [usuario.id_usuario]
      );

      // 4. GENERAR EL TOKEN JWT
      const payload = {
        id_usuario: usuario.id_usuario,
        nombre_rol: usuario.nombre_rol,
        email: usuario.email,
      };

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET no está configurado en variables de entorno");
      }

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      // 5. Devolver el token y datos
      const { password_hash, intentos_login_fallidos, bloqueado_hasta, ...usuarioSinContrasena } = usuario;

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token,
        usuario: usuarioSinContrasena,
      });
    } catch (error) {
      console.error("Error en el login:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default AuthController;
