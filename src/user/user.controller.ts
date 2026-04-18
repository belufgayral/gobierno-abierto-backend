import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateManagedUserDto } from 'src/auth/dto/create-managed-user.dto';
import { AdminResetPasswordDto } from 'src/auth/dto/admin-reset-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateManagedUserDto) {
    return await this.userService.createManagedUser(user);
  }

  @Get()
  findAll() {
    return this.userService.findAllPublic();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const u = await this.userService.findOne(id);
    const { password: _p, ...safe } = u;
    return safe;
  }

  @Patch(':id/password')
  @HttpCode(200)
  async resetPassword(
    @Param('id') id: string,
    @Body() body: AdminResetPasswordDto,
  ) {
    await this.userService.updatePasswordByUserId(id, body.newPassword);
    return { message: 'Contraseña actualizada', statusCode: 200 };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
