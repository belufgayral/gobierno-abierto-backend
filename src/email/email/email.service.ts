import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend = new Resend(process.env.RESEND_API_KEY);

    async sendContact(name: string, message: string) {
        const email = process.env.RESEND_EMAIL;
        if(!email) throw new Error("No hay email de recepcion.")
        try {
            const data = await this.resend.emails.send({
                from: 'Portal Abierto Lobería <onboarding@resend.dev>',
                to: [email],
                subject: `Nuevo mensaje de contacto — ${name}`,
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
                        </table>
                        <div style="background:rgb(246, 251, 246); border-left: 3px solid #4C9734; padding: 16px 20px; border-radius: 0 4px 4px 0;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                `,
            });
            return { success: true };
        } catch (error) {
            throw new Error('Error al enviar el email');
        }
    }
}
