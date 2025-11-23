import pool from "../config/db.js"; 

class Roles {
  static async ObtenerRoles() {
    const result = await pool.query("SELECT * FROM roles");
    return result.rows;
  }
  static async ObtenerRolPorId(id_rol) {
    const result = await pool.query("SELECT * FROM roles WHERE id_rol = $1", [id_rol]);
    return result.rows[0];
  }
}
export default Roles;