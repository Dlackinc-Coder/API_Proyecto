import pool from "../config/db.js";

class Usuarios {
  static async CrearUsuario(id_rol, nombre, email, contrasena, telefono) {
    const result = await pool.query(
      "INSERT INTO usuarios (id_rol, nombre, email, contrasena, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_rol, nombre, email, contrasena, telefono]
    );
    return result.rows[0];
  }

  static async ObtenerTodosLosUsuarios() {
    const result = await pool.query(
      `SELECT u.*, r.nombre AS nombre_rol
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol = r.id`
    );
    return result.rows;
  }

  static async ObtenerUsuarioPorId(id_usuario) {
    const result = await pool.query(
      `SELECT u.*, r.nombre AS nombre_rol
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol = r.id
       WHERE u.id_usuario = $1 AND u.fecha_eliminacion IS NULL`,
      [id_usuario]
    );
    return result.rows[0];
  }

  static async ObtenerUsuarioPorEmail(email) {
    const result = await pool.query(
      `SELECT u.*, r.nombre AS nombre_rol
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol = r.id
       WHERE u.email = $1 AND u.fecha_eliminacion IS NULL`,
      [email]
    );
    return result.rows[0];
  }

  static async ActualizarUsuario(
    id_usuario,
    nombre,
    email,
    contrasena,
    telefono
  ) {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3, telefono = $4 WHERE id_usuario = $5 RETURNING *",
      [nombre, email, contrasena, telefono, id_usuario]
    );
    return result.rows[0];
  }

  static async EliminarUsuario(id_usuario) {
    const result = await pool.query(
      `UPDATE usuarios SET fecha_eliminacion = NOW() WHERE id_usuario = $1 RETURNING *`,
      [id_usuario]
    );
    return result.rows[0];
  }
}
export default Usuarios;
