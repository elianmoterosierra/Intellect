import { Router } from "express";
import { sendEmail } from "../controller/emailController";
import { validar } from "../middleware/validar";
import { emailSchema } from "../models/emailSchema";

const router = Router();
router.post('/send', validar(emailSchema), sendEmail);
export default router;
