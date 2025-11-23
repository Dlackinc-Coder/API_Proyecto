import { Router } from "express";
import DocumentoController from "../controller/documento.controller.js";
import validarDocumento from "../config/documento.js";
import validarErrores from "../config/validarErrores.js";
import { uploadDocumentoMiddleware } from "../config/multer.js";

const routerDocumento = Router();

routerDocumento.post(
  "/api/documentos",
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.crearDocumento
);

routerDocumento.get(
  "/api/documentos/vencer",
  DocumentoController.obtenerDocumentosPorVencer
);

routerDocumento.get(
  "/api/documentos/empleado/:id_empleado",
  DocumentoController.obtenerDocumentosPorEmpleado
);

routerDocumento.get(
  "/api/documentos/:id",
  DocumentoController.obtenerDocumentoPorId
);

routerDocumento.put(
  "/api/documentos/:id",
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.actualizarDocumento
);
routerDocumento.patch(
  "/api/documentos/:id/estado",
  DocumentoController.actualizarEstadoDocumento
);

export default routerDocumento;
