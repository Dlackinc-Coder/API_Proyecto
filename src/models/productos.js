import pool from "../config/db.js";

class Productos {
  static async CrearProducto(
    nombre,
    tipo,
    variedad,
    precio,
    descripcion,
    imagen_url
  ) {
    const result = await pool.query(
      "INSERT INTO productos (nombre, tipo, variedad, precio, descripcion, imagen_url,) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, tipo, variedad, precio, descripcion, imagen_url]
    );
    return result.rows[0];
  }

  static async ObtenerProductos(limite, offset) {
    const result = await pool.query(
      "SELECT * FROM productos ORDER BY id_producto LIMIT $1 OFFSET $2",
      [limite, offset]
    );
    return result.rows;
  }

  static async ObtenerProductoPorId(id_producto) {
    const result = await pool.query(
      "SELECT * FROM productos WHERE id_producto = $1",
      [id_producto]
    );
    return result.rows[0];
  }

  static async ActualizarProducto(
    id_producto,
    nombre,
    tipo,
    variedad,
    precio,
    descripcion,
    imagen_url
  ) {
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, tipo = $2, variedad = $3, precio = $4, descripcion = $5, imagen_url = $6 WHERE id_producto = $7 RETURNING *",
      [nombre, tipo, variedad, precio, descripcion, imagen_url, id_producto]
    );
    return result.rows[0];
  }

  static async EliminarProducto(id_producto) {
    const result = await pool.query(
      `UPDATE productos SET fecha_eliminacion = NOW() WHERE id_producto = $1 RETURNING *`,
      [id_producto]
    );
    return result.rows[0];
  }
}

export default Productos;
