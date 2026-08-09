import * as CursosModel from "../model/model.ts"
import type { Response, Request } from "express";

export function ObtenerCursos(_req: Request, res: Response) {
    res.send(CursosModel.getCursos());
}
export function ObternerPorId(_req: Request, res: Response) {
    const id = Number(_req.params.id);
    const curso = CursosModel.getCursoPorId(id);
    if (!curso) {
        return res.status(404).send("Curso no encontrado");
    }
    return res.send(curso);
}
export function AgregarCurso(_req: Request, res: Response) {
    const curso = {
        id: CursosModel.getCursos().length + 1,
        title: _req.body.title,
        description: _req.body.description,
        icon: _req.body.icon,
        notification: _req.body.notification
    }
    const cursos = CursosModel.agregarCurso(curso);
    return res.send(cursos);
}

export function actualizarCurso(_req: Request, res: Response) {
    const id = Number(_req.params.id);
    const curso = CursosModel.getCursoPorId(id);
    if (!curso) {
        return res.status(404).send("Curso no encontrado");
    }
    curso.title = _req.body.title;
    curso.description = _req.body.description;
    curso.icon = _req.body.icon;
    curso.notification = _req.body.notification;
    const cursos = CursosModel.actualizarCurso(id, curso);
    return res.send(cursos);
}
export function deleteCurso(_req: Request, res: Response) {
    const id = Number(_req.params.id)
    const curso = CursosModel.getCursoPorId(id)
    if (!curso) {
        return res.status(404).send("Curso no encontrado");
    }
    const cursos = CursosModel.deleteCurso(id);
    return res.send(cursos);
}