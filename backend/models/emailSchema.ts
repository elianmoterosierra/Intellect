import { z } from "zod";

export const emailSchema = z.object({
  to: z.string().email('email invalido'),
  subject: z.string().min(1, 'asunto requerido').max(100, 'asunto muy largo'),
  html: z.string().min(1, 'cuerpo requerido')
})

export type EmailSchema = z.infer<typeof emailSchema>

