import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, FileType } from './entities/file.entity';
import { STORAGE_PROVIDER, type StorageProvider } from '../storage/storage.provider.interface';
import { FileDto } from './dto/file.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        @Inject(STORAGE_PROVIDER)
        private readonly storageProvider: StorageProvider,
    ) { }

    async uploadFile(
        file: Express.Multer.File, categoryId: number, customName: string, trimester: string | undefined, year: number | undefined, req: any,
    ): Promise<File> {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('No tienes permisos de administrador');
        }

        const filePath = await this.storageProvider.upload(file, `category-${categoryId}`);

        const fileType = this.detectFileType(file.mimetype);

        const newFile = this.fileRepository.create({
            name: customName || Buffer.from(file.originalname, 'latin1').toString('utf8'),
            filePath,
            type: fileType,
            mimeType: file.mimetype,
            size: file.size,
            trimester,
            year,
            category: { id: categoryId },
        });

        return this.fileRepository.save(newFile);
    }

    async findAll(req: any): Promise<File[]> {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('No tienes permisos de administrador');
        }
        return this.fileRepository.find({ relations: ['category'] });
    }

    async findByCategory(categorySlug: string): Promise<FileDto[]> {
        const files = await this.fileRepository.find({
            where: {
                category: {
                    slug: categorySlug
                }
            }
        });
        return files.map(f => new FileDto(f.id, f.name, f.createdAt, f.size || 0, f.trimester, f.year));
    }

    async findOne(id: string): Promise<File> {
        const file = await this.fileRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!file) throw new NotFoundException(`Archivo con id ${id} no encontrado`);

        return file;
    }

    async update(id: string, name?: string, trimester?: string, year?: number): Promise<File> {
        const file = await this.findOne(id);
        if (name !== undefined) file.name = name;
        if (trimester !== undefined) file.trimester = trimester;
        if (year !== undefined) file.year = year;
        return this.fileRepository.save(file);
    }

    async remove(id: string): Promise<void> {
        const file = await this.findOne(id);
        await this.storageProvider.delete(file.filePath);
        await this.fileRepository.remove(file);
    }

    private detectFileType(mimetype: string): FileType {
        if (mimetype === 'application/pdf') return FileType.PDF;
        if (mimetype.startsWith('image/')) return FileType.IMAGE;
        if (
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
            return FileType.DOC;
        return FileType.OTHER;
    }
}
