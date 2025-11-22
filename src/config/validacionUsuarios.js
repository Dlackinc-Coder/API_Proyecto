import { body } from "express-validator";
export const validarUsuario = [
  body("id_rol")
    .notEmpty()
    .withMessage("El ID del rol es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID del rol debe ser un número entero positivo"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre no debe exceder los 50 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido")
    .isLength({ max: 50 })
    .withMessage("El email no debe exceder los 50 caracteres"),

  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("telefono")
    .optional()
    .isLength({ max: 15 })
    .withMessage("El teléfono no debe exceder los 15 caracteres"),
];
export default validarUsuario;
