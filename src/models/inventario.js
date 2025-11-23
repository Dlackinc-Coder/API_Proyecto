import pool from "../config/db.js";

class Inventario {
  static async CrearInventario(id_producto, stock) {
    const result = await pool.query(
      "INSERT INTO inventario (id_producto, stock) VALUES ($1, $2) RETURNING *",
      [id_producto, stock]
    );
    return result.rows[0];
  }
  static async ObtenerInventario() {
    const result = await pool.query(
      "SELECT i.*, p.nombre AS nombre_producto FROM inventario i LEFT JOIN productos p ON i.id_producto = p.id_producto"
    );
    return result.rows;
  }
  static async ActualizarStock(id_inventario, stock) {
    const result = await pool.query(
      "UPDATE inventario SET stock = $1 WHERE id_inventario = $2 RETURNING *",
      [stock, id_inventario]
    );
    return result.rows[0];
  }
  static async RestarStockPorProducto(client, id_producto, cantidad) {
    const result = await client.query(
      `UPDATE inventario 
       SET stock = stock - $1
       WHERE id_producto = $2 AND stock >= $1 
       RETURNING *`,
      [cantidad, id_producto]
    );
    return result.rows[0];
  }
}
export default Inventario;
