import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserDto } from './dto/authuser.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<ResponseUserDto> {
    const rsp = await this.userService.create(user);
    return new ResponseUserDto({
      status: 201,
      message: 'Usuario creado.',
      id: rsp.id,
      email: rsp.email,
    });
  }

  async login(user: AuthUserDto, response: Response) {
    const userLogin = await this.userService.getUser(user.username);
    if (!userLogin) throw new ForbiddenException('Credenciales invalidas.');

    const password_valid = await bcrypt.compare(
      user.password,
      userLogin.password,
    );
    if (!password_valid)
      throw new ForbiddenException('Credenciales invalidas.');

    const payload = {
      sub: userLogin.id,
      username: userLogin.username,
      role: 'admin',
    };

    const access_token = await this.jwtService.signAsync(payload);

    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false, // Cambia a true solo si usas HTTPS (producción)
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600000),
    });

    return {
      message: 'Login exitoso',
      statusCode: 200,
      user: { username: user.username, role: 'admin' }, // Datos para el frontend
    };
  }
}
