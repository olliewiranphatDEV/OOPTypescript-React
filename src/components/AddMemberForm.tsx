import { useState } from "react";

export const AddMemberForm: React.FC<{ onSubmit: (name: string) => void }> = ({ onSubmit }) => {
    const [name, setName] = useState("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (!name.trim()) return;
                onSubmit(name.trim());
                setName("");
            }}
        >
            <h2>Add a Member</h2>
            <div>
                <label>
                    Name:{" "}
                    <input value={name} onChange={e => setName(e.target.value)} />
                </label>
            </div>
            <button type="submit">Save</button>
        </form>
    );
};