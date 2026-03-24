import Inventario from "../models/inventario.js";
class InventarioController {
    static async registrarMovimiento(req, res) {
        try {
            const { id_producto, cantidad_movimiento, tipo_movimiento, referencia_documento, id_usuario_responsable } = req.body;
            const nuevoMovimiento = await Inventario.RegistrarMovimiento(parseInt(id_producto, 10), parseInt(cantidad_movimiento, 10), tipo_movimiento, referencia_documento || null, id_usuario_responsable ? parseInt(id_usuario_responsable, 10) : null);
            res.status(201).json(nuevoMovimiento);
        }
        catch (error) {
            console.error("Error al registrar movimiento:", error);
            res.status(500).json({ error: "Error al registrar el movimiento en el kardex" });
        }
    }
    static async obtenerKardexProducto(req, res) {
        try {
            const { id } = req.params;
            const kardex = await Inventario.ObtenerKardexPorProducto(parseInt(id, 10));
            res.status(200).json(kardex);
        }
        catch (error) {
            console.error("Error al obtener kardex:", error);
            res.status(500).json({ error: "Error al obtener el kardex del producto" });
        }
    }
}
export default InventarioController;
