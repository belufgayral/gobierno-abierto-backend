export class FileDto {
    id: string;
    title: string;
    date: Date;
    size: number;
    trimester?: string;
    year?: number;
    filePath: string;
    constructor(
        id: string,
        title: string,
        date: Date,
        size: number,
        trimester?: string,
        year?: number,
        filePath?: string,
    ) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.size = size;
        this.trimester = trimester;
        this.year = year;
        this.filePath = filePath ?? '';
    }
}