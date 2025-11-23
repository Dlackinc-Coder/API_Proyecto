import pool from "../config/db.js";

class Pedidos {
  static async CrearPedido(id_cliente, estado, metodo_pago, total) {
    const result = await pool.query(
      "INSERT INTO pedidos (id_cliente, estado, metodo_pago, total) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_cliente, estado, metodo_pago, total]
    );
    return result.rows[0];
  }

  static async ObtenerPedidos() {
    const result = await pool.query(
      "SELECT p.*, u.nombre AS nombre_cliente FROM pedidos p LEFT JOIN usuarios u ON p.id_cliente = u.id_usuario WHERE p.fecha_eliminacion IS NULL"
    );
    return result.rows;
  }

  static async ObtenerPedidoPorId(id_pedido) {
    const result = await pool.query(
      "SELECT p.*, u.nombre AS nombre_cliente FROM pedidos p LEFT JOIN usuarios u ON p.id_cliente = u.id_usuario WHERE p.id_pedido = $1",
      [id_pedido]
    );
    return result.rows[0];
  }

  static async EliminarPedido(id_pedido) {
    await pool.query(
      "UPDATE pedidos SET fecha_eliminacion=now() WHERE id_pedido = $1",
      [id_pedido]
    );
  }

  static async ActualizarEstado(id_pedido, estado) {
    const result = await pool.query(
      "UPDATE pedidos SET estado = $1 WHERE id_pedido = $2 RETURNING *",
      [estado, id_pedido]
    );
    return result.rows[0];
  }
}

export default Pedidos;
