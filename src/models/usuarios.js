import pool from "../db.js";
class Usuarios {
  static async CrearUsuario(id_rol, nombre, email, contrasena, telefono) {
    const result = await pool.query(
      "INSERT INTO usuarios (id_rol,nombre, email,contrasena,telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_rol, nombre, email, contrasena, telefono]
    );
    return result.rows[0];
  }

  static async ObtenerTodosLosUsuarios() {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
  }

  static async ObtenerUsuarioPorId(id) {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async ObtenerUsuarioPorEmail(email) {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async ActualizarUsuario(id, nombre, email, contrasena, telefono) {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3, telefono = $4 WHERE id = $5 RETURNING *",
      [nombre, email, contrasena, telefono, id]
    );
    return result.rows[0];
  }

  static async EliminarUsuario(id) {
    const result = await pool.query(
      `UPDATE usuarios SET fecha_eliminacion = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

export default Usuarios;
