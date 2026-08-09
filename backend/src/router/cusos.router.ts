import { Router } from "express";
import * as Controller from "../controller/controller.ts"
import { validarCurso } from "../middleware/validarCurso.ts"

const router = Router();

router.get("/cursos", Controller.ObtenerCursos);
router.get("/curso/:id", Controller.ObternerPorId);
router.post("/curso", validarCurso, Controller.AgregarCurso);
router.put("/curso/:id", validarCurso, Controller.actualizarCurso);
router.delete("/curso/:id", Controller.deleteCurso);
export default router;