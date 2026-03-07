import pool from "../config/db.js";
import { Pedido, OrderStatus } from "../interfaces/database.types.js";

class Pedidos {
  static async CrearPedido(
    client: any,
    folio: string,
    id_cliente: number,
    total: number
  ): Promise<Pedido> {
    const result = await client.query(
      "INSERT INTO pedidos (folio, id_cliente, total, estado_pedido) VALUES ($1, $2, $3, 'pagado') RETURNING *",
      [folio, id_cliente, total]
    );
    return result.rows[0];
  }

  static async ObtenerPedidos(): Promise<(Pedido & { nombre_cliente: string })[]> {
    // La eliminación lógica de pedidos (fecha_eliminacion) no existe en el nuevo esquema
    // Filtramos o mapeamos usando el estado si es necesario, asumiremos que todos son válidos
    const result = await pool.query(
      `SELECT p.*, u.nombre AS nombre_cliente 
       FROM pedidos p 
       JOIN clientes c ON p.id_cliente = c.id_cliente
       JOIN usuarios u ON c.id_usuario = u.id_usuario`
    );
    return result.rows;
  }

  static async ObtenerPedidoPorId(id_pedido: number): Promise<(Pedido & { nombre_cliente: string }) | undefined> {
    const result = await pool.query(
      `SELECT p.*, u.nombre AS nombre_cliente 
       FROM pedidos p 
       JOIN clientes c ON p.id_cliente = c.id_cliente
       JOIN usuarios u ON c.id_usuario = u.id_usuario 
       WHERE p.id_pedido = $1`,
      [id_pedido]
    );
    return result.rows[0];
  }

  static async CancelarPedido(id_pedido: number): Promise<Pedido> {
    const result = await pool.query(
      "UPDATE pedidos SET estado_pedido = 'cancelada' WHERE id_pedido = $1 RETURNING *",
      [id_pedido]
    );
    return result.rows[0];
  }

  static async ActualizarEstado(id_pedido: number, estado: OrderStatus): Promise<Pedido> {
    const result = await pool.query(
      "UPDATE pedidos SET estado_pedido = $1 WHERE id_pedido = $2 RETURNING *",
      [estado, id_pedido]
    );
    return result.rows[0];
  }
}

export default Pedidos;
