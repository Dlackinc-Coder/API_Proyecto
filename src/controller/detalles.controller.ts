import { Request, Response } from "express";
import DetallesPedido from "../models/detalles_pedido.js";
import pool from "../config/db.js";

class DetallesController {

    static async crearDetalle(req: Request, res: Response) {
        const detalle = req.body;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const nuevoDetalle = await DetallesPedido.crearDetalle(client, detalle);
            await client.query("COMMIT");
            res.status(201).json(nuevoDetalle);
        } catch (error) {
            await client.query("ROLLBACK");
            console.error(error);
            res.status(500).json({ error: "Error al crear detalle de pedido" });
        } finally {
            client.release();
        }
    }

    static async obtenerDetallesPorPedido(req: Request, res: Response) {
        try {
            const { id_pedido } = req.params;
            const detalles = await DetallesPedido.obtenerPorPedido(parseInt(id_pedido as string, 10));
            res.status(200).json(detalles);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener detalles" });
        }
    }
}

export default DetallesController;
