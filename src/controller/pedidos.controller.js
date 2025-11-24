import Pedidos from "../models/pedidos.js";
import DetallesPedido from "../models/detalles_pedido.js";
import Inventario from "../models/inventario.js";
import pool from "../config/db.js";

class PedidosController {
  static async crearPedido(req, res) {
    const { id_cliente, estado, metodo_pago, total, productos } = req.body;

    // 1. Obtener un cliente de conexión
    const client = await pool.connect();
    let nuevoPedido = null;
    let detallesGuardados = [];

    try {
      // 2. INICIAR LA TRANSACCIÓN
      await client.query("BEGIN");

      // 3. Crear el Pedido principal
      nuevoPedido = await Pedidos.CrearPedido(
        client,
        id_cliente,
        estado,
        metodo_pago,
        total
      );
      const id_pedido = nuevoPedido.id_pedido;

      if (productos && productos.length > 0) {
        for (const prod of productos) {
          // 4. CREAR DETALLE DE PEDIDO (USANDO EL CLIENTE)
          const detalle = await DetallesPedido.crearDetalle(client, {
            id_pedido: id_pedido,
            id_producto: prod.id_producto,
            cantidad: prod.cantidad,
            precio_unitario: prod.precio_unitario,
          });
          detallesGuardados.push(detalle);

          // 5. RESTAR STOCK (USANDO EL CLIENTE)
          const stockActualizado = await Inventario.RestarStockPorProducto(
            client, // ⬅️ PASAMOS EL CLIENTE
            prod.id_producto,
            prod.cantidad
          );

          // 6. VERIFICAR STOCK SUFICIENTE
          if (!stockActualizado) {
            // Lanzar un error para que el bloque CATCH ejecute el ROLLBACK
            throw new Error(
              `Stock insuficiente para el producto ID ${prod.id_producto}.`
            );
          }
        }
      }

      // 7. SI TODO FUE EXITOSO, CONFIRMAR LA TRANSACCIÓN
      await client.query("COMMIT");

      res.status(201).json({
        mensaje: "Pedido creado y stock restado exitosamente.",
        pedido: nuevoPedido,
        detalles: detallesGuardados,
      });
    } catch (error) {
      // 8. SI HAY CUALQUIER ERROR (stock insuficiente, o error de DB), DESHACER TODO
      await client.query("ROLLBACK");

      console.error(error);

      // Manejar el error específico de stock insuficiente
      if (error.message.includes("Stock insuficiente")) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: "Error al procesar el pedido. Se ha deshecho la operación.",
      });
    } finally {
      // 9. LIBERAR EL CLIENTE DE CONEXIÓN
      if (client) {
        client.release();
      }
    }
  }

  static async obtenerTodosLosPedidos(req, res) {
    try {
      const pedidos = await Pedidos.ObtenerPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los pedidos" });
    }
  }

  static async obtenerPedidoPorId(req, res) {
    const { id } = req.params;

    // Obtener los datos del usuario logueado desde el token (req.usuario)
    const { id_usuario, id_rol } = req.usuario;

    try {
      const pedido = await Pedidos.ObtenerPedidoPorId(id);

      if (!pedido) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
      const esAdministrador = id_rol === 1;
      const esPropietario = pedido.id_cliente === id_usuario;

      if (esAdministrador || esPropietario) {
        // El administrador puede ver cualquier pedido
        // El cliente solo puede ver su propio pedido
        res.status(200).json(pedido);
      } else {
        // Un cliente intenta ver el pedido de otra persona
        res
          .status(403)
          .json({ error: "Acceso denegado. Este pedido no es suyo." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el pedido" });
    }
  }

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
