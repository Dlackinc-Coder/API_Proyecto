import { body } from "express-validator";

// Cambio a export const para consistencia con los otros archivos
export const validarDocumento = [
  body("tipo_documento")
    .notEmpty()
    .withMessage("El tipo de documento es obligatorio")
    .isIn([
      "INE",
      "Constancia_Fiscal",
      "Alta_IMSS",
      "Baja_IMSS",
      "Vigencia_Derechos",
      "Otro",
    ])
    .withMessage("Tipo de documento inválido"),

  body("id_empleado")
    .notEmpty()
    .withMessage("El ID del empleado es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("ID de empleado inválido"),

  body("fecha_vencimiento")
    .optional({ nullable: true, checkFalsy: true }) // Permite que no exista o que sea nulo/vacío
    .isISO8601()
    .withMessage(
      "La fecha de vencimiento debe ser una fecha válida (YYYY-MM-DD)"
    ),
];

export default validarDocumento;
