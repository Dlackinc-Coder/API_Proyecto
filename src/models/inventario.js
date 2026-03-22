import pool from "../config/db.js";
class Inventario {
    static async RegistrarMovimiento(id_producto, cantidad_movimiento, tipo_movimiento, referencia_documento, id_usuario_responsable, clientCon = null) {
        const runQuery = async (client) => {
            const prodResult = await client.query("SELECT stock_actual FROM productos WHERE id_producto = $1 FOR UPDATE", [id_producto]);
            if (prodResult.rows.length === 0) {
                throw new Error("Producto no encontrado");
            }
            const stock_anterior = prodResult.rows[0].stock_actual;
            const stock_resultante = stock_anterior + cantidad_movimiento;
            const result = await client.query(`INSERT INTO inventario_kardex 
         (id_producto, cantidad_movimiento, stock_anterior, stock_resultante, tipo_movimiento, referencia_documento, id_usuario_responsable) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [id_producto, cantidad_movimiento, stock_anterior, stock_resultante, tipo_movimiento, referencia_documento, id_usuario_responsable]);
            return result.rows[0];
        };
        if (clientCon) {
            return runQuery(clientCon);
        }
        else {
            const client = await pool.connect();
            try {
                await client.query("BEGIN");
                const res = await runQuery(client);
                await client.query("COMMIT");
                return res;
            }
            catch (e) {
                await client.query("ROLLBACK");
                throw e;
            }
            finally {
                client.release();
            }
        }
    }
    static async ObtenerKardexPorProducto(id_producto) {
        const result = await pool.query("SELECT * FROM inventario_kardex WHERE id_producto = $1 ORDER BY fecha DESC", [id_producto]);
        return result.rows;
    }
}
export default Inventario;
