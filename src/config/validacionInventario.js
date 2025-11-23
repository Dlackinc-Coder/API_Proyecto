import { body } from "express-validator";
export const validarInventario = [
  body("id_producto")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID del producto debe ser un número entero mayor que 0"),
  body("stock")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero mayor o igual a 0"),
];
export default validarInventario;