import { body } from "express-validator";
const ValidarLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
];
export default ValidarLogin;
