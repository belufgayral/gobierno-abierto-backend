import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authuser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type {Response} from 'express';

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
}
