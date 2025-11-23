import pool from "../config/db.js";

class Documentos {
  static async crearDocumento(documento) {
    const {
      id_empleado,
      tipo_documento,
      url_documento,
      estado,
      fecha_vencimiento,
    } = documento;
    const result = await pool.query(
      "INSERT INTO documentos_personal (id_empleado, tipo_documento, url_documento, estado, fecha_vencimiento) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_empleado, tipo_documento, url_documento, estado, fecha_vencimiento]
    );
    return result.rows[0];
  }

  static async obtenerDocumentoPorId(id_documento) {
    const result = await pool.query(
      "SELECT * FROM documentos_personal WHERE id_documento = $1",
      [id_documento]
    );
    return result.rows[0];
  }

  static async actualizarDocumento(id_documento, documento) {
    const {
      id_empleado,
      tipo_documento,
      url_documento,
      estado,
      fecha_vencimiento,
    } = documento;

    const result = await pool.query(
      `UPDATE documentos_personal
       SET id_empleado = $1,
           tipo_documento = $2,
           url_documento = $3,
           estado = $4,
           fecha_vencimiento = $5
       WHERE id_documento = $6
       RETURNING *`,
      [
        id_empleado,
        tipo_documento,
        url_documento,
        estado,
        fecha_vencimiento,
        id_documento,
      ]
    );
    return result.rows[0];
  }

  static async obtenerDocumentosPorEmpleado(id_empleado) {
    const result = await pool.query(
      "SELECT * FROM documentos_personal WHERE id_empleado = $1",
      [id_empleado]
    );
    return result.rows;
  }

  static async obtenerDocumentosPorVencer() {
    const result = await pool.query(
      `SELECT dp.*, u.nombre AS nombre_empleado 
       FROM documentos_personal dp
       JOIN usuarios u ON dp.id_empleado = u.id_usuario
       WHERE dp.fecha_vencimiento BETWEEN NOW()::DATE AND (NOW() + interval '30 day')::DATE
       AND dp.estado = 'validado'
       ORDER BY dp.fecha_vencimiento ASC`
    );
    return result.rows;
  }

  static async actualizarEstadoDocumento(id_documento, nuevo_estado) {
    const result = await pool.query(
      "UPDATE documentos_personal SET estado = $1 WHERE id_documento = $2 RETURNING *",
      [nuevo_estado, id_documento]
    );
    return result.rows[0];
  }
}
export default Documentos;
