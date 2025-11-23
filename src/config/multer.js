import multer from "multer";

// Configuración de almacenamiento en memoria (buffer)
const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (Límite para ambos)

// =================================================================
// MIDDLEWARE PARA IMÁGENES (e.g., Productos)
// =================================================================
const imageUpload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Filtrar solo tipos de imágenes
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de archivo no permitido. Solo imágenes (PNG, JPG, GIF)."
        ),
        false
      );
    }
  },
});

/** Middleware de subida para UNA sola imagen, campo 'imagen' */
export const uploadImageMiddleware = imageUpload.single("imagen");

// =================================================================
// 2. MIDDLEWARE PARA DOCUMENTOS (e.g., INE, Contratos)
// =================================================================
const documentUpload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Mantiene el límite de 5MB
  fileFilter: (req, file, cb) => {
    // Definición explícita de tipos de documentos permitidos
    const allowedMimes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Tipo de archivo no permitido. Solo PDF, DOC o DOCX."),
        false
      );
    }
  },
});

/** Middleware de subida para UN solo documento, campo 'documento' */
export const uploadDocumentoMiddleware = documentUpload.single("documento");
