import { IsString, MinLength } from 'class-validator';

export class AdminResetPasswordDto {
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres.' })
  newPassword: string;
}
