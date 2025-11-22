import pool from "../config/db";
class Roles {
  static async ObtenerRoles() {
    const result = await pool.query("SELECT * FROM roles");
    return result.rows;
  }
  static async ObtenerRolPorId(id) {
    const result = await pool.query("SELECT * FROM roles WHERE id = $1", [id]);
    return result.rows[0];
  }
}
export default Roles;
