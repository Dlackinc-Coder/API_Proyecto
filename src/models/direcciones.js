import pool from "../config/db.js";

class DireccionesEnvio {
    static async obtenerPorCliente(id_cliente) {
        const result = await pool.query("SELECT * FROM direcciones_envio WHERE id_cliente = $1", [id_cliente]);
        return result.rows;
    }

    static async obtenerPredeterminada(id_cliente) {
        const result = await pool.query("SELECT * FROM direcciones_envio WHERE id_cliente = $1 AND es_predeterminada = true", [id_cliente]);
        return result.rows[0];
    }

    static async crear(id_cliente, direccion) {
        const { calle, codigo_postal, ciudad, estado, es_predeterminada = false } = direccion;
        const result = await pool.query(
            "INSERT INTO direcciones_envio (id_cliente, calle, codigo_postal, ciudad, estado, es_predeterminada) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [id_cliente, calle, codigo_postal, ciudad, estado, es_predeterminada]
        );
        return result.rows[0];
    }

    static async actualizar(id_direccion, direccion) {
        const { calle, codigo_postal, ciudad, estado, es_predeterminada } = direccion;
        const result = await pool.query(
            `UPDATE direcciones_envio 
             SET calle = $1, codigo_postal = $2, ciudad = $3, estado = $4, es_predeterminada = COALESCE($5, es_predeterminada)
             WHERE id_direccion = $6 RETURNING *`,
            [calle, codigo_postal, ciudad, estado, es_predeterminada, id_direccion]
        );
        return result.rows[0];
    }
}

export default DireccionesEnvio;
