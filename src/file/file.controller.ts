import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    Body,
    ParseIntPipe,
    UseGuards,
    Req,
    BadRequestException,
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
      @Body('customName') customName: string,
      @Body('trimester') trimester: string,
      @Body('year') year: string,
      @Body('isAnnualBudget') isAnnualBudget: string,
      @Req() req
    ) {
      const normalizedTrimester =
        trimester === "null" || trimester === "" ? undefined : trimester;
      const parsedYear = year ? parseInt(year, 10) : undefined;
      if (year !== undefined && year !== "" && Number.isNaN(parsedYear)) {
        throw new BadRequestException('El año es inválido');
      }
      const parsedIsAnnualBudget = String(isAnnualBudget).toLowerCase() === "true";
      return this.fileService.uploadFile(
        file,
        categoryId,
        customName,
        normalizedTrimester,
        parsedYear,
        parsedIsAnnualBudget,
        req,
      );
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

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
      @Param('id') id: string, 
      @Body('name') name: string,
      @Body('trimester') trimester: string,
      @Body('year') year: string,
      @Body('isAnnualBudget') isAnnualBudget: string,
    ) {
      const normalizedTrimester =
        trimester === "null" || trimester === "" ? undefined : trimester;
      const parsedYear = year ? parseInt(year, 10) : undefined;
      if (year !== undefined && Number.isNaN(parsedYear)) {
        throw new BadRequestException('El año es inválido');
      }
      const parsedIsAnnualBudget =
        isAnnualBudget !== undefined
          ? String(isAnnualBudget).toLowerCase() === "true"
          : undefined;
      return this.fileService.update(id, name, normalizedTrimester, parsedYear, parsedIsAnnualBudget);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.fileService.remove(id);
    }
  }
