import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../storage.provider.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  async upload(file: Express.Multer.File, destination: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', destination);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedName = originalName.replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `uploads/${destination}/${fileName}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  getUrl(filePath: string): string {
    return `/${filePath}`;
  }
}