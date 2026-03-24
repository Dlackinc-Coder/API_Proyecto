import { body } from "express-validator";
const ValidarLogin = [
    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("El email no es válido")
        .isLength({ max: 80 })
        .withMessage("El email no debe exceder 80 caracteres"),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
export default ValidarLogin;
