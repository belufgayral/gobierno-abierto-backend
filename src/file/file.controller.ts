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
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FileService } from './file.service';
  import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
  
  @Controller('file')
  export class FileController {
    constructor(private readonly fileService: FileService) {}
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body('categoryId', ParseIntPipe) categoryId: number,
      @Req() req
    ) {
      return this.fileService.uploadFile(file, categoryId, req);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req) {
      return this.fileService.findAll(req);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.fileService.findOne(id);
    }
    
    @Get('cat/:category')
    findByCategory(@Param('category') category: string) {
      return this.fileService.findByCategory(category);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.fileService.remove(id);
    }
  }
