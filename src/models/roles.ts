import pool from "../config/db.js";
import { Rol } from "../interfaces/database.types.js";

class Roles {
  static async ObtenerRoles(): Promise<Rol[]> {
    const result = await pool.query("SELECT * FROM roles");
    return result.rows;
  }

  static async ObtenerRolPorId(id_rol: number): Promise<Rol | undefined> {
    const result = await pool.query("SELECT * FROM roles WHERE id_rol = $1", [id_rol]);
    return result.rows[0];
  }
}
export default Roles;