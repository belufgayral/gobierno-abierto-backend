export class FileDto {
    id: string;
    title: string;
    date: Date;
    size: number;
    constructor(id: string, title: string, date: Date, size: number) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.size = size;
    }
}