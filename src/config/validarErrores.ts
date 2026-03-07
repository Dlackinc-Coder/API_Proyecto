import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validarErrores = (req: Request, res: Response, next: NextFunction) => {
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
