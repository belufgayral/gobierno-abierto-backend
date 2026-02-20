export interface StorageProvider {
    upload(file: Express.Multer.File, destination: string): Promise<string>;
    delete(filePath: string): Promise<void>;
    getUrl(filePath: string): string;
  }
  
  export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';