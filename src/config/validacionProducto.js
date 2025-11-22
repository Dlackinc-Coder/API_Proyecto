import { body } from "express-validator";

export const validarProducto = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre del producto no debe exceder los 100 caracteres"),

  body("tipo")
    .notEmpty()
    .withMessage("El tipo de producto es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El tipo de producto no debe exceder los 50 caracteres"),

  body("variedad")
    .notEmpty()
    .withMessage("La variedad del producto es obligatoria")
    .isLength({ max: 50 })
    .withMessage("La variedad del producto no debe exceder los 50 caracteres"),
    
  body("precio")
    .notEmpty()
    .withMessage("El precio del producto es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio del producto debe ser un número mayor que 0"),

  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción del producto no debe exceder los 500 caracteres"),

  body("imagen_url")
    .optional()
    .isURL()
    .withMessage("La URL de la imagen del producto no es válida"),
];
export default validarProducto;
