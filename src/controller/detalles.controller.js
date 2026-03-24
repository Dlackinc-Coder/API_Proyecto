import DetallesPedido from "../models/detalles_pedido.js";
import pool from "../config/db.js";
class DetallesController {
    static async crearDetalle(req, res) {
        const detalle = req.body;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const nuevoDetalle = await DetallesPedido.crearDetalle(client, detalle);
            await client.query("COMMIT");
            res.status(201).json(nuevoDetalle);
        }
        catch (error) {
            await client.query("ROLLBACK");
            console.error(error);
            res.status(500).json({ error: "Error al crear detalle de pedido" });
        }
        finally {
            client.release();
        }
    }
    static async obtenerDetallesPorPedido(req, res) {
        try {
            const { id_pedido } = req.params;
            const detalles = await DetallesPedido.obtenerPorPedido(parseInt(id_pedido, 10));
            res.status(200).json(detalles);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener detalles" });
        }
    }
}
export default DetallesController;
