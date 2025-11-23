import { body } from "express-validator";
export const validarPedidos = [
  body("id_cliente")
    .notEmpty()
    .withMessage("El ID del cliente es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID del cliente debe ser un número entero mayor que 0"),
  body("estado")
    .notEmpty()
    .withMessage("El estado del pedido es obligatorio")
    .isIn(["pendiente", "procesando", "completado", "cancelado"])
    .withMessage(
      "El estado del pedido debe ser uno de los siguientes: pendiente, procesando, completado, cancelado"
    ),
  body("metodo_pago")
    .notEmpty()
    .withMessage("El método de pago es obligatorio")
    .isIn(["tarjeta", "paypal", "efectivo"])
    .withMessage(
      "El método de pago debe ser uno de los siguientes: tarjeta, paypal, efectivo"
    ),
  body("total")
    .notEmpty()
    .withMessage("El total es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El total debe ser un número mayor que 0"),
];
export default validarPedidos;
