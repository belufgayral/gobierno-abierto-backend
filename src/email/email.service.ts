import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // El transporter reemplaza a "new Resend"
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            pool: true, // Recomendado para reutilizar la conexión
        });
    }

    async sendContact(name: string, message: string, dni: string, contacto: string) {
        const emailRecepcion = process.env.RECEIVER_EMAIL;
        if (!emailRecepcion) throw new Error("No hay email de recepción.");

        try {
            await this.transporter.sendMail({
                // El "from" ahora debe ser generalmente el usuario del SMTP
                from: `"Portal Abierto Lobería" <${process.env.SMTP_USER}>`,
                to: emailRecepcion,
                subject: `Nuevo mensaje de contacto — ${name}, dni — ${dni}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2 style="color: #4C9734; border-bottom: 1px solid #badabb; padding-bottom: 12px;">
                        Nuevo mensaje desde el Portal Abierto
                        </h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #4C9734;">Nombre:</td>
                            <td style="padding: 8px 0;">${name || 'No informado'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #4C9734;">Contacto:</td>
                            <td style="padding: 8px 0;">${contacto}</td>
                        </tr>
                        </table>
                        <div style="background:rgb(246, 251, 246); border-left: 3px solid #4C9734; padding: 16px 20px; border-radius: 0 4px 4px 0;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                `,
            });
            return { success: true };
        } catch (error) {
            console.error(error); 
            throw new Error('Error al enviar el email');
        }
    }
}
