import jwt from "jsonwebtoken";

// Middleware que verifica el JWT y adjunta los datos del usuario a req.usuario
export const verificarToken = (req, res, next) => {
  // 1. Obtener el encabezado de autorización
  const authHeader = req.headers["authorization"];

  // Verificar que el encabezado existe (Bearer <token>)
  if (!authHeader) {
    return res.status(401).json({
      error: "Acceso denegado. Se requiere un token de autenticación.",
    });
  }

  // Separar el esquema 'Bearer ' del token
  const token = authHeader.split(" ")[1];

  // Verificar que el token exista después de 'Bearer '
  if (!token) {
    return res
      .status(401)
      .json({ error: "Formato de token inválido. Use 'Bearer <token>'" });
  }

  try {
    // 2. Verificar y decodificar el token usando la clave secreta
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET no está configurado en variables de entorno");
    }

    // jwt.verify() lanza un error si el token es inválido o ha expirado
    const decoded = jwt.verify(token, secret);

    // 3. Adjuntar el payload decodificado al objeto request (req)
    // Ahora, en el controlador, puedes acceder a req.usuario.id_usuario o req.usuario.id_rol
    req.usuario = decoded;

    // 4. Si es válido, pasar al siguiente middleware o controlador
    next();
  } catch (ex) {
    // Error 403: Prohibido (Token inválido o expirado)
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
};

// Middleware para verificar el rol (Autorización)
export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Asume que 'verificarToken' ya se ejecutó y adjuntó el usuario
    if (!req.usuario) {
      return res.status(403).json({
        error: "Acceso denegado. Información de usuario no disponible.",
      });
    }

    const userRole = req.usuario.id_rol;

    // Comprueba si el id_rol del usuario está en la lista de roles permitidos
    if (rolesPermitidos.includes(userRole)) {
      next(); 
    } else {
      return res.status(403).json({
        error:
          "Permiso insuficiente. No tiene el rol necesario para esta acción.",
      });
    }
  };
};
