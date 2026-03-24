import pool from "../config/db.js";
class Productos {
    static async SiguienteSKU() {
        const result = await pool.query("SELECT sku FROM productos WHERE sku LIKE 'CAFE-%' ORDER BY sku DESC LIMIT 1");
        if (result.rows.length === 0) return 'CAFE-001';

        const lastSku = result.rows[0].sku;
        const numberMatch = lastSku.match(/\d+$/);
        if (!numberMatch) return 'CAFE-001';

        const nextNumber = parseInt(numberMatch[0], 10) + 1;
        return `CAFE-${nextNumber.toString().padStart(3, '0')}`;
    }
    static async CrearProducto(sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, cloudinary_url = null, cloudinary_public_id = null) {
        const result = await pool.query(`INSERT INTO productos 
      (sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, estado, cloudinary_url, cloudinary_public_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo', $9, $10) RETURNING *`, [sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, cloudinary_url, cloudinary_public_id]);
        return result.rows[0];
    }
    static async ObtenerProductos(limite, offset) {
        const result = await pool.query("SELECT * FROM productos WHERE estado != 'descontinuado' AND stock_actual > 0 ORDER BY id_producto LIMIT $1 OFFSET $2", [limite, offset]);
        return result.rows;
    }
    static async ObtenerProductoPorId(id_producto) {
        const result = await pool.query("SELECT * FROM productos WHERE id_producto = $1 AND estado != 'descontinuado' AND stock_actual > 0", [id_producto]);
        return result.rows[0];
    }
    static async ActualizarProducto(id_producto, sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, cloudinary_url = null, cloudinary_public_id = null) {
        const result = await pool.query(`UPDATE productos 
       SET sku = $1, nombre = $2, id_region = $3, tipo_grano = $4, nivel_tostado = $5, notas_cata_texto = $6, precio_actual = $7, stock_minimo = $8, cloudinary_url = $9, cloudinary_public_id = $10 
       WHERE id_producto = $11 RETURNING *`, [sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo, cloudinary_url, cloudinary_public_id, id_producto]);
        return result.rows[0];
    }
    static async EliminarProducto(id_producto) {
        const result = await pool.query(`UPDATE productos SET estado = 'descontinuado' WHERE id_producto = $1 RETURNING *`, [id_producto]);
        return result.rows[0];
    }
}
export default Productos;
