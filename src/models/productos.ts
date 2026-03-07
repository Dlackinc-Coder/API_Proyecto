import pool from "../config/db.js";
import { Producto, GrainType, RoastLevel, ProductStatus } from "../interfaces/database.types.js";

class Productos {
  static async CrearProducto(
    sku: string,
    nombre: string,
    id_region: number,
    tipo_grano: GrainType,
    nivel_tostado: RoastLevel,
    notas_cata_texto: string,
    precio_actual: number,
    stock_minimo: number
  ): Promise<Producto> {
    const result = await pool.query(
      `INSERT INTO productos 
      (sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, estado) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo') RETURNING *`,
      [sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo]
    );
    return result.rows[0];
  }

  static async ObtenerProductos(limite: number, offset: number): Promise<Producto[]> {
    const result = await pool.query(
      "SELECT * FROM productos WHERE estado != 'descontinuado' ORDER BY id_producto LIMIT $1 OFFSET $2",
      [limite, offset]
    );
    return result.rows;
  }

  static async ObtenerProductoPorId(id_producto: number): Promise<Producto | undefined> {
    const result = await pool.query(
      "SELECT * FROM productos WHERE id_producto = $1 AND estado != 'descontinuado'",
      [id_producto]
    );
    return result.rows[0];
  }

  static async ActualizarProducto(
    id_producto: number,
    sku: string,
    nombre: string,
    id_region: number,
    tipo_grano: GrainType,
    nivel_tostado: RoastLevel,
    notas_cata_texto: string,
    precio_actual: number,
    stock_minimo: number
  ): Promise<Producto> {
    const result = await pool.query(
      `UPDATE productos 
       SET sku = $1, nombre = $2, id_region = $3, tipo_grano = $4, nivel_tostado = $5, notas_cata_texto = $6, precio_actual = $7, stock_minimo = $8 
       WHERE id_producto = $9 RETURNING *`,
      [sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, id_producto]
    );
    return result.rows[0];
  }

  static async EliminarProducto(id_producto: number): Promise<Producto> {
    const result = await pool.query(
      `UPDATE productos SET estado = 'descontinuado' WHERE id_producto = $1 RETURNING *`,
      [id_producto]
    );
    return result.rows[0];
  }
}

export default Productos;
