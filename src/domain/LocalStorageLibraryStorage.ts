import type { ILibraryStorage } from "./ILibraryStorage";
import { Book } from "./Book";
import { Member } from "./Member";

const BOOK_KEY = "library_books";
const MEMBER_KEY = "library_members";

export class LocalStorageLibraryStorage implements ILibraryStorage {
    loadBooks(): Book[] {
        const raw = localStorage.getItem(BOOK_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as {
            id: number;
            title: string;
            author: string;
            _available: boolean;
        }[];

        return parsed.map(
            b => new Book(b.id, b.title, b.author, b._available)
        );
    }

    loadMembers(): Member[] {
        const raw = localStorage.getItem(MEMBER_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as {
            id: number;
            name: string;
            borrowedBookIds: number[];
        }[];

        return parsed.map(p => {
            const m = new Member(p.id, p.name);
            // ดึง borrowedBookIds กลับเข้า protected field (แบบ hack นิดนึง)
            (m as any).borrowedBookIds = p.borrowedBookIds || [];
            return m;
        });
    }

    saveBooks(books: Book[]): void {
        const payload = books.map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            _available: b.isAvailable
        }));
        localStorage.setItem(BOOK_KEY, JSON.stringify(payload));
    }

    saveMembers(members: Member[]): void {
        const payload = members.map(m => ({
            id: m.id,
            name: m.name,
            borrowedBookIds: (m as any).borrowedBookIds || []
        }));
        localStorage.setItem(MEMBER_KEY, JSON.stringify(payload));
    }
}
// implement interface