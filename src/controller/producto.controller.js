import Productos from "../models/productos.js";

class ProductoController {
  static async crearProducto(req, res) {
    try {
        const body = req.body;
        const nuevoProducto = await Productos.CrearProducto(
            body.nombre,
            body.tipo,
            body.variedad,
            body.precio,
            body.descripcion,
            body.imagen_url
        );
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
  }

    static async obtenerProductos(req, res) {
    try {
        const limite = parseInt(req.query.limite) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const productos = await Productos.ObtenerProductos(limite, offset);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
  }

  static async obtenerProductoPorId(req, res) {
    try {
        const id_producto = parseInt(req.params.id);
        const producto = await Productos.ObtenerProductoPorId(id_producto);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
  }

  static async actualizarProducto(req, res) {
    try {
        const id_producto = parseInt(req.params.id);
        const body = req.body;
        const productoActualizado = await Productos.ActualizarProducto(
            id_producto,
            body.nombre,
            body.tipo,
            body.variedad,
            body.precio,
            body.descripcion,
            body.imagen_url
        );
        if (productoActualizado) {
            res.status(200).json(productoActualizado);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }

  static async eliminarProducto(req, res) {
    try {
        const id_producto = parseInt(req.params.id);
        const productoEliminado = await Productos.EliminarProducto(id_producto);
        if (productoEliminado) {
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
}

export default ProductoController;