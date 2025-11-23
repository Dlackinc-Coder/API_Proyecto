import Productos from "../models/productos.js";
import cloudinary from "../config/cloudinary.js";

function getPublicIdFromUrl(url) {
  if (!url) return null;
  // Ejemplo: https://res.cloudinary.com/.../v123456/folder/public_id_example.jpg
  // Extrae 'folder/public_id_example'
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  if (match && match[1]) {
    // Para simplificar, busca la parte del path después de '/upload/v...'
    // y antes de la extensión. Necesitas solo el Public ID.
    return match[1].replace(/upload\//, ""); // Intenta eliminar 'upload/' si se cuela
  }
  return null;
}
class ProductoController {
  static async crearProducto(req, res) {
    const { nombre, tipo, variedad, precio, descripcion } = req.body;

    let imagen_url = null;

    try {
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "laminiatura_productos", // Carpeta donde se guardará en Cloudinary
          // Opcional: optimización de imagen
          eager: [
            { width: 500, height: 500, crop: "fill", quality: "auto:good" },
          ],
        });

        imagen_url = result.secure_url; // La URL HTTPS segura de la imagen subida
      }
      const nuevoProducto = await Productos.CrearProducto(
        nombre,
        tipo,
        variedad,
        precio,
        descripcion,
        imagen_url
      );
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error("Error al crear el producto o subir imagen:", error);
      res.status(500).json({
        error:
          "Error al crear el producto. Verifique credenciales de Cloudinary y el archivo.",
      });
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
    const id_producto = parseInt(req.params.id);
    // Extraemos los datos del body (Multer los parsea)
    const { nombre, tipo, variedad, precio, descripcion } = req.body;
    let imagen_url;

    try {
      // 1. Obtener el producto actual para saber si tiene una imagen antigua
      const productoAnterior = await Productos.ObtenerProductoPorId(
        id_producto
      );

      if (!productoAnterior) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      let old_imagen_url = productoAnterior.imagen_url;
      imagen_url = old_imagen_url;

      // 2. Manejar la subida de una NUEVA imagen
      if (req.file) {
        // Subir la nueva imagen a Cloudinary (misma lógica que en crearProducto)
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "laminiatura_productos",
        });

        imagen_url = result.secure_url; // Asigna la nueva URL

        // 3. Eliminar la imagen antigua de Cloudinary (si existe)
        if (old_imagen_url) {
          // Extrae el Public ID de la URL
          const publicId = getPublicIdFromUrl(old_imagen_url);

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
      // 4. Actualizar el producto en la BD
      const productoActualizado = await Productos.ActualizarProducto(
        id_producto,
        nombre,
        tipo,
        variedad,
        precio,
        descripcion,
        imagen_url
      );

      if (productoActualizado) {
        res.status(200).json(productoActualizado);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error(
        "Error al actualizar el producto o subir/eliminar imagen:",
        error
      );
      res.status(500).json({ error: "Error al actualizar el producto." });
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
