import pool from "../config/db.js";
class Documentos {
    static async crearDocumento(documento) {
        const { id_empleado, tipo_documento, cloudinary_url, cloudinary_public_id, fecha_expiracion, } = documento;
        const result = await pool.query(`INSERT INTO documentos_empleado 
       (id_empleado, tipo_documento, cloudinary_url, cloudinary_public_id, estado_validacion, fecha_expiracion) 
       VALUES ($1, $2, $3, $4, 'pendiente', $5) RETURNING *`, [id_empleado, tipo_documento, cloudinary_url, cloudinary_public_id, fecha_expiracion || null]);
        return result.rows[0];
    }
    static async obtenerDocumentoPorId(id_documento) {
        const result = await pool.query("SELECT * FROM documentos_empleado WHERE id_documento = $1", [id_documento]);
        return result.rows[0];
    }
    static async actualizarDocumento(id_documento, documento) {
        const { id_empleado, tipo_documento, cloudinary_url, cloudinary_public_id, estado_validacion, fecha_expiracion, } = documento;
        const result = await pool.query(`UPDATE documentos_empleado
       SET id_empleado = COALESCE($1, id_empleado),
           tipo_documento = COALESCE($2, tipo_documento),
           cloudinary_url = COALESCE($3, cloudinary_url),
           cloudinary_public_id = COALESCE($4, cloudinary_public_id),
           estado_validacion = COALESCE($5, estado_validacion),
           fecha_expiracion = COALESCE($6, fecha_expiracion)
       WHERE id_documento = $7
       RETURNING *`, [
            id_empleado,
            tipo_documento,
            cloudinary_url,
            cloudinary_public_id,
            estado_validacion,
            fecha_expiracion,
            id_documento,
        ]);
        return result.rows[0];
    }
    static async obtenerDocumentosPorEmpleado(id_empleado) {
        const result = await pool.query("SELECT * FROM documentos_empleado WHERE id_empleado = $1", [id_empleado]);
        return result.rows;
    }
    static async obtenerDocumentosPorVencer() {
        const result = await pool.query(`SELECT de.*, u.nombre AS nombre_empleado 
       FROM documentos_empleado de
       JOIN empleados e ON de.id_empleado = e.id_empleado
       JOIN usuarios u ON e.id_usuario = u.id_usuario
       WHERE de.fecha_expiracion BETWEEN NOW()::DATE AND (NOW() + interval '30 day')::DATE
       AND de.estado_validacion = 'aprobado'
       ORDER BY de.fecha_expiracion ASC`);
        return result.rows;
    }
    static async actualizarEstadoDocumento(id_documento, nuevo_estado, id_validador, notas_rechazo = null) {
        const result = await pool.query(`UPDATE documentos_empleado 
       SET estado_validacion = $1, validado_por = $2, fecha_validacion = CURRENT_TIMESTAMP, notas_rechazo = $3
       WHERE id_documento = $4 RETURNING *`, [nuevo_estado, id_validador, notas_rechazo, id_documento]);
        return result.rows[0];
    }
}
export default Documentos;
