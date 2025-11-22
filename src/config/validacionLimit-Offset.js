import { query } from "express-validator";

const validacionLimit_Offset = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entero entre 1 y 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El offset debe ser un número entero mayor o igual a 0"),
];

export default validacionLimit_Offset;
