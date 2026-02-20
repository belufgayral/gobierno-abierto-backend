import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, FileType } from './entities/file.entity';
import { STORAGE_PROVIDER, type StorageProvider } from '../storage/storage.provider.interface';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        @Inject(STORAGE_PROVIDER)
        private readonly storageProvider: StorageProvider,
    ) { }

    async uploadFile(
        file: Express.Multer.File,
        categoryId: number,
    ): Promise<File> {
        const filePath = await this.storageProvider.upload(file, `category-${categoryId}`);

        const fileType = this.detectFileType(file.mimetype);

        const newFile = this.fileRepository.create({
            name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
            filePath,
            type: fileType,
            mimeType: file.mimetype,
            size: file.size,
            category: { id: categoryId },
        });

        return this.fileRepository.save(newFile);
    }

    async findAll(): Promise<File[]> {
        return this.fileRepository.find({ relations: ['category'] });
    }

    async findOne(id: string): Promise<File> {
        const file = await this.fileRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!file) throw new NotFoundException(`Archivo con id ${id} no encontrado`);

        return file;
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
