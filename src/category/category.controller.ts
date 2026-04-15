import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body('name') name: string, @Body('section') section: string) {
    return this.categoryService.create(name, section);
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: Partial<UpdateCategoryDto>, // O usa tu UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
}
