import { body } from "express-validator";

export const validarUsuario = [
  body("id_rol")
    .notEmpty()
    .withMessage("El ID del rol es obligatorio")
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
    .isLength({ max: 100 })
    .withMessage("El email no debe exceder los 100 caracteres"),

  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("telefono")
    .optional()
    .isLength({ max: 20 })
    .withMessage("El teléfono no debe exceder los 20 caracteres"),
];

export default validarUsuario;
