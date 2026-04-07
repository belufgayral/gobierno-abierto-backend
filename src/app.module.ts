import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { File } from './file/entities/file.entity';
import { Category } from './category/entities/category.entity';
import { FileModule } from './file/file.module';
import { CategoryModule } from './category/category.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
// import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [File, Category, User],
      synchronize: true, //solo desarrollo
    }),
    FileModule,
    CategoryModule,
    StorageModule,
    UserModule,
    AuthModule
    // TestModule,
  ],
})
export class AppModule {}