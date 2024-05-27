import { Router } from "express";
import { ControllerUsuarios } from "../controllers/usuarios.controller.js";

const router = Router()

router.get('/usuarios', ControllerUsuarios.getAllUsuarios)

router.post('/usuario', ControllerUsuarios.createUser)

router.delete('/usuario/', ControllerUsuarios.removeUser)

router.put('/usuario/', ControllerUsuarios.updateUser)

export default router