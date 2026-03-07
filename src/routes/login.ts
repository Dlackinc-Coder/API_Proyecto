import { Router } from "express";
import AuthController from "../controller/login.js";
import validarErrores from "../config/validarErrores.js";
import ValidarLogin from "../config/validacionLogin.js";
const routerAuth = Router();

routerAuth.post(
  "/api/login",
  ValidarLogin,
  validarErrores,
  AuthController.login
);

export default routerAuth;
