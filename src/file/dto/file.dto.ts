export class FileDto {
    id: string;
    title: string;
    date: Date;
    size: number;
    trimester?: string;
    year?: number;
    filePath: string;
    type?: string;
    constructor(
        id: string,
        title: string,
        date: Date,
        size: number,
        trimester?: string,
        year?: number,
        filePath?: string,
        type?: string,
    ) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.size = size;
        this.trimester = trimester;
        this.year = year;
        this.filePath = filePath ?? '';
        this.type = type;
    }
}