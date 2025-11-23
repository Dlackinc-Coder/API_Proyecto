import pool from "../config/db.js"; 

class DetallesPedido {
  static async crearDetalle(detalle) {
    const { id_pedido, id_producto, cantidad, precio_unitario } = detalle;
    const result = await pool.query(
      "INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_pedido, id_producto, cantidad, precio_unitario]
    );
    return result.rows[0];
  }

  static async obtenerPorPedido(id_pedido) {
    const result = await pool.query(
      `
      SELECT 
        dp.cantidad, 
        dp.precio_unitario, 
        p.nombre AS nombre_producto,
        p.tipo AS tipo_producto
      FROM detalles_pedido dp
      INNER JOIN productos p ON dp.id_producto = p.id_producto
      WHERE dp.id_pedido = $1
      `,
      [id_pedido]
    );
    return result.rows;
  }
}

export default DetallesPedido;
