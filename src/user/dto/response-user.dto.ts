import { HttpStatus } from "@nestjs/common";
interface ResponseObject {
    status: HttpStatus;
    message: string;
    id: number | null;
    email: String | null;
}
export class ResponseUserDto {
    status: HttpStatus;
    message: string;
    id: number | null;
    email: String | null;

    constructor(obj: ResponseObject) {
    // constructor(status: HttpStatus, msg: string, id: number | null, mail: string | null) {
        this.status = obj.status;
        this.message = obj.message;
        this.id = obj.id ?? null;
        this.email = obj.email ?? null;
    }
}
