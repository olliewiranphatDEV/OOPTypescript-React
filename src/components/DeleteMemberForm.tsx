import { useState } from "react";
import { Member } from "../domain/Member";

type DeleteMemberFormProps = {
    members: Member[];
    onSubmit: (memberId: number) => void;
};

export const DeleteMemberForm: React.FC<DeleteMemberFormProps> = ({ members, onSubmit }) => {
    const [memberId, setMemberId] = useState<number | "">("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (memberId === "") return;
                onSubmit(Number(memberId));
            }}
        >
            <h2>Delete a Member</h2>
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
            <button type="submit">Delete</button>
        </form>
    );
};
