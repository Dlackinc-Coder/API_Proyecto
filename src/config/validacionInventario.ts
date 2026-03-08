import { body } from "express-validator";
export const validarMovimientoInventario = [
  body("id_producto")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID del producto debe ser un número entero mayor que 0"),

  body("cantidad_movimiento")
    .notEmpty()
    .withMessage("La cantidad del movimiento es obligatoria")
    .isInt()
    .withMessage("La cantidad debe ser un número entero")
    .custom((value) => {
      if (value === 0) {
        throw new Error("La cantidad no puede ser cero");
      }
      return true;
    }),

  body("tipo_movimiento")
    .notEmpty()
    .withMessage("El tipo de movimiento es obligatorio")
    .isIn([
      "compra_proveedor",
      "venta_cliente",
      "merma",
      "ajuste_inventario",
      "devolucion"
    ])
    .withMessage("Tipo de movimiento inválido"),

  body("referencia_documento")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La referencia no debe exceder 100 caracteres"),

  body("id_usuario_responsable")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("ID de usuario inválido"),
];

export default validarMovimientoInventario;