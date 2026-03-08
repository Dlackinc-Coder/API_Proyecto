import pool from "../config/db.js";
import { DetallePedido, DBClient } from "../interfaces/database.types.js";

class DetallesPedido {
  static async crearDetalle(
    client: DBClient,
    detalle: { id_pedido: number, id_producto: number, cantidad: number, precio_unitario_venta: number }
  ): Promise<DetallePedido> {
    const { id_pedido, id_producto, cantidad, precio_unitario_venta } = detalle;
    const result = await client.query(
      `INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario_venta) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_pedido, id_producto, cantidad, precio_unitario_venta]
    );
    return result.rows[0];
  }

  static async obtenerPorPedido(id_pedido: number): Promise<any[]> {
    const result = await pool.query(
      `
      SELECT 
        dp.cantidad, 
        dp.precio_unitario_venta as precio_unitario, 
        p.nombre AS nombre_producto,
        p.tipo_grano,
        p.nivel_tostado
      FROM detalle_pedidos dp
      INNER JOIN productos p ON dp.id_producto = p.id_producto
      WHERE dp.id_pedido = $1
      `,
      [id_pedido]
    );
    return result.rows;
  }
}

export default DetallesPedido;
