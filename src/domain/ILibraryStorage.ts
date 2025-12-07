import { Book } from "./Book";
import { Member } from "./Member";

export interface ILibraryStorage {
    loadBooks(): Book[];
    loadMembers(): Member[];
    saveBooks(books: Book[]): void;
    saveMembers(members: Member[]): void;
}

// กำหนดสัญญาเรื่องการจัดเก็บข้อมูล (เก็บใน localStorage / DB จริง ก็ใช้ interface เดียวกัน):