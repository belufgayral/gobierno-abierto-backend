import {
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
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';

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
    const userLogin = await this.userService.getUserByEmail(user.email);

    const password_valid = await bcrypt.compare(
      user.password,
      userLogin.password,
    );
    if (!password_valid)
      throw new ForbiddenException('Credenciales invalidas.');

    const role = userLogin.role || 'admin';

    const payload = {
      sub: userLogin.id,
      email: userLogin.email,
      role,
      name: userLogin.name,
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
      user: {
        id: userLogin.id,
        email: userLogin.email,
        name: userLogin.name,
        role,
      },
    };
  }

  logout(response: Response) {
    response.clearCookie('token');
    return {
      message: 'Logout exitoso',
      statusCode: 200,
    };
  }

  /** Datos de sesión desde la DB (nombre, rol, etc. siempre actualizados; no depende del contenido del JWT). */
  async verifySession(userId: string) {
    const u = await this.userService.findOne(userId);
    return {
      statusCode: 200,
      user: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
      },
    };
  }

  async changeOwnPassword(
    userId: string,
    email: string,
    dto: ChangeOwnPasswordDto,
  ) {
    const account = await this.userService.findOne(userId);
    if (account.email !== email) {
      throw new UnauthorizedException();
    }
    const password_valid = await bcrypt.compare(
      dto.currentPassword,
      account.password,
    );
    if (!password_valid) {
      throw new ForbiddenException('La contraseña actual no es correcta.');
    }
    await this.userService.updatePasswordByUserId(userId, dto.newPassword);
    return { message: 'Contraseña actualizada', statusCode: 200 };
  }
}
