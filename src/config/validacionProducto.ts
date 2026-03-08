import { body } from "express-validator";
export const validarProducto = [
  body("sku")
    .notEmpty()
    .withMessage("El SKU es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El SKU no debe exceder 50 caracteres"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no debe exceder 100 caracteres"),

  body("id_region")
    .notEmpty()
    .withMessage("La región del café es obligatoria")
    .isInt({ gt: 0 })
    .withMessage("ID de región inválido"),

  body("tipo_grano")
    .notEmpty()
    .withMessage("El tipo de grano es obligatorio")
    .isIn(["arabica", "robusta", "mezclada"])
    .withMessage("Tipo de grano inválido"),

  body("nivel_tostado")
    .notEmpty()
    .withMessage("El nivel de tostado es obligatorio")
    .isIn(["ligero", "medio", "medio_oscuro", "oscuro"])
    .withMessage("Nivel de tostado inválido"),

  body("notas_cata_texto")
    .optional()
    .isString()
    .withMessage("Las notas de cata deben ser texto"),

  body("precio_actual")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor a 0"),

  body("stock_minimo")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock mínimo debe ser un número entero positivo"),
];

export default validarProducto;
