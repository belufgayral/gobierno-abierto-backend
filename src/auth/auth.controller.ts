import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authuser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return await this.authService.register(user);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() user: AuthUserDto, 
    @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(user, response);
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    verify(@Req() req: { user: { id: string } }) {
        return this.authService.verifySession(req.user.id);
    }

    @Post('logout')
    @HttpCode(200)
    logout(@Res({ passthrough: true }) response: Response) {
        return this.authService.logout(response);
    }

    @Patch('me/password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    changeOwnPassword(
        @Req() req: { user: { id: string; email: string } },
        @Body() body: ChangeOwnPasswordDto,
    ) {
        return this.authService.changeOwnPassword(
            req.user.id,
            req.user.email,
            body,
        );
    }
}
