import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      StorageModule,
    ],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService]
})
export class UserModule {}
