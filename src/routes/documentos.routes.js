import { Router } from "express";
import DocumentoController from "../controller/documento.controller.js";
import validarDocumento from "../config/documento.js";
import validarErrores from "../config/validarErrores.js";
import { uploadDocumentoMiddleware } from "../config/multer.js";

const routerDocumento = Router();

// 1. POST: Crear un nuevo documento
routerDocumento.post(
  "/api/documentos",
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.crearDocumento
);

// 2. GET: Alertas - Documentos próximos a vencer (RF-006)
routerDocumento.get(
  "/api/documentos/vencer",
  DocumentoController.obtenerDocumentosPorVencer
);

// 3. GET: Obtener documentos de un empleado específico
routerDocumento.get(
  "/api/documentos/empleado/:id_empleado",
  DocumentoController.obtenerDocumentosPorEmpleado
);

// 4. GET: Obtener un documento por ID
routerDocumento.get(
  "/api/documentos/:id",
  DocumentoController.obtenerDocumentoPorId
);

// 5. PUT: Actualizar un documento (Maneja archivo o solo campos de texto)
routerDocumento.put(
  "/api/documentos/:id",
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.actualizarDocumento
);

// 6. PATCH: Aprobar o Rechazar documento (RF-005)
routerDocumento.patch(
  "/api/documentos/:id/estado",
  DocumentoController.actualizarEstadoDocumento
);

export default routerDocumento;