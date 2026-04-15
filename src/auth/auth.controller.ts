import { Body, Controller, HttpCode, Post, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authuser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

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
    verify(@Req() req: any) {
        return {
            statusCode: 200,
            user: req.user,
        };
    }

    @Post('logout')
    @HttpCode(200)
    logout(@Res({ passthrough: true }) response: Response) {
        return this.authService.logout(response);
    }
}
