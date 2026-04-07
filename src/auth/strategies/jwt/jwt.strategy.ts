import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Aquí está el truco: extraemos de la cookie en lugar del Header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'jorge', // Usa variables de entorno en prod
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyectará en req.user
    return { username: payload.username, role: payload.role };
  }
}