import { body } from "express-validator";
export const validarDocumento = [
    body("tipo_documento")
        .notEmpty()
        .withMessage("El tipo de documento es obligatorio")
        .isIn([
        "ine_frente",
        "ine_reverso",
        "rfc",
        "curp",
        "acta_nacimiento",
        "comprobante_domicilio",
        "alta_imss",
        "contrato"
    ])
        .withMessage("Tipo de documento inválido"),
    body("id_empleado")
        .notEmpty()
        .withMessage("El ID del empleado es obligatorio")
        .isInt({ gt: 0 })
        .withMessage("ID de empleado inválido"),
    body("fecha_vencimiento")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("La fecha de vencimiento debe ser una fecha válida (YYYY-MM-DD)"),
];
export default validarDocumento;
