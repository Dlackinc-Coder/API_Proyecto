import Usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";

class AuthController {
  static async login(req, res) {
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
        usuario.contrasena
      );

      if (!contrasenaEsValida) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // 4. GENERAR EL TOKEN JWT
      // Definimos el 'payload' (datos a guardar en el token)
      const payload = {
        id_usuario: usuario.id_usuario,
        id_rol: usuario.id_rol, // ¡Necesario para la autorización por roles!
        email: usuario.email,
      };

      // Leemos la clave secreta desde las variables de entorno
      const secret = process.env.JWT_SECRET || '.env'; // ⚠️ CAMBIA ESTO EN .env

      const token = jwt.sign(
        payload,
        secret,
        { expiresIn: "1h" } // El token expira en 1 hora
      );
      
      // 5. Devolver el token (y datos básicos del usuario) al cliente
      const { contrasena: _, ...usuarioSinContrasena } = usuario; // Desestructuración para omitir la contraseña

      res.status(200).json({ 
          message: "Inicio de sesión exitoso",
          token, 
          usuario: usuarioSinContrasena 
      });

    } catch (error) {
      console.error("Error en el login:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default AuthController;