import { HttpStatus } from "@nestjs/common";
interface ResponseObject {
    status: HttpStatus;
    message: string;
    id: string | null;
    email: String | null;
}
export class ResponseUserDto {
    status: HttpStatus;
    message: string;
    id: string | null;
    email: String | null;

    constructor(obj: ResponseObject) {
        this.status = obj.status;
        this.message = obj.message;
        this.id = obj.id ?? null;
        this.email = obj.email ?? null;
    }
}
