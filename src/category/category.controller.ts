import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    ParseIntPipe,
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  
  @Controller('category')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post()
    create(@Body('name') name: string) {
      return this.categoryService.create(name);
    }
  
    @Get()
    findAll() {
      return this.categoryService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.categoryService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.categoryService.remove(id);
    }
  }
