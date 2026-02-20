import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    StorageModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
