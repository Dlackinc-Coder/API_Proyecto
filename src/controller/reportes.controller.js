import pool from "../config/db.js";

export const getReporteVentas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: "Las fechas de inicio y fin son obligatorias" });
        }
        const query = 'SELECT * FROM sp_generar_reporte_ventas($1, $2)';
        const result = await pool.query(query, [fecha_inicio, fecha_fin]);
        return res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error("Error al obtener reporte de ventas:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getReporteInventario = async (req, res) => {
    try {
        const query = 'SELECT * FROM sp_generar_reporte_inventario()';
        const result = await pool.query(query);
        return res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error("Error al obtener reporte de inventario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
