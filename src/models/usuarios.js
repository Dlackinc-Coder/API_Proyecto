import pool from "../config/db.js";
class Usuarios {
    static async CrearUsuario(id_rol, nombre, email, contrasena, telefono) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const resUsuario = await client.query("INSERT INTO usuarios (nombre, email, password_hash, telefono, activo) VALUES ($1, $2, $3, $4, true) RETURNING *", [nombre, email, contrasena, telefono]);
            const usuario = resUsuario.rows[0];
            await client.query("INSERT INTO usuarios_roles (id_usuario, id_rol) VALUES ($1, $2)", [usuario.id_usuario, id_rol]);
            await client.query("COMMIT");
            return usuario;
        }
        catch (e) {
            await client.query("ROLLBACK");
            throw e;
        }
        finally {
            client.release();
        }
    }
    static async ObtenerTodosLosUsuarios() {
        const result = await pool.query(`SELECT u.*, r.nombre_rol, ur.id_rol
       FROM usuarios u
       LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
       LEFT JOIN roles r ON ur.id_rol = r.id_rol
       WHERE u.activo = true`);
        return result.rows;
    }
    static async ObtenerUsuarioPorId(id_usuario) {
        const result = await pool.query(`SELECT u.*, r.nombre_rol, ur.id_rol
       FROM usuarios u
       LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
       LEFT JOIN roles r ON ur.id_rol = r.id_rol
       WHERE u.id_usuario = $1 AND u.activo = true`, [id_usuario]);
        return result.rows[0];
    }
    static async ObtenerUsuarioPorEmail(email) {
        const result = await pool.query(`SELECT u.*, r.nombre_rol, ur.id_rol
       FROM usuarios u
       LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
       LEFT JOIN roles r ON ur.id_rol = r.id_rol
       WHERE u.email = $1 AND u.activo = true`, [email]);
        return result.rows[0];
    }
    static async ActualizarUsuario(id_usuario, nombre, email, contrasena, telefono) {
        const result = await pool.query(`UPDATE usuarios 
       SET nombre = COALESCE($1, nombre), 
           email = COALESCE($2, email), 
           password_hash = COALESCE($3, password_hash),
           telefono = COALESCE($4, telefono) 
       WHERE id_usuario = $5 
       RETURNING *`, [nombre, email, contrasena, telefono, id_usuario]);
        return result.rows[0];
    }
    static async EliminarUsuario(id_usuario) {
        const result = await pool.query(`UPDATE usuarios SET activo = false WHERE id_usuario = $1 RETURNING *`, [id_usuario]);
        return result.rows[0];
    }
}
export default Usuarios;
