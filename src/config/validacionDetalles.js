import { body } from "express-validator";

export const validarDetalles = [
  body("id_pedido")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("ID de pedido inválido"),
  body("id_producto")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("ID de producto inválido"),
  body("cantidad")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser mayor a 0"),
  body("precio_unitario")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor a 0"),
];

export default validarDetalles;
