import { Book } from "./Book";
import { Member } from "./Member";
import type { ILibraryStorage } from "./ILibraryStorage";

export class LibraryManager {
    private books: Book[] = [];
    private members: Member[] = [];
    private storage: ILibraryStorage;

    constructor(storage: ILibraryStorage) {
        this.storage = storage;

        // โหลดจาก localStorage ตอนสร้าง
        this.books = storage.loadBooks();
        this.members = storage.loadMembers();
    }

    public getBooks(): Book[] {
        return this.books;
    }

    public getMembers(): Member[] {
        return this.members;
    }

    public addBook(title: string, author: string): void {
        const newId = this.books.length ? this.books[this.books.length - 1].id + 1 : 1;
        const book = new Book(newId, title, author);
        this.books.push(book);
        this.storage.saveBooks(this.books);
    }

    public addMember(name: string): void {
        const newId = this.members.length ? this.members[this.members.length - 1].id + 1 : 1;
        const member = new Member(newId, name);
        this.members.push(member);
        this.storage.saveMembers(this.members);
    }

    public borrowBook(bookId: number, memberId: number): string {
        const book = this.books.find(b => b.id === bookId);
        const member = this.members.find(m => m.id === memberId);

        if (!book) return "Book not found";
        if (!member) return "Member not found";
        if (!book.isAvailable) return "Book already borrowed";

        member.addBorrowedBook(book.id);
        book.markBorrowed();

        this.storage.saveBooks(this.books);
        this.storage.saveMembers(this.members);

        return "Borrow successful";
    }

    public returnBook(bookId: number, memberId: number): string {
        const book = this.books.find(b => b.id === bookId);
        const member = this.members.find(m => m.id === memberId);

        if (!book || !member) return "Not found";
        if (!member.hasBorrowed(bookId)) return "This member did not borrow this book";

        member.removeBorrowedBook(book.id);
        book.markReturned();

        this.storage.saveBooks(this.books);
        this.storage.saveMembers(this.members);

        return "Return successful";
    }

    public deleteBook(bookId: number): void {
        this.books = this.books.filter(b => b.id !== bookId);
        this.storage.saveBooks(this.books);
    }

    public deleteMember(memberId: number): void {
        this.members = this.members.filter(m => m.id !== memberId);
        this.storage.saveMembers(this.members);
    }
}
