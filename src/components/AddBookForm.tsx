import { useState } from "react";

export const AddBookForm: React.FC<{ onSubmit: (title: string, author: string) => void }> = ({
    onSubmit,
}) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (!title.trim() || !author.trim()) return;
                onSubmit(title.trim(), author.trim());
                setTitle("");
                setAuthor("");
            }}
        >
            <h2>Add a Book</h2>
            <div>
                <label>
                    Title:{" "}
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Author:{" "}
                    <input value={author} onChange={e => setAuthor(e.target.value)} />
                </label>
            </div>
            <button type="submit">Save</button>
        </form>
    );
};