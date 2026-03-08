import { Request, Response } from "express";
import Documentos from "../models/documentos.js";
import cloudinary from "../config/cloudinary.js";
import { DocType, ValidationStatus } from "../interfaces/database.types.js";
interface AuthRequest extends Request {
  usuario?: { id_usuario: number; id_rol: number };
  file?: any;
}

class DocumentoController {
  static async crearDocumento(req: AuthRequest, res: Response) {
    const { id_empleado, tipo_documento, fecha_expiracion } = req.body;
    let url_documento = null;
    let public_id = null;

    try {
      if (req.file) {
        const uploadStream = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "documentos_empleados",
                resource_type: "auto",
              },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const result = await uploadStream();
        url_documento = result.secure_url;
        public_id = result.public_id;
      } else {
        return res.status(400).json({ error: "El archivo de documento es obligatorio." });
      }

      const nuevoDocumento = await Documentos.crearDocumento({
        id_empleado: parseInt(id_empleado as string, 10),
        tipo_documento: tipo_documento as DocType,
        cloudinary_url: url_documento,
        cloudinary_public_id: public_id,
        fecha_expiracion: fecha_expiracion,
      });

      res.status(201).json(nuevoDocumento);
    } catch (error) {
      console.error("Error al crear documento o subir archivo:", error);
      res.status(500).json({ error: "Error al crear el documento" });
    }
  }

  static async obtenerDocumentoPorId(req: Request, res: Response) {
    try {
      const id_documento = parseInt(req.params.id as string, 10);
      const documento = await Documentos.obtenerDocumentoPorId(id_documento);
      if (documento) {
        res.status(200).json(documento);
      } else {
        res.status(404).json({ error: "Documento no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener documento:", error);
      res.status(500).json({ error: "Error al obtener el documento" });
    }
  }

  static async actualizarDocumento(req: AuthRequest, res: Response) {
    const id_documento = parseInt(req.params.id as string, 10);
    const { id_empleado, tipo_documento, fecha_expiracion } = req.body;

    let url_documento_nueva = null;
    let public_id_nuevo = null;

    try {
      const documentoExistente = await Documentos.obtenerDocumentoPorId(id_documento);

      if (!documentoExistente) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }

      if (req.file) {
        const uploadStream = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "documentos_empleados",
                resource_type: "auto",
              },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const result = await uploadStream();
        url_documento_nueva = result.secure_url;
        public_id_nuevo = result.public_id;

        // Opcional: Eliminar viejo documento
        if (documentoExistente.cloudinary_public_id) {
          await cloudinary.uploader.destroy(documentoExistente.cloudinary_public_id);
        }
      }

      const documentoActualizado = await Documentos.actualizarDocumento(id_documento, {
        id_empleado: id_empleado ? parseInt(id_empleado as string, 10) : undefined,
        tipo_documento: tipo_documento as DocType,
        cloudinary_url: url_documento_nueva || undefined,
        cloudinary_public_id: public_id_nuevo || undefined,
        fecha_expiracion: fecha_expiracion,
      });

      res.status(200).json(documentoActualizado);
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      res.status(500).json({ error: "Error al actualizar el documento" });
    }
  }

  static async obtenerDocumentosPorEmpleado(req: Request, res: Response) {
    try {
      const { id_empleado } = req.params;
      const documentos = await Documentos.obtenerDocumentosPorEmpleado(parseInt(id_empleado as string, 10));
      res.status(200).json(documentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los documentos del empleado" });
    }
  }

  static async actualizarEstadoDocumento(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { estado, notas_rechazo } = req.body;
      const id_validador = req.usuario?.id_usuario;

      if (!id_validador) {
        return res.status(403).json({ error: "No autorizado para validar" });
      }

      const documentoActualizado = await Documentos.actualizarEstadoDocumento(
        parseInt(id as string, 10),
        estado as ValidationStatus,
        id_validador,
        notas_rechazo
      );

      if (documentoActualizado) {
        res.status(200).json(documentoActualizado);
      } else {
        res.status(404).json({ error: "Documento no encontrado para actualizar su estado" });
      }
    } catch (error) {
      console.error("Error al actualizar estado de documento:", error);
      res.status(500).json({ error: "Error al actualizar el estado del documento" });
    }
  }

  static async obtenerDocumentosPorVencer(req: Request, res: Response) {
    try {
      const documentos = await Documentos.obtenerDocumentosPorVencer();
      res.status(200).json(documentos);
    } catch (error) {
      console.error("Error al obtener documentos por vencer:", error);
      res.status(500).json({ error: "Error al obtener la lista de documentos próximos a vencer" });
    }
  }
}

export default DocumentoController;
