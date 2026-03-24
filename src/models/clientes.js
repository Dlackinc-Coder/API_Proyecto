import pool from "../config/db.js";

class Clientes {
    static async obtenerPorUsuario(id_usuario) {
        const result = await pool.query("SELECT * FROM clientes WHERE id_usuario = $1", [id_usuario]);
        return result.rows[0];
    }

    static async crear(id_usuario) {
        const result = await pool.query("INSERT INTO clientes (id_usuario) VALUES ($1) RETURNING *", [id_usuario]);
        return result.rows[0];
    }
}

export default Clientes;
