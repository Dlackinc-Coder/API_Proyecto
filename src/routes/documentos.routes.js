import { Router } from "express";
import DocumentoController from "../controller/documento.controller.js";
import validarDocumento from "../config/documento.js";
import validarErrores from "../config/validarErrores.js";
import { uploadDocumentoMiddleware } from "../config/multer.js";
import { verificarToken, verificarRol } from "../config/autenticacion.js";

const routerDocumento = Router();
const ROL_ADMIN = 1;

routerDocumento.post(
  "/api/documentos",
  verificarToken,
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.crearDocumento
);

// Ruta protegida: Solo administradores pueden ver documentos próximos a vencer
routerDocumento.get(
  "/api/documentos/vencer",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  DocumentoController.obtenerDocumentosPorVencer
);

routerDocumento.get(
  "/api/documentos/empleado/:id_empleado",
  verificarToken,
  DocumentoController.obtenerDocumentosPorEmpleado
);

routerDocumento.get(
  "/api/documentos/:id",
  verificarToken,
  DocumentoController.obtenerDocumentoPorId
);

routerDocumento.put(
  "/api/documentos/:id",
  verificarToken,
  uploadDocumentoMiddleware,
  validarDocumento,
  validarErrores,
  DocumentoController.actualizarDocumento
);

routerDocumento.patch(
  "/api/documentos/:id/estado",
  verificarToken,
  verificarRol([ROL_ADMIN]),
  DocumentoController.actualizarEstadoDocumento
);

export default routerDocumento;
