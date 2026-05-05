import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../storage.provider.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  async upload(
    file: Express.Multer.File,
    destination: string,
  ): Promise<string> {
    const storageBase = process.env.STORAGE_PATH;
    console.log('Valor de STORAGE_PATH:', process.env.STORAGE_PATH);
    if (!storageBase) throw new Error('No hay variable de entorno definida para la carpeta fisica donde se guardan los archivos.');

    const uploadDir = path.resolve(path.join(storageBase, destination));

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const sanitizedName = originalName.replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `${storageBase}/${destination}/${fileName}`;
  }

  async delete(filePath: string): Promise<void> {
    const storageBase = process.env.STORAGE_PATH || path.join(process.cwd(), 'uploads');
    if (!storageBase) throw new Error('No hay variable de entorno definida para la carpeta fisica donde se guardan los archivos.');

    const relativePath = filePath.replace('uploads/', '');

    const fullPath = path.join(storageBase, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  getUrl(filePath: string): string {
    return `/${filePath}`;
  }
}
