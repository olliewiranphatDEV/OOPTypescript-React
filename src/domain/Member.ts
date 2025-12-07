export class Member {
    protected borrowedBookIds: number[] = [];
    public readonly id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public addBorrowedBook(bookId: number): void {
        this.borrowedBookIds.push(bookId);
    }

    public removeBorrowedBook(bookId: number): void {
        this.borrowedBookIds = this.borrowedBookIds.filter(id => id !== bookId);
    }

    public hasBorrowed(bookId: number): boolean {
        return this.borrowedBookIds.includes(bookId);
    }

    public get borrowedCount(): number {
        return this.borrowedBookIds.length;
    }
}

// ใช้ protected ให้ subclass เอาไปใช้ต่อได้ในอนาคต เช่น PremiumMember เป็นต้น