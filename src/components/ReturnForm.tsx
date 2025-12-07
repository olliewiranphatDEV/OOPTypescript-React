import { useState } from "react";
import type { useLibrary } from "../contexts/LibraryContext";

type ReturnFormProps = {
    books: ReturnType<typeof useLibrary>["books"];
    members: ReturnType<typeof useLibrary>["members"];
    onSubmit: (bookId: number, memberId: number) => void;
};

export const ReturnForm: React.FC<ReturnFormProps> = ({ books, members, onSubmit }) => {
    const [bookId, setBookId] = useState<number | "">("");
    const [memberId, setMemberId] = useState<number | "">("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (bookId === "" || memberId === "") return;
                onSubmit(Number(bookId), Number(memberId));
            }}
        >
            <h2>Return a Book</h2>
            <div>
                <label>
                    Book:
                    <select
                        value={bookId}
                        onChange={e =>
                            setBookId(e.target.value ? Number(e.target.value) : "")
                        }
                    >
                        <option value="">Select book</option>
                        {books.map(b => (
                            <option key={b.id} value={b.id}>
                                [{b.id}] {b.title}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Member:
                    <select
                        value={memberId}
                        onChange={e =>
                            setMemberId(e.target.value ? Number(e.target.value) : "")
                        }
                    >
                        <option value="">Select member</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>
                                [{m.id}] {m.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button type="submit">Return</button>
        </form>
    );
};
