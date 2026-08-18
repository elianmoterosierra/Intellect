import type { Request, Response } from 'express';
import { transporter } from '../api/Config';
import type { EmailSchema } from '../models/emailSchema';

function htmlToText(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?(p|div|h[1-6])[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export async function sendEmail(req: Request, res: Response) {
    try {
        const { to, subject, html } = req.body as EmailSchema;

        await transporter.sendMail({
            from: `"Intellect" <${process.env.SMTP_USER}>`,
            replyTo: process.env.SMTP_USER,
            to,
            subject,
            html,
            text: htmlToText(html),
            headers: {
                'X-Mailer': 'Intellect Mailer 1.0',
            },
        });

        return res.status(200).json({ ok: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('[sendEmail] Error:', error);
        return res.status(500).json({ ok: false, message: 'Error al enviar el correo' });
    }
}