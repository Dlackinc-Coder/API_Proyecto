import { Request, Response } from "express";
import Productos from "../models/productos.js";
import { GrainType, RoastLevel } from "../interfaces/database.types.js";

class ProductoController {
  static async crearProducto(req: Request, res: Response) {
    const {
      sku,
      nombre,
      id_region,
      tipo_grano,
      nivel_tostado,
      notas_cata_texto,
      precio_actual,
      stock_minimo
    } = req.body;

    try {
      const granosValidos: GrainType[] = [GrainType.ARABICA, GrainType.ROBUSTA, GrainType.MEZCLADA];
      const tostadosValidos: RoastLevel[] = [RoastLevel.LIGERO, RoastLevel.MEDIO, RoastLevel.MEDIO_OSCURO, RoastLevel.OSCURO];

      if (!granosValidos.includes(tipo_grano as GrainType)) {
        return res.status(400).json({ error: "Tipo de grano inválido. Valores permitidos: arabica, robusta, mezclada" });
      }

      if (!tostadosValidos.includes(nivel_tostado as RoastLevel)) {
        return res.status(400).json({ error: "Nivel de tostado inválido. Valores permitidos: ligero, medio, medio_oscuro, oscuro" });
      }

      const nuevoProducto = await Productos.CrearProducto(
        sku,
        nombre,
        parseInt(id_region, 10),
        tipo_grano as GrainType,
        nivel_tostado as RoastLevel,
        notas_cata_texto,
        parseFloat(precio_actual),
        parseInt(stock_minimo, 10) || 10
      );
      res.status(201).json(nuevoProducto);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ error: "El SKU ya existe" });
      }
      console.error("Error al crear el producto:", error);
      res.status(500).json({ error: "Error al crear el producto." });
    }
  }

  static async obtenerProductos(req: Request, res: Response) {
    try {
      const limite = parseInt(req.query.limite as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const productos = await Productos.ObtenerProductos(limite, offset);
      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }

  static async obtenerProductoPorId(req: Request, res: Response) {
    try {
      const id_producto = parseInt(req.params.id as string, 10);
      const producto = await Productos.ObtenerProductoPorId(id_producto);
      if (producto) {
        res.status(200).json(producto);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  }

  static async actualizarProducto(req: Request, res: Response) {
    const id_producto = parseInt(req.params.id as string, 10);
    const {
      sku,
      nombre,
      id_region,
      tipo_grano,
      nivel_tostado,
      notas_cata_texto,
      precio_actual,
      stock_minimo
    } = req.body;

    try {
      const productoActualizado = await Productos.ActualizarProducto(
        id_producto,
        sku,
        nombre,
        parseInt(id_region, 10),
        tipo_grano as GrainType,
        nivel_tostado as RoastLevel,
        notas_cata_texto,
        parseFloat(precio_actual),
        parseInt(stock_minimo, 10)
      );

      if (productoActualizado) {
        res.status(200).json(productoActualizado);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({ error: "Error al actualizar el producto." });
    }
  }

  static async eliminarProducto(req: Request, res: Response) {
    try {
      const id_producto = parseInt(req.params.id as string, 10);
      const productoEliminado = await Productos.EliminarProducto(id_producto);
      if (productoEliminado) {
        res.status(200).json({ message: "Producto eliminado (descontinuado) correctamente", producto: productoEliminado });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
}

export default ProductoController;
