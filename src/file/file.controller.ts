import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    Body,
    ParseIntPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FileService } from './file.service';
  import { memoryStorage } from 'multer';
  
  @Controller('file')
  export class FileController {
    constructor(private readonly fileService: FileService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body('categoryId', ParseIntPipe) categoryId: number,
    ) {
      return this.fileService.uploadFile(file, categoryId);
    }
  
    @Get()
    findAll() {
      return this.fileService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.fileService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.fileService.remove(id);
    }
  }
