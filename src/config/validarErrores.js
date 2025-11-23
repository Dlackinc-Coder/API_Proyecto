import { validationResult } from "express-validator";

export const validarErrores = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      mensaje: "Error en la validación",
      error: error.array(),
    });
  }
  next();
};
export default validarErrores;
