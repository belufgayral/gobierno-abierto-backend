import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

  @Post('contact')
  async sendEmail(@Body() body: { name: string; message: string; subscribe: boolean }) {
    return this.emailService.sendContact(body.name, body.message);
  }
}
