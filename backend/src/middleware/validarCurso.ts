import { type Request, type Response, type NextFunction } from "express";

import { z } from "zod";

const CursoSchema = z.object({
    titulo: z.string().min(1, "el titulo es requerido"),
    precio: z.number().min(1, "el precio debe ser mayor a 0")
})

export function validarCurso(req: Request, res: Response, next: NextFunction) {
    const resultado = CursoSchema.safeParse(req.body);
    if (!resultado.success) {
        return res.status(400).send({ error: resultado.error.issues });
    } else {
        req.body = resultado.data;
        return next();
    }
}

