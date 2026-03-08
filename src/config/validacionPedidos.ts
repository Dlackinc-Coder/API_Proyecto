import { body } from "express-validator";

export const validarCrearPedido = [
  body("folio")
    .notEmpty()
    .withMessage("El folio es obligatorio")
    .isLength({ max: 20 })
    .withMessage("El folio no debe exceder 20 caracteres"),

  body("id_cliente")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("ID de cliente inválido"),

  body("total")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("El total debe ser mayor a 0"),

  body("productos")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un producto"),

  body("productos.*.id_producto")
    .isInt({ gt: 0 })
    .withMessage("ID de producto inválido"),

  body("productos.*.cantidad")
    .isInt({ gt: 0 })
    .withMessage("Cantidad inválida"),

  body("productos.*.precio_unitario")
    .isFloat({ gt: 0 })
    .withMessage("Precio inválido"),
];

export const validarActualizarEstadoPedido = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["pagado", "preparado", "enviada", "entregada", "cancelada"])
    .withMessage("Estado de pedido inválido"),
];

export default validarCrearPedido;