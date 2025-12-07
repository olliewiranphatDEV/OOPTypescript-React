# ภาพรวมโครงสร้าง
แบ่งเป็น 3 ชั้นหลัก ๆ

1. Domain / OOP (ไม่รู้จัก React)
  • Book.ts
  • Member.ts
  • ILibraryStorage.ts
  • LocalStorageLibraryStorage.ts
  • LibraryManager.ts

2. Bridge เชื่อม Domain ↔ React
  • LibraryContext.tsx

3. React UI
  • main.ts
  • App.tsx
  • AddBookForm.tsx
  • AddMemberForm.tsx
  • BorrowForm.tsx
  • (และ MainNavBar.tsx)

### เวลาผู้ใช้กดปุ่ม → React เรียก LibraryManager → LibraryManager เซฟ/โหลดผ่าน LocalStorageLibraryStorage → กลับมาที่ React แสดงผลใหม่

# main.ts – จุดเริ่มรัน React
``` bash
createRoot(document.getElementById('root')!).render(
  <LibraryProvider>
    <App />
  </LibraryProvider>
)
```
• หา div#root ใน index.html
• ใช้ createRoot(...).render(...) เพื่อ mount React app
• สำคัญ: ครอบ <App /> ด้วย <LibraryProvider>
→ ทำให้ทุก component ข้างในใช้ useLibrary() ได้
→ คอนเซ็ปต์เหมือน “ห่อ App ด้วย store ของระบบ library”

# LibraryContext.tsx – เชื่อม React กับ OOP
``` bash
type LibraryContextValue = {
    manager: LibraryManager;
    books: Book[];
    members: Member[];
    refresh: () => void;
};
```
1. กำหนดว่า context ตัวนี้จะส่งอะไรออกไป:
manager + books + members + ฟังก์ชัน refresh()

2. สร้าง LibraryManager แค่ครั้งเดียว
``` bash
const [manager] = useState(() => {
    const storage = new LocalStorageLibraryStorage();
    return new LibraryManager(storage);
});
```
• ใช้ useState แบบ lazy-init → ฟังก์ชันข้างในรัน ครั้งเดียว ตอน mount
• สร้าง LocalStorageLibraryStorage ก่อน
• ส่งเข้าไปให้ new LibraryManager(storage)
• ใน constructor ของ LibraryManager มันจะไป loadBooks() / loadMembers() จาก Local Storage ให้เลย
⇒ ตอนเปิดหน้าเว็บครั้งแรก ข้อมูลที่เคยกดไว้จะถูกดึงขึ้นมา

3. ทำให้ React รู้ว่าข้อมูลเปลี่ยนแล้ว
``` bash
const [booksVersion, setBooksVersion] = useState(0);

const refresh = () => {
    setBooksVersion(v => v + 1);
};
```
• เราไม่ได้เก็บ books / members ใน state ตรง ๆ
• แต่ให้ LibraryManager เป็นเจ้าของ “ข้อมูลจริง”
• booksVersion เป็นแค่ตัวเลขเพิ่ม ๆ เพื่อล่อให้ React re-render

``` bash
const value: LibraryContextValue = useMemo(
    () => ({
        manager,
        books: manager.getBooks(),
        members: manager.getMembers(),
        refresh
    }),
    [manager, booksVersion]
);
```
• ทุกครั้งที่ booksVersion เปลี่ยน → useMemo จะรันใหม่
  • ดึง books จาก manager.getBooks()
  • ดึง members จาก manager.getMembers()
• แล้วส่งทั้งหมดเข้า LibraryContext.Provider

4. Hook useLibrary
``` bash
export const useLibrary = (): LibraryContextValue => {
    const ctx = useContext(LibraryContext);
    if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
    return ctx;
};
```
• ทำให้ component อื่นเรียก const { books, members, manager, refresh } = useLibrary();
• ถ้าเผลอใช้ข้างนอก <LibraryProvider> จะโยน error ชัดเจน

# Domain Layer – Book / Member / Storage / Manager
1. Book.ts
``` bash
export class Book {
    public readonly id: number;
    public title: string;
    public author: string;
    private _available: boolean;
    ...
}
```
• ตัวแทน “หนังสือ 1 เล่ม”
• id, title, author = properties
• _available = สถานะภายใน (private)
• isAvailable = getter ไว้อ่านจากข้างนอก
• markBorrowed() = หนังสือถูกยืม → _available = false
• markReturned() = คืนแล้ว → _available = true

2. Member.ts
``` bash
export class Member {
    protected borrowedBookIds: number[] = [];
    public readonly id: number;
    public name: string;
    ...
}
```
• ตัวแทน “สมาชิก 1 คน”
• เก็บ borrowedBookIds = id ของหนังสือที่สมาชิกคนนั้นยืมอยู่ (เป็น protected)
• addBorrowedBook(bookId) / removeBorrowedBook(bookId) / hasBorrowed(bookId) = จัดการรายการที่ยืม
• borrowedCount = จำนวนหนังสือที่ยืม
• ตรงนี้คือแกนหลักของ “business logic การยืม”

3. ILibraryStorage.ts – สัญญาเรื่องการเก็บข้อมูล
``` bash
export interface ILibraryStorage {
    loadBooks(): Book[];
    loadMembers(): Member[];
    saveBooks(books: Book[]): void;
    saveMembers(members: Member[]): void;
}
```
• เป็น interface ที่บอกว่า “storage ไหนก็ตาม ถ้าอยากให้ LibraryManager ใช้ ต้องมี method พวกนี้”
• ทำให้ LibraryManager ไม่รู้รายละเอียดว่ามันเซฟลง Local Storage, API, หรือ Database จริง ๆ
→ อนาคตเปลี่ยนเป็น API ก็แค่เขียน class ใหม่มา implements interface นี้

4. LocalStorageLibraryStorage.ts – ใช้ Local Storage จริง ๆ
``` bash
const BOOK_KEY = "library_books";
const MEMBER_KEY = "library_members";
```
กำหนด key ที่ใช้เก็บใน localStorage

## โหลดหนังสือ
``` bash
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
```
• อ่าน string จาก localStorage
• ถ้าไม่มี → รีเทิร์น array ว่าง
• ถ้ามี → JSON.parse ให้กลายเป็น array ของ plain object
• แล้ว map แต่ละอันไปเป็น instance ของ Book จริง ๆ

## โหลดสมาชิก
``` bash 
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
        (m as any).borrowedBookIds = p.borrowedBookIds || [];
        return m;
    });
}
```
• เหมือนด้านบน แต่ต้อง “ยัด” borrowedBookIds กลับเข้าไปใน field ที่เป็น protected
• เลยใช้ (m as any).borrowedBookIds = ... (เป็น hack นิดหน่อยแต่โอเคในโปรเจ็กต์นี้)

## เซฟหนังสือ/สมาชิก
``` bash
saveBooks(books: Book[]): void {
    const payload = books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        _available: b.isAvailable
    }));
    localStorage.setItem(BOOK_KEY, JSON.stringify(payload));
}
```
• ดึงข้อมูลที่จำเป็นออกจากแต่ละ Book
• แปลงเป็น plain object
• JSON.stringify แล้วเก็บใน localStorage
• ส่วน saveMembers ก็ทำลักษณะเดียวกัน

5. LibraryManager.ts – สมองของระบบ
``` bash
private books: Book[] = [];
private members: Member[] = [];
private storage: ILibraryStorage;
```
• LibraryManager คือ “ตัวจัดการทั้งหมด”
• ถือ array ของ Book + Member
• และถือ storage ที่ implements ILibraryStorage

### constructor : ตอนถูกสร้างขึ้นมา จะดึงข้อมูลเก่าจาก storage ใส่เข้า array ทันที
``` bash
constructor(storage: ILibraryStorage) {
    this.storage = storage;

    // โหลดจาก localStorage ตอนสร้าง
    this.books = storage.loadBooks();
    this.members = storage.loadMembers();
}
```

### อ่านข้อมูล : ให้ React หรือส่วนอื่นเรียกเพื่อดูรายการ
``` bash
public getBooks(): Book[] { return this.books; }
public getMembers(): Member[] { return this.members; }
```

### เพิ่มหนังสือ/สมาชิก
``` bash
public addBook(title: string, author: string): void {
    const newId = this.books.length ? this.books[this.books.length - 1].id + 1 : 1;
    const book = new Book(newId, title, author);
    this.books.push(book);
    this.storage.saveBooks(this.books);
}
```
• สร้าง id ใหม่ (ไล่จากตัวท้าย +1)
• new Book → push → เซฟลง storage
• addMember คล้ายกัน แต่ทำกับสมาชิก

### ยืมหนังสือ
``` bash
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
```
• หา Book / Member จาก id
• เช็กเงื่อนไขผิดพลาดต่าง ๆ
• ถ้าผ่าน → เพิ่ม id หนังสือเข้า member, markBorrowed ที่ book
• เซฟทั้ง books และ members กลับลง storage
• ส่งข้อความผลลัพธ์กลับไปให้ UI เอาไป alert
• returnBook และ deleteBook / deleteMember ก็เป็น logic แนวเดียวกัน

# Flow ตัวอย่างครบ ๆ (จากคลิกจนถึง Local Storage)

1. หน้าเว็บโหลด
  • main.ts render <LibraryProvider><App /></LibraryProvider>
  • LibraryProvider สร้าง LocalStorageLibraryStorage + LibraryManager
  • LibraryManager โหลด books และ members จาก localStorage
  • App เรียก useLibrary() → ได้ books, members, manager, refresh
  • UI แสดงรายการปัจจุบัน

2. ผู้ใช้กดปุ่ม Borrow a Book
  • setActivePanel("BORROW")
  • <BorrowForm ...> ถูกแสดง

3. ผู้ใช้เลือกหนังสือ + สมาชิก แล้วกด submit
  • BorrowForm เรียก onSubmit(bookId, memberId)

4. ใน App.tsx:
``` bash
alert(manager.borrowBook(bookId, memberId));
refresh();
setActivePanel("NONE");
```
• manager.borrowBook:
  - เปลี่ยน state ใน memory (books, members)
  - เซฟข้อมูลใหม่ลง localStorage ผ่าน LocalStorageLibraryStorage
• refresh() → ทำให้ context รีสร้าง value ใหม่ → App re-render
• ปิดฟอร์ม

5. React แสดงผลใหม่
  • Book ที่ถูกยืมจะขึ้น (borrowed)
  • ใน DevTools → Application → Local Storage ก็จะเห็น borrowedBookIds ถูกอัปเดตตามรูปที่ส่งมา

## version นี้ใช้ LocalStorage ตรง ๆ ผ่าน LocalStorageLibraryStorage
ถ้าอยาก “เปลี่ยนให้ใช้ Zustand persist แทน” แปลว่าให้ Zustand เป็นตัวเก็บ + โหลดจาก localStorage ให้เราอัตโนมัติ แทนที่ class LocalStorageLibraryStorage + LibraryContext เดิม

### ✨ แต่ต้องบอกก่อนว่า:
``` bash
สไตล์เดิม = OOP (Book/Member/LibraryManager + Storage interface)
```
``` bash
สไตล์ Zustand = เอา state + logic ไปไว้ใน store (เป็นแบบ functional/React มากกว่า)
```
→ เลยจะเป็น version 2 ของโปรเจกต์ ที่ง่ายต่อการ persist แต่ไม่ใช้ class OOP แล้ว