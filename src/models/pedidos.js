import pool from "../config/db.js";
class Pedidos {
    static async CrearPedido(client, folio, id_cliente, total) {
        const result = await client.query("INSERT INTO pedidos (folio, id_cliente, total, estado_pedido) VALUES ($1, $2, $3, 'pagado') RETURNING *", [folio, id_cliente, total]);
        return result.rows[0];
    }
    static async ObtenerPedidos() {
        const result = await pool.query(`SELECT p.*, u.nombre AS nombre_cliente 
       FROM pedidos p 
       JOIN clientes c ON p.id_cliente = c.id_cliente
       JOIN usuarios u ON c.id_usuario = u.id_usuario`);
        return result.rows;
    }
    static async ObtenerPedidoPorId(id_pedido) {
        const result = await pool.query(`SELECT p.*, u.nombre AS nombre_cliente 
       FROM pedidos p 
       JOIN clientes c ON p.id_cliente = c.id_cliente
       JOIN usuarios u ON c.id_usuario = u.id_usuario 
       WHERE p.id_pedido = $1`, [id_pedido]);
        return result.rows[0];
    }
    static async CancelarPedido(id_pedido) {
        const result = await pool.query("UPDATE pedidos SET estado_pedido = 'cancelada' WHERE id_pedido = $1 RETURNING *", [id_pedido]);
        return result.rows[0];
    }
    static async ActualizarEstado(id_pedido, estado) {
        const result = await pool.query("UPDATE pedidos SET estado_pedido = $1 WHERE id_pedido = $2 RETURNING *", [estado, id_pedido]);
        return result.rows[0];
    }
}
export default Pedidos;
