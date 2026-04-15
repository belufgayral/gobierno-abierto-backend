import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async onApplicationBootstrap() {
    const allCategories = await this.categoryRepository.find();
    for (const cat of allCategories) {
      if (!cat.slug) {
        cat.slug = this.generateSlug(cat.name);
        await this.categoryRepository.save(cat);
      }
    }

    const defaultCategories = [
      { name: 'Informes de gestión', section: 'home' },
      { name: 'Guías de usuario', section: 'home' },
      { name: 'Haberes de empleados', section: 'transparencia' },
      { name: 'Recibos de funcionarios', section: 'transparencia' },
      { name: 'Declaraciones juradas', section: 'transparencia' },
      { name: 'Nómina del personal', section: 'transparencia' },
      { name: 'Reportes económicos', section: 'transparencia' },
    ];

    for (const category of defaultCategories) {
      const exists = await this.categoryRepository.findOne({
        where: { name: category.name },
      });
      if (!exists) {
        const slug = this.generateSlug(category.name);
        const newCategory = this.categoryRepository.create({ ...category, slug });
        await this.categoryRepository.save(newCategory);
      }
    }
  }

  async create(name: string, section: string): Promise<Category> {
    const existing = await this.categoryRepository.findOne({ where: { name } });
    if (existing)
      throw new ConflictException(`La categoría "${name}" ya existe`);

    const slug = this.generateSlug(name);
    const category = this.categoryRepository.create({ name, section, slug });
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
      updateData.slug = this.generateSlug(updateData.name);
    }

    this.categoryRepository.merge(category, updateData);
    return this.categoryRepository.save(category);
  }
}
