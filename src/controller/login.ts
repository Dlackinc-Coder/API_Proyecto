import { Request, Response } from "express";
import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, contrasena } = req.body;

    try {
      const usuario = await Usuarios.ObtenerUsuarioPorEmail(email);

      // 2. Verificar si el usuario existe y si su cuenta no está eliminada
      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // 3. Comparar la contraseña ingresada con la contraseña hasheada de la DB
      const contrasenaEsValida = await bcrypt.compare(
        contrasena,
        usuario.password_hash
      );

      if (!contrasenaEsValida) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

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

      // 5. Devolver el token (y datos básicos) al cliente omitiendo password_hash
      const { password_hash, ...usuarioSinContrasena } = usuario;

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
