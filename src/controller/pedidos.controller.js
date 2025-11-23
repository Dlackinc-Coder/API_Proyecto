import Pedidos from "../models/pedidos.js";
import DetallesPedido from "../models/detalles_pedido.js";

class PedidosController {
  static async crearPedido(req, res) {
    const { id_cliente, estado, metodo_pago, total, productos } = req.body;

    try {
      const nuevoPedido = await Pedidos.CrearPedido(
        id_cliente,
        estado,
        metodo_pago,
        total
      );
      const id_pedido = nuevoPedido.id_pedido;
      const detallesGuardados = [];
      if (productos && productos.length > 0) {
        for (const prod of productos) {
          await DetallesPedido.crearDetalle({
            id_pedido: id_pedido,
            id_producto: prod.id_producto,
            cantidad: prod.cantidad,
            precio_unitario: prod.precio_unitario,
          });
          // Opcional: Aquí podrías restar stock del inventario
        }
        // C. Recuperar los detalles recién creados para confirmar al cliente
        const detalles = await DetallesPedido.obtenerPorPedido(id_pedido);
        detallesGuardados.push(...detalles);
      }

      res.status(201).json({
        mensaje: "Pedido creado exitosamente",
        pedido: nuevoPedido,
        detalles: detallesGuardados,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al procesar el pedido." });
    }
  }

  // 2. Obtener Todos los Pedidos (Solo cabeceras para listas rápidas)
  static async obtenerTodosLosPedidos(req, res) {
    try {
      const pedidos = await Pedidos.ObtenerPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los pedidos" });
    }
  }

  // 3. Obtener Pedido por ID (CON SUS DETALLES) -> Aquí absorbemos la lógica vieja
  static async obtenerPedidoPorId(req, res) {
    const { id } = req.params;
    try {
      // A. Buscamos la cabecera
      const pedido = await Pedidos.ObtenerPedidoPorId(id);

      if (pedido) {
        // B. Buscamos los productos de este pedido (Usando el modelo DetallesPedido)
        const productos = await DetallesPedido.obtenerPorPedido(id);

        // C. Respondemos con el objeto completo unificado
        res.status(200).json({
          ...pedido, // Datos del cliente, fecha, total
          productos, // Array con los cafés comprados
        });
      } else {
        res.status(404).json({ error: "Pedido no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el pedido" });
    }
  }

  // ... (Mantén tus métodos ActualizarEstado y EliminarPedido igual que antes)
  static async ActualizarEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const pedidoActualizado = await Pedidos.ActualizarEstado(id, estado);
      if (pedidoActualizado) {
        res.status(200).json(pedidoActualizado);
      } else {
        res.status(404).json({ error: "Pedido no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar estado" });
    }
  }

  static async eliminarPedido(req, res) {
    const { id } = req.params;
    try {
      await Pedidos.EliminarPedido(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar pedido" });
    }
  }
}

export default PedidosController;
