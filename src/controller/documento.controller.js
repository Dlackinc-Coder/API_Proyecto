import Documentos from "../models/documentos.js";
import cloudinary from "../config/cloudinary.js";
class DocumentoController {
  static async crearDocumento(req, res) {
    const { id_empleado, tipo_documento, estado, fecha_vencimiento } = req.body;
    let url_documento = null;
    try {
      // 1. Verificar si Multer subió un archivo
      if (req.file) {
        // 2. Convertir el buffer del archivo (Multer) a Data URI (Cloudinary)
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        // 3. Subir el archivo a Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "documentos_empleados", // Carpeta específica en Cloudinary
          resource_type: "auto", // Importante para documentos (PDF, DOCX, etc.)
        });

        url_documento = result.secure_url; // 4. Obtener la URL generada
      } else {
        res
          .status(400)
          .json({ error: "El archivo de documento es obligatorio." });
      }
      const nuevoDocumento = await Documentos.crearDocumento({
        id_empleado,
        tipo_documento,
        url_documento,
        estado,
        fecha_vencimiento,
      });

      res.status(201).json(nuevoDocumento);
    } catch (error) {
      console.error("Error al crear documento o subir archivo:", error);
      res.status(500).json({ error: "Error al crear el documento" });
    }
  }

  static async obtenerDocumentoPorId(req, res) {
    try {
      const id_documento = parseInt(req.params.id);
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

  // AGREGADO: Método para actualizar un documento
  static async actualizarDocumento(req, res) {
    const id_documento = parseInt(req.params.id);
    // Solo obtenemos los campos de texto del body
    const { id_empleado, tipo_documento, estado, fecha_vencimiento } = req.body;
    let url_documento_nueva = null;

    try {
      // 1. Obtener el documento actual para usar los datos existentes y la URL
      const documentoExistente = await Documentos.obtenerDocumentoPorId(
        id_documento
      );

      if (!documentoExistente) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }

      // 2. Lógica para el archivo (si se subió uno nuevo)
      if (req.file) {
        // Subir nuevo archivo a Cloudinary (misma lógica que en crearDocumento)
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "documentos_empleados",
          resource_type: "auto",
        });

        url_documento_nueva = result.secure_url;
        // Opcional: Eliminar el archivo antiguo de Cloudinary aquí si lo necesitas.
      }

      // 3. Determinar los datos finales de la actualización
      const datosActualizados = {
        // Usamos el valor del body si existe, si no, usamos el valor existente en la BD
        id_empleado: id_empleado || documentoExistente.id_empleado,
        tipo_documento: tipo_documento || documentoExistente.tipo_documento,
        estado: estado || documentoExistente.estado,
        fecha_vencimiento:
          fecha_vencimiento || documentoExistente.fecha_vencimiento,
        // Usamos la URL nueva si se subió un archivo, si no, la URL que ya estaba en la BD
        url_documento: url_documento_nueva || documentoExistente.url_documento,
      };

      // 4. Llamar al método del modelo
      const documentoActualizado = await Documentos.actualizarDocumento(
        id_documento,
        datosActualizados
      );

      res.status(200).json(documentoActualizado);
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      res.status(500).json({ error: "Error al actualizar el documento" });
    }
  }

  static async obtenerDocumentosPorEmpleado(req, res) {
    try {
      const { id_empleado } = req.params;
      const documentos = await Documentos.obtenerDocumentosPorEmpleado(
        id_empleado
      );
      res.status(200).json(documentos);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los documentos del empleado" });
    }
  }
  static async actualizarEstadoDocumento(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const documentoActualizado = await Documentos.actualizarEstadoDocumento(
        id,
        estado
      );

      if (documentoActualizado) {
        res.status(200).json(documentoActualizado);
      } else {
        res
          .status(404)
          .json({ error: "Documento no encontrado para actualizar su estado" });
      }
    } catch (error) {
      console.error("Error al actualizar estado de documento:", error);
      res
        .status(500)
        .json({ error: "Error al actualizar el estado del documento" });
    }
  }

  static async obtenerDocumentosPorVencer(req, res) {
    try {
      const documentos = await Documentos.obtenerDocumentosPorVencer();
      res.status(200).json(documentos);
    } catch (error) {
      console.error("Error al obtener documentos por vencer:", error);
      res.status(500).json({
        error: "Error al obtener la lista de documentos próximos a vencer",
      });
    }
  }
}

export default DocumentoController;
