import { body } from "express-validator";

export const validarUsuario = [
    body("id_rol")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("El ID del rol debe ser válido"),
    body("nombre")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ max: 100 })
        .withMessage("El nombre no debe exceder los 100 caracteres"),
    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("El email no es válido")
        .isLength({ max: 80 })
        .withMessage("El email no debe exceder 80 caracteres"),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6, max: 72 })
        .withMessage("La contraseña debe tener entre 6 y 72 caracteres"),
    body("telefono")
        .optional()
        .isLength({ max: 15 })
        .withMessage("El teléfono no debe exceder 15 caracteres"),
];

// Validador específico para ACTUALIZACIÓN (donde password y email pueden ser opcionales)
export const validarActualizarUsuario = [
    body("nombre")
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("El nombre no debe exceder los 100 caracteres"),
    body("email")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("El email no es válido"),
    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 6, max: 72 })
        .withMessage("La contraseña debe tener entre 6 y 72 caracteres"),
    body("telefono")
        .optional({ checkFalsy: true })
        .isLength({ max: 15 })
        .withMessage("El teléfono no debe exceder 15 caracteres"),
];

export default { validarUsuario, validarActualizarUsuario };
