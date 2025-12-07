export class Book {
    public readonly id: number;
    public title: string;
    public author: string;
    private _available: boolean;

    constructor(id: number, title: string, author: string, available: boolean = true) {
        this.id = id;
        this.title = title;
        this.author = author;
        this._available = available;
    }

    get isAvailable(): boolean {
        return this._available;
    }

    public markBorrowed(): void {
        this._available = false;
    }

    public markReturned(): void {
        this._available = true;
    }
}
