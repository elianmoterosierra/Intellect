import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validar(schema:ZodSchema){
    return(req:Request,res:Response,next:NextFunction)=>{
        const result = schema.safeParse(req.body)
        if(!result.success){
            res.status(400).json({
                ok:false,
                errors: result.error.flatten().fieldErrors,
            })
            return
        }
        req.body = result.data as unknown;
        next()
    }
}