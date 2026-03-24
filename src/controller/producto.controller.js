import Productos from "../models/productos.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder = "productos") => {
    return new Promise((resolve, reject) => {
        const fileBase64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
        cloudinary.uploader.upload(
            fileBase64,
            { folder: folder, timeout: 120000 },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
};
const GrainType = {
    ARABICA: "arabica",
    ROBUSTA: "robusta",
    MEZCLADA: "mezclada",
};
const RoastLevel = {
    LIGERO: "ligero",
    MEDIO: "medio",
    MEDIO_OSCURO: "medio_oscuro",
    OSCURO: "oscuro",
};
class ProductoController {
    static async crearProducto(req, res) {
        const { sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo } = req.body;
        try {
            const granosValidos = [GrainType.ARABICA, GrainType.ROBUSTA, GrainType.MEZCLADA];
            const tostadosValidos = [RoastLevel.LIGERO, RoastLevel.MEDIO, RoastLevel.MEDIO_OSCURO, RoastLevel.OSCURO];
            if (!granosValidos.includes(tipo_grano)) {
                return res.status(400).json({ error: "Tipo de grano inválido. Valores permitidos: arabica, robusta, mezclada" });
            }
            if (!tostadosValidos.includes(nivel_tostado)) {
                return res.status(400).json({ error: "Nivel de tostado inválido. Valores permitidos: ligero, medio, medio_oscuro, oscuro" });
            }

            let cloudinary_url = null;
            let cloudinary_public_id = null;

            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer);
                cloudinary_url = result.secure_url;
                cloudinary_public_id = result.public_id;
            }

            const nuevoProducto = await Productos.CrearProducto(
                sku,
                nombre,
                parseInt(id_region, 10),
                tipo_grano,
                nivel_tostado,
                notas_cata_texto,
                parseFloat(precio_actual),
                parseInt(stock_minimo, 10) || 10,
                cloudinary_url,
                cloudinary_public_id
            );
            res.status(201).json(nuevoProducto);
        }
        catch (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: "El SKU ya existe" });
            }
            console.error("Error al crear el producto:", error);
            res.status(500).json({ error: "Error al crear el producto." });
        }
    }
    static async obtenerProductos(req, res) {
        try {
            const limite = parseInt(req.query.limite) || 100;
            const offset = parseInt(req.query.offset) || 0;
            const productos = await Productos.ObtenerProductos(limite, offset);
            res.status(200).json(productos);
        }
        catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error al obtener los productos" });
        }
    }
    static async obtenerProductoPorId(req, res) {
        try {
            const id_producto = parseInt(req.params.id, 10);
            const producto = await Productos.ObtenerProductoPorId(id_producto);
            if (producto) {
                res.status(200).json(producto);
            }
            else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        }
        catch (error) {
            console.error("Error al obtener producto:", error);
            res.status(500).json({ error: "Error al obtener el producto" });
        }
    }
    static async actualizarProducto(req, res) {
        const id_producto = parseInt(req.params.id, 10);
        const { sku, nombre, id_region, tipo_grano, nivel_tostado, notas_cata_texto, precio_actual, stock_minimo } = req.body;
        try {
            const productoExistente = await Productos.ObtenerProductoPorId(id_producto);
            if (!productoExistente) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            let cloudinary_url = productoExistente.cloudinary_url;
            let cloudinary_public_id = productoExistente.cloudinary_public_id;

            if (req.file) {
                // Si hay una imagen previa, la eliminamos de Cloudinary
                if (cloudinary_public_id) {
                    await cloudinary.uploader.destroy(cloudinary_public_id);
                }
                const result = await uploadToCloudinary(req.file.buffer);
                cloudinary_url = result.secure_url;
                cloudinary_public_id = result.public_id;
            }

            const productoActualizado = await Productos.ActualizarProducto(
                id_producto,
                sku,
                nombre,
                parseInt(id_region, 10),
                tipo_grano,
                nivel_tostado,
                notas_cata_texto,
                parseFloat(precio_actual),
                parseInt(stock_minimo, 10),
                cloudinary_url,
                cloudinary_public_id
            );
            if (productoActualizado) {
                res.status(200).json(productoActualizado);
            }
            else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        }
        catch (error) {
            console.error("Error al actualizar el producto:", error);
            res.status(500).json({ error: "Error al actualizar el producto." });
        }
    }
    static async eliminarProducto(req, res) {
        try {
            const id_producto = parseInt(req.params.id, 10);
            const productoEliminado = await Productos.EliminarProducto(id_producto);
            if (productoEliminado) {
                res.status(200).json({ message: "Producto eliminado (descontinuado) correctamente", producto: productoEliminado });
            }
            else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        }
        catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }
    static async obtenerSiguienteSKU(req, res) {
        try {
            const sku = await Productos.SiguienteSKU();
            res.status(200).json({ sku });
        }
        catch (error) {
            console.error("Error al obtener siguiente SKU:", error);
            res.status(500).json({ error: "Error al generar el SKU sugerido" });
        }
    }
}
export default ProductoController;
