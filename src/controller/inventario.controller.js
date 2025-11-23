import Inventario from "../models/inventario.js";
class InventarioController {
  static async crearInventario(req, res) {
    try {
      const { id_producto, stock } = req.body;
      const nuevoInventario = await Inventario.CrearInventario(
        id_producto,
        stock
      );
      res.status(201).json(nuevoInventario);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el inventario" });
    }
  }

  static async obtenerInventario(req, res) {
    try {
      const inventario = await Inventario.ObtenerInventario();
      res.status(200).json(inventario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el inventario" });
    }
}

  static async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const inventarioActualizado = await Inventario.ActualizarStock(id, stock);
      res.status(200).json(inventarioActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el stock" });
    }
  }
}
export default InventarioController;
