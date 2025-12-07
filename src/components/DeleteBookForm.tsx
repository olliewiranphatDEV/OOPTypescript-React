import { useState } from "react";
import { Book } from "../domain/Book";

type DeleteBookFormProps = {
    books: Book[];
    onSubmit: (bookId: number) => void;
};

export const DeleteBookForm: React.FC<DeleteBookFormProps> = ({ books, onSubmit }) => {
    const [bookId, setBookId] = useState<number | "">("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (bookId === "") return;
                onSubmit(Number(bookId));
            }}
        >
            <h2>Delete a Book</h2>
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
            <button type="submit">Delete</button>
        </form>
    );
};
