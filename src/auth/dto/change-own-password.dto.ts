import { IsString, MinLength } from 'class-validator';

export class ChangeOwnPasswordDto {
  @IsString()
  @MinLength(1, { message: 'Ingresá tu contraseña actual.' })
  currentPassword: string;

  @IsString()
  @MinLength(4, { message: 'La nueva contraseña debe tener al menos 4 caracteres.' })
  newPassword: string;
}
