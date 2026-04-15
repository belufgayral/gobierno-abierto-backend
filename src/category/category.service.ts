import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(name: string, section: string): Promise<Category> {
    const existing = await this.categoryRepository.findOne({ where: { name } });
    if (existing)
      throw new ConflictException(`La categoría "${name}" ya existe`);

    const category = this.categoryRepository.create({ name, section });
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['files'],
    });
    if (!category)
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async update(id: number, updateData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);

    if (updateData.name && updateData.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: { name: updateData.name },
      });
      if (existing) {
        throw new ConflictException(
          `La categoría "${updateData.name}" ya está en uso`,
        );
      }
    }

    this.categoryRepository.merge(category, updateData);
    return this.categoryRepository.save(category);
  }
}
