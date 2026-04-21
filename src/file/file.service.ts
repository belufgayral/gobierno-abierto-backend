import {
    Injectable,
    Inject,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { File, FileType } from './entities/file.entity';
import { STORAGE_PROVIDER, type StorageProvider } from '../storage/storage.provider.interface';
import { FileDto } from './dto/file.dto';

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
        customName: string,
        trimester: string | undefined,
        year: number | undefined,
        isAnnualBudget: boolean | undefined,
        req: any,
    ): Promise<File> {
        if (!['admin', 'super_admin'].includes(req.user.role)) {
            throw new ForbiddenException('No tienes permisos de administrador');
        }

        if (isAnnualBudget && !year) {
            throw new BadRequestException('El presupuesto anual requiere un año válido');
        }
        if (isAnnualBudget && year) {
            await this.ensureAnnualBudgetUniqueForYear(year);
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
            isAnnualBudget: Boolean(isAnnualBudget),
            category: { id: categoryId },
        });

        return this.fileRepository.save(newFile);
    }

    async findAll(req: any): Promise<File[]> {
        if (!['admin', 'super_admin'].includes(req.user.role)) {
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
        return files.map(
            (f) =>
                new FileDto(
                    f.id,
                    f.name,
                    f.createdAt,
                    f.size || 0,
                    f.trimester,
                    f.year,
                    f.isAnnualBudget,
                    f.filePath,
                    f.type,
                ),
        );
    }

    async findOne(id: string): Promise<File> {
        const file = await this.fileRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!file) throw new NotFoundException(`Archivo con id ${id} no encontrado`);

        return file;
    }

    async update(
        id: string,
        name?: string,
        trimester?: string,
        year?: number,
        isAnnualBudget?: boolean,
    ): Promise<File> {
        const file = await this.findOne(id);
        const nextIsAnnualBudget = isAnnualBudget ?? file.isAnnualBudget;
        const nextYear = year ?? file.year;

        if (nextIsAnnualBudget && !nextYear) {
            throw new BadRequestException('El presupuesto anual requiere un año válido');
        }
        if (nextIsAnnualBudget && nextYear) {
            await this.ensureAnnualBudgetUniqueForYear(nextYear, file.id);
        }

        if (name !== undefined) file.name = name;
        if (trimester !== undefined) file.trimester = trimester;
        if (year !== undefined) file.year = year;
        if (isAnnualBudget !== undefined) file.isAnnualBudget = isAnnualBudget;
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

    private async ensureAnnualBudgetUniqueForYear(
        year: number,
        excludeFileId?: string,
    ): Promise<void> {
        const existing = await this.fileRepository.findOne({
            where: {
                year,
                isAnnualBudget: true,
                ...(excludeFileId ? { id: Not(excludeFileId) } : {}),
            },
        });

        if (existing) {
            throw new ConflictException(`Ya existe un presupuesto anual cargado para el año ${year}`);
        }
    }
}
